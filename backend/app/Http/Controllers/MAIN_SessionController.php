<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Firebase\JWT\JWT;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Cookie;
use App\Models\EmpresasModelo;
use App\Helpers\JwtAuth;
use App\Helpers\AuthSsic;
use App\Services\UserConfigService;
use App\Services\UserEmpresaService;

class MAIN_SessionController extends Controller{
  protected $jwtAuth;
  protected $authSsic;
  protected $userConfigService;
  protected $userEmpresaService;

  public function __construct(JwtAuth $jwtAuth,AuthSsic $authSsic,UserConfigService $userConfigService,UserEmpresaService $userEmpresaService){
    $this->jwtAuth = $jwtAuth;
    $this->authSsic = $authSsic;
    $this->userConfigService = $userConfigService;
    $this->userEmpresaService = $userEmpresaService;
  }

  private function registrarSesion($usuarioToken,$JwtAuth){
    $token_registro_sesion = $JwtAuth->encriptarToken(time(),"firebase",rand(10, 100));

    DB::table("teci_usuarios_bitacora_sesiones")->insert([
      "token_sesiones_registro" => $token_registro_sesion,
      "fecha_sesiones_registro" => time(),
      "usuario" => DB::table("teci_usuarios_catalogo")->where("usuario_token", $usuarioToken)->value("id"),
    ]);
  }

  private function registrarDispositivoMessaging($usuarioToken, $tokenDevice, $JwtAuth){
    $existsDevice = DB::table("teci_usuarios_dispositivos AS device")
    ->join("teci_usuarios_catalogo AS users","device.usuario","=","users.id")
    ->where(["device.dispositivo_token" =>$tokenDevice,"users.usuario_token"=>$usuarioToken])
    ->exists();

    if (!$existsDevice) {
      DB::table("teci_usuarios_dispositivos")->insert([
        "token_dispositivo" => $JwtAuth->encriptarToken(time(),"firebase",rand(10, 100)),
        "usuario"           => DB::table("teci_usuarios_catalogo")->where("usuario_token", $usuarioToken)->value("id"),
        "dispositivo_token" => $tokenDevice
      ]);
    }
  }

  public function loginUsuarioMain(Request $request){
    $arrayParams = $request->all();
    if (empty($arrayParams)) {
      return response()->json([
        'status' => 'error',
        'code' => 400,
        'message' => 'Usuario no identificado'
      ], 200);
    }

    $validate = Validator::make($arrayParams,[
      "codigo_acceso" => "required|string",
      "password" => "required|string",
      "token_device" => "nullable|string",
    ]);

    if ($validate->fails()) {
      return response()->json([
        'status' => 'error',
        'code' => 200,
        'message' => 'Error al iniciar sesión, credenciales no válidas',
        'errors' => $validate->errors()
      ], 200);
    }
    
    //echo $arrayParams['codigo_acceso'];
    $codigo_acceso = $this->jwtAuth->encriptarAccessClaves($arrayParams['codigo_acceso']);
    $password = $this->jwtAuth->encriptarAccessClaves($arrayParams['password']);
    $token_device = $arrayParams["token_device"];

    $queryUserExiste = User::where(function ($query) use ($codigo_acceso){
      $query->where('acceso_codigo',$codigo_acceso)
            ->orWhere('acceso_email',$codigo_acceso);
    })
    ->exists();

    if (!$queryUserExiste) {
      return response()->json([
        'status' => 'error',
        'code' => 401,
        'message' => 'Usuario no encontrado'
      ], 401);
    }

    $queryLogin = User::where(function ($query) use ($codigo_acceso){
      $query->where('acceso_codigo',$codigo_acceso)
            ->orWhere('acceso_email',$codigo_acceso);
    })
    ->where('acceso_password',$password)
    ->select('usuario_token','usuario_folio','usuario_fecha_registro','usuario_alias','usuario_imagen_perfil','login_permission','jerarquia_main')
    ->first();
    //echo $queryLogin->id;
    if (!$queryLogin) {
      \Log::warning('Contraseña incorrecta para usuario existente', [
        'codigo_acceso' => $codigo_acceso,
        'ip' => $request->ip(),
        'user_agent' => $request->userAgent(),
        'timestamp' => now(),
      ]);

      return response()->json([
        'status' => 'error',
        'code' => 401,
        'message' => 'Contraseña incorrecta'
      ], 401);
    }

    if (!$queryLogin->login_permission) {
      \Log::warning('Intento de login con usuario bloqueado', [
        'usuario_token' => $queryLogin->usuario_token,
        'ip' => $request->ip(),
        'timestamp' => now(),
      ]);

      return response()->json([
        'status' => 'error',
        'code' => 403,
        'message' => 'Acceso no permitido, usuario bloqueado'
      ], 403);
    }
    
    $listadoModulos = DB::table('sos_modulos_sistemas')
    ->orderBy("orden_listado","ASC")
    ->get()
    ->map(fn($mod) => [
      "modulo_token" => $mod->token_modulo,
      "modulo_nombre" => $mod->modulo,
      "modulo_mantenimiento" => (bool) $mod->mantenimiento,
      "modulo_acceso" => (bool) $mod->acceso,
    ]);

    if ($listadoModulos->isEmpty()) {
      return response()->json([
        'status' => 'error',
        'code' => 401,
        'message' => 'Acceso no permitido, módulos en construcción o en mantenimiento',
      ], 401); // O el código de estado que prefieras
    }

    $user_lenguaje = User::join("teci_user_settings AS sett", "teci_usuarios_catalogo.id", "=", "sett.usuario")
    ->where('teci_usuarios_catalogo.usuario_token',$queryLogin->usuario_token)
    ->value('sett.lenguaje');
    
    $usuario_imagen_perfil = $this->jwtAuth->encriptaBase64(Storage::path('public/settings/default-profile.png'));
    $name_user_data = $this->jwtAuth->desencriptar($queryLogin->usuario_alias);

    if ($token_device != ""){
      $this->registrarDispositivoMessaging($queryLogin->usuario_token,$token_device,$this->jwtAuth);
    }

    $histBitacora = DB::table("teci_bitacora_actividad AS histBitacora")
    ->join("teci_usuarios_catalogo AS users","histBitacora.usuario","=","users.id")
    ->where("users.usuario_token",$queryLogin->usuario_token)->get();

    $update_pass = count($histBitacora) == 0 ? true : false;

    $data_user = array(
      "name" => $name_user_data,
      "avatar" => $usuario_imagen_perfil,
      "settings_lenguaje" => $user_lenguaje,
      "habilita_reembolsos" => false,
      "acreedor" => [],
      "company" => [],
    );
    
    $token_payload = [
      "user_token" => $queryLogin->usuario_token,
      "iat" => time(), //Es una reclamación estándar (claim) definida en el protocolo JWT (RFC 7519) que indica el momento exacto en que se creó el token.
      "exp" => time() + (30 * 60) // 30 minutos
    ];
    $key = config('services.jwt.secret');
    $jwt = JWT::encode($token_payload, $key, 'HS256');
    $this->registrarSesion($queryLogin->usuario_token,$this->jwtAuth);
    $dataMensaje = array(
      "status" => "success",
      "code" => 200,
      "modulo_destino" => "./plataformas/home",
      "large_token_access" => $jwt,
      "dataUsers" => $data_user,
      "lenguaje" => $user_lenguaje,
      "update_pass" => $update_pass
    );
    
    $response_login = response()->json($dataMensaje, 200);
    if ($dataMensaje['status'] == 'success') {
      $response_login->withCookie(cookie(
        'code_inside',        //nombre de la cookie
        $jwt,                 //El JWT generado
        240,                  //4 horas exactas
        '/',                  //ruta
        '.sos-mexico.com.mx', //Dominio
        true,                 //Secure (Cambiar a true solo con HTTPS)
        true,                 //HttpOnly (Protección contra robo por JS)
        false,                //Raw define si el valor de la cookie debe enviarse al navegador de forma "cruda" o si debe pasar por un proceso de codificación automática
        'None'              //SameSite Lax Strict None
      ));
    }
    return $response_login;
  }

  public function getContextModulos(Request $request){
    $usuario = $request->get('user_auth')->keter_davidic;

    if (!$usuario) {
      return response()->json(['status' => 'error','message' => 'Usuario no autenticado'], 401);
    }

    $listadoModulos = $this->userConfigService->getModulos();

    $dataMensaje = array(
      "status" => "success",
      "code" => 200,
      "listadoModulos" => $listadoModulos,
    );
    
    return response()->json($dataMensaje, $dataMensaje['code']);
  }

  public function getContextUserSettings(Request $request){
    $usuario = $request->get('user_auth')->keter_davidic;

    if (!$usuario) {
      return response()->json(['status' => 'error','message' => 'Usuario no autenticado'], 401);
    }

    $settingsUser = $this->userConfigService->getUserSettings($usuario);
    
    $dataMensaje = array(
      "status" => "success",
      "code" => 200,
      "main_jerarquia" => $settingsUser->jerarquia_main,
      "lenguaje" => $settingsUser->lenguaje,
      "main_privilegio_crear" => (bool)$settingsUser->privilegio_crear,
      "main_privilegio_editar" => (bool)$settingsUser->privilegio_editar,
      "main_privilegio_consulta" => (bool)$settingsUser->privilegio_consulta,
      "main_privilegio_elimina" => (bool)$settingsUser->privilegio_elimina,
      "main_privilegio_ver_docs" => (bool)$settingsUser->privilegio_ver_docs,
    );
    
    return response()->json($dataMensaje, $dataMensaje['code']);
  }

  public function catalogoEmpresasVinculadas(Request $request){
    $usuario = $request->get('user_auth')->keter_davidic; // Laravel lo detecta automáticamente del merge
    //return response()->json(['status' => 'error','code' => 200,'message' => $usuario]);

    if (!$usuario) {
      return response()->json(['status' => 'error','message' => 'Usuario no autenticado'], 401);
    }

    $JwtAuth = new \App\Helpers\JwtAuth();
    $empList = EmpresasModelo::join("sos_personas AS people", "emp.persona", "=", "people.id")
    ->join("teci_pais AS ispa", "people.nacionalidad", "=", "ispa.id")
    ->join("main_empresa_usuario AS empuser", "emp.id", "=", "empuser.empresa")
    ->join("teci_usuarios_catalogo AS users", "empuser.usuario", "=", "users.id")
    ->where([
      "emp.status_empresa" => TRUE, 
      "users.usuario_token" => $usuario
    ])
    ->get();

    foreach ($empList as $value) {
      //echo $JwtAuth->encriptar("Value Point");
      $nombreEmpresa = $value->denominacion_rs == '' ? $JwtAuth->desencriptarNombres($value->paterno, $value->materno, $value->nombre) : $JwtAuth->desencriptar($value->denominacion_rs);
      $name_abrev = $value->abrev_nombre;
      $logoTipo = "https://downloads.sos-mexico.com.mx/empresa_img/" . $value->empresa_token;

      $arrayforeach = array(
        "empresa_token" => $value->empresa_token,
        "company_name" => $nombreEmpresa,
        "name_abrev" => $name_abrev,
        "logotypo" => $logoTipo,
        "active_class" => ""
      );
      $empCatalogoArray[] = $arrayforeach;
    }
    $dataMensaje = array(
      'emp_result' => $empCatalogoArray,
      'code' => 200,
      'status' => 'success',
    );
    
    return response()->json($dataMensaje, $dataMensaje['code']);
  }

  public function empresaVinculada(Request $request){
    $userAuth = $request->get('user_auth');
    $usuario = $userAuth->keter_davidic ?? null;

    if (!$usuario) {
      return response()->json(['status' => 'error','message' => 'Usuario no autenticado'], 401);
    }

    $empresa_token = $request->input('empresa_token');

    if (!$empresa_token) {
      return response()->json(['status' => 'error','message' => 'empresa_token requerido'], 400);
    }

    $JwtAuth = new \App\Helpers\JwtAuth();

    $empresa_seleccionada = $this->userEmpresaService->getEmpresa($empresa_token,$usuario,$JwtAuth);

    if (!$empresa_seleccionada) {
      return response()->json(['status' => 'error', 'message' => 'La empresa no está vinculada al usuario'], 403);
    }
        
    $jwt = $empresa_seleccionada['large_token_access'];

    $dataMensaje = array(
      "status" => "success",
      "code" => 200,

      "empresa_token" => $empresa_seleccionada['empresa_token'],
      "company_name" => $empresa_seleccionada['company_name'],
      "name_abrev" => $empresa_seleccionada['name_abrev'],
      "es_administradora" => $empresa_seleccionada['es_administradora'],
      "company_name_short" => $empresa_seleccionada['company_name_short'],
      "company_name_large" => $empresa_seleccionada['company_name_large'],
      "tipo_sociedad" => $empresa_seleccionada['tipo_sociedad'],
      "emp_regimen_fiscal_token" => $empresa_seleccionada['emp_regimen_fiscal_token'],
      "emp_regimen_fiscal_descripcion" => $empresa_seleccionada['emp_regimen_fiscal_descripcion'],
      "zona_horaria" => $empresa_seleccionada['zona_horaria'],
      "zona_horaria_utc" => $empresa_seleccionada['zona_horaria_utc'],
      "e_moneda_code" => $empresa_seleccionada['e_moneda_code'],
      "e_moneda_decimales" => $empresa_seleccionada['e_moneda_decimales'],
      "codigo_pais" => $empresa_seleccionada['codigo_pais'],
      "rfc_generico" => $empresa_seleccionada['rfc_generico'],
      "rfc_emp" => $empresa_seleccionada['rfc_emp'],
      "tax_id_emp" => $empresa_seleccionada['tax_id_emp'],
      "logotypo" => $empresa_seleccionada['logotypo'],
      "conf_ingresos" => $empresa_seleccionada['conf_ingresos'],
      "conf_egresos" => $empresa_seleccionada['conf_egresos'],
      "conf_finanzas" => $empresa_seleccionada['conf_finanzas'],
      "conf_valor_humano" => $empresa_seleccionada['conf_valor_humano'],
      "conf_contabilidad" => $empresa_seleccionada['conf_contabilidad'],
      "conf_tec_info" => $empresa_seleccionada['conf_tec_info'],
      "habilita_reembolsos" => $empresa_seleccionada['habilita_reembolsos'],
      "acreedor" => $empresa_seleccionada['acreedor'],
      "large_token_access" => $jwt,
      "active_class" => "",
      "areasettings" => "",
      //"empleado_token" => $trabajador_token,
      "nivel_empleado" => $empresa_seleccionada['nivel_empleado'],
      //"token_cat_proveedores" => $token_cat_proveedores,
    );

    $response_empresa = response()->json($dataMensaje, 200);
    if ($dataMensaje['status'] == 'success') {
      $response_empresa->withCookie(cookie(
        'moriah_key',        //nombre de la cookie
        $jwt,                 //El JWT generado
        240,                  //4 horas exactas
        '/',                  //ruta
        '.sos-mexico.com.mx', //Dominio
        true,                 //Secure (Cambiar a true solo con HTTPS)
        true,                 //HttpOnly (Protección contra robo por JS)
        false,                //Raw define si el valor de la cookie debe enviarse al navegador de forma "cruda" o si debe pasar por un proceso de codificación automática
        'None'              //SameSite Lax Strict None
      ));
    }
    return $response_empresa;
  }

  public function recuperaDataUserEmpresa(Request $request){
    $empresa = $request->get('malchut_ctx')->malchut_hotam;
    $usuario = $request->get('user_auth')->keter_davidic;

    if (!$empresa) {
      return response()->json(['status' => 'error','message' => 'Usuario no autenticado, debe seleccionar una empresa'], 428);
    }

    if (!$usuario) {
      return response()->json(['status' => 'guest','message' => 'Usuario no autenticado'], 200);
    }

    $JwtAuth = new \App\Helpers\JwtAuth();
    $listadoModulos = $this->userConfigService->getModulos();
    $settingsUser = $this->userConfigService->getUserSettings($usuario);
    $empresa_seleccionada = $this->userEmpresaService->getEmpresa($empresa,$usuario,$JwtAuth);

    if (!$empresa_seleccionada) {
      return response()->json(['status' => 'error', 'message' => 'La empresa no está vinculada al usuario'], 403);
    }
        
    $jwt = $empresa_seleccionada['large_token_access'];

    $dataMensaje = array(
      "status" => "success",
      "code" => 200,
      
      "listadoModulos" => $listadoModulos,
      "main_jerarquia" => $settingsUser->jerarquia_main,
      "lenguaje" => $settingsUser->lenguaje,
      "main_privilegio_crear" => (bool)$settingsUser->privilegio_crear,
      "main_privilegio_editar" => (bool)$settingsUser->privilegio_editar,
      "main_privilegio_consulta" => (bool)$settingsUser->privilegio_consulta,
      "main_privilegio_elimina" => (bool)$settingsUser->privilegio_elimina,
      "main_privilegio_ver_docs" => (bool)$settingsUser->privilegio_ver_docs,
      "empresa_token" => $empresa_seleccionada['empresa_token'],
      "company_name" => $empresa_seleccionada['company_name'],
      "name_abrev" => $empresa_seleccionada['name_abrev'],
      "es_administradora" => $empresa_seleccionada['es_administradora'],
      "company_name_short" => $empresa_seleccionada['company_name_short'],
      "company_name_large" => $empresa_seleccionada['company_name_large'],
      "tipo_sociedad" => $empresa_seleccionada['tipo_sociedad'],
      "emp_regimen_fiscal_token" => $empresa_seleccionada['emp_regimen_fiscal_token'],
      "emp_regimen_fiscal_descripcion" => $empresa_seleccionada['emp_regimen_fiscal_descripcion'],
      "zona_horaria" => $empresa_seleccionada['zona_horaria'],
      "zona_horaria_utc" => $empresa_seleccionada['zona_horaria_utc'],
      "e_moneda_code" => $empresa_seleccionada['e_moneda_code'],
      "e_moneda_decimales" => $empresa_seleccionada['e_moneda_decimales'],
      "codigo_pais" => $empresa_seleccionada['codigo_pais'],
      "rfc_generico" => $empresa_seleccionada['rfc_generico'],
      "rfc_emp" => $empresa_seleccionada['rfc_emp'],
      "tax_id_emp" => $empresa_seleccionada['tax_id_emp'],
      "logotypo" => $empresa_seleccionada['logotypo'],
      "conf_ingresos" => $empresa_seleccionada['conf_ingresos'],
      "conf_egresos" => $empresa_seleccionada['conf_egresos'],
      "conf_finanzas" => $empresa_seleccionada['conf_finanzas'],
      "conf_valor_humano" => $empresa_seleccionada['conf_valor_humano'],
      "conf_contabilidad" => $empresa_seleccionada['conf_contabilidad'],
      "conf_tec_info" => $empresa_seleccionada['conf_tec_info'],
      "habilita_reembolsos" => $empresa_seleccionada['habilita_reembolsos'],
      "acreedor" => $empresa_seleccionada['acreedor'],
      "large_token_access" => $jwt,
      "active_class" => "",
      "areasettings" => "",
      //"empleado_token" => $trabajador_token,
      "nivel_empleado" => $empresa_seleccionada['nivel_empleado'],
      //"token_cat_proveedores" => $token_cat_proveedores,
    );

    $response_empresa = response()->json($dataMensaje, 200);
    if ($dataMensaje['status'] == 'success') {
      $response_empresa->withCookie(cookie(
        'moriah_key',        //nombre de la cookie
        $jwt,                 //El JWT generado
        240,                  //4 horas exactas
        '/',                  //ruta
        '.sos-mexico.com.mx', //Dominio
        true,                 //Secure (Cambiar a true solo con HTTPS)
        true,                 //HttpOnly (Protección contra robo por JS)
        false,                //Raw define si el valor de la cookie debe enviarse al navegador de forma "cruda" o si debe pasar por un proceso de codificación automática
        'None'              //SameSite Lax Strict None
      ));
    }
    return $response_empresa;
  }

  //recuperación de contraseña
  public function guardarCodigoPass(Request $request){
    $JwtAuth = new \App\Helpers\JwtAuth();
    $jsonUser = $request->input('json');
    $parametros = json_decode($jsonUser);
    $arrayParams = json_decode($jsonUser, true);

    if (!empty($parametros) && !empty($arrayParams)) {
      $validate = Validator($arrayParams, [
        'codigo_acceso' => 'string',
        'email' => 'string',
      ]);
      if ($validate->fails()) {
        $dataMensaje = array(
          'status' => 'error',
          'code' => 200,
          'message' => 'usuario no identificado old',
          'errors' => $validate->errors()
        );
      } else {
        $username = $JwtAuth->encriptar($arrayParams['codigo_acceso']);
        $email = $JwtAuth->encriptarAccessClaves($arrayParams['email']);
        $queryUser = DB::select('SELECT id,usuario_token FROM teci_usuarios_catalogo WHERE acceso_email = ?', [$email]);

        if (count($queryUser) != 0) {
          foreach ($queryUser as $vUser) {
            $count = 0;
            $random_text = "";
            $ramdom = mt_srand();
            while ($count < 10) {
              $rand_num = mt_rand(0, 100);
              $random_text = $random_text . $rand_num;
              $count++;
            }

            $random_code = substr($random_text, 0, 10);
            $insertPassReset = DB::table('teci_users_pass_reset')
              ->insert(
                array(
                  "usuario" => $vUser->id,
                  "codigo_verificacion" => $random_code,
                  "fecha_verificacion" => time(),
                )
              );

            if ($insertPassReset) {
              $dataMensaje = array(
                'status' => "success",
                'code' => 200,
                'message' => "código enviado",
                'random_text' => $random_code,
                'user_token_text' => $vUser->usuario_token,
              );
            } else {
              $dataMensaje = array(
                'status' => 'error',
                'code' => 200,
                'message' => "código no enviado, intente nuevamente",
              );
            }
          }
        } else {
          $dataMensaje = array(
            'status' => 'error',
            'code' => 200,
            'message' => "No tenemos registros de ningun usuario con el correo recibido",
          );
        }
      }
    } else {
      $dataMensaje = array(
        'status' => 'error',
        'code' => 200,
        'message' => 'usuario no identificado'
      );
    }
    //return $JwtAuth->signup($email,$passDecrypt);
    return response()->json($dataMensaje, 200);
  }

  public function verificarCodigoPass(Request $request){
    $JwtAuth = new \App\Helpers\JwtAuth();
    $jsonUser = $request->input('json');
    $parametros = json_decode($jsonUser);
    $arrayParams = json_decode($jsonUser, true);

    if (!empty($parametros) && !empty($arrayParams)) {
      $validate = Validator($arrayParams, [
        'user_token' => 'required|string',
        'code_verif' => 'required|string',
      ]);
      if ($validate->fails()) {
        $dataMensaje = array(
          'status' => 'error',
          'code' => 200,
          'message' => 'usuario no identificado old',
          'errors' => $validate->errors()
        );
      } else {
        $user_token = $arrayParams['user_token'];
        $code_verif = $arrayParams['code_verif'];

        $selectUser = DB::select(
          "SELECT codigo_verificacion,fecha_verificacion FROM teci_users_pass_reset 
                    WHERE id = (SELECT MAX(upr.id) FROM teci_users_pass_reset AS upr JOIN teci_usuarios_catalogo AS users 
                        WHERE upr.usuario = users.id AND users.usuario_token = ?)",
          [$user_token]
        );

        if ($selectUser) {
          $status = "";
          $mensaje_resp = "";
          if ($selectUser[0]->codigo_verificacion == $code_verif) {
            $vigencia = $selectUser[0]->fecha_verificacion + 300;
            if ($vigencia > time()) {
              $status = "success";
              $resp_cod = "success";
              $mensaje_resp = "Código correcto";
            } else {
              $status = "error";
              $resp_cod = "code_expired";
              $mensaje_resp = "El código recibido ha vencido";
            }
          } else {
            $status = "error";
            $resp_cod = "code_invalid";
            $mensaje_resp = "El código recibido no coincide con el que se envio a su email";
          }

          $dataMensaje = array(
            'status' => $status,
            'code' => 200,
            'resp_cod' => $resp_cod,
            'message' => $mensaje_resp,
          );
        } else {
          $dataMensaje = array(
            'status' => 'error',
            'code' => 200,
            'resp_cod' => 'null_code',
            'message' => "código no encontrado",
          );
        }
      }
    } else {
      $dataMensaje = array(
        'status' => 'error',
        'code' => 200,
        'resp_cod' => 'none',
        'message' => 'usuario no identificado'
      );
    }
    //return $JwtAuth->signup($email,$passDecrypt);
    return response()->json($dataMensaje, 200);
  }

  public function resetPassFunction(Request $request){
    $JwtAuth = new \App\Helpers\JwtAuth();
    $authSsic = new \App\Helpers\AuthSsic();
    //recibir los mpost
    $jsonLogin = $request->input('json', null);
    $parametros = json_decode($jsonLogin);
    $arrayParams = json_decode($jsonLogin, true);
    //return $arrayParams;
    //die();
    //validar los datos
    if (!empty($parametros) && !empty($arrayParams)) {
      $validate = Validator($arrayParams, [
        'user_token' => 'required',
        'passPrimera' => 'required',
        'passSegunda' => 'required',
      ]);

      if ($validate->fails()) {
        $dataMensaje = array(
          'status' => 'error',
          'code' => 200,
          'message' => 'usuario no identificado old',
          'errors' => $validate->errors()
        );
      } else {

        if (!empty($arrayParams['passPrimera']) && !empty($arrayParams['passSegunda'])) { // si existe token de identificacion envia losa datos decodificados
          //$dataMensaje = 'holaaaa $dataMensaje = ';

          $usuario = $arrayParams['user_token'];
          $passPrimera = $JwtAuth->encriptarAccessClaves($arrayParams['passPrimera']);
          $passSegunda = $JwtAuth->encriptarAccessClaves($arrayParams['passSegunda']);
          //devolver token o datos
          $dataMensaje = $authSsic->resetPassFunction($usuario, $passPrimera, $passSegunda);
        } else {
          $dataMensaje = array(
            'status' => 'error',
            'code' => 200,
            'message' => 'contraseñas invalidas'
          );
        }
      }
    } else {
      $dataMensaje = array(
        'status' => 'error',
        'code' => 200,
        'message' => 'usuario no identificado 2'
      );
    }
    //return $JwtAuth->signup($email,$passDecrypt);
    return response()->json($dataMensaje, 200);
  }

  //cerrar sesion
  public function logoutUsuarioMain(Request $request){
    $userAuth = $request->get('user_auth');

    if ($userAuth) {
      Cache::forget('malchut_ctx');
      Cache::forget('user:' . $userAuth->keter_davidic);
    }
  
    return response()->json(['status' => "success",'code' => 200,'message' => 'Sesión cerrada correctamente'])
    ->header('Clear-Site-Data', '"cookies", "storage"')
    ->withCookie(Cookie::forget(
      'code_inside',
      null,
      -1,
      '/', 
      '.sos-mexico.com.mx', 
      true, 
      true, 
      false, 
      'None'
    ))   // 👤 usuario
    ->withCookie(Cookie::forget(
      'moriah_key',
      null,
      -1,
      '/', 
      '.sos-mexico.com.mx',
      true, 
      true, 
      false, 
      'None'
    ));   // 🏢 empresa
  }
}