import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EmpresasServService } from '../../../../servicios/ssic/empresas-serv.service';
import { ValidatorServService } from '../../../../servicios/validator-serv.service';
import { ServEncryptService } from '../../../../servicios/ssic/serv-encrypt.service';
import { EmpleadosService } from '../../../../servicios/ssic/empleados.service';
import Swal from 'sweetalert2';
import emailjs from '@emailjs/browser';
import { UsuariosService } from '../../../../servicios/serv_user.service';

@Component({
  selector: 'app-teci-perfiles-usuarios',
  standalone: false,

  templateUrl: './teci-perfiles-usuarios.component.html',
  styleUrls: [
    '../../../../styles/explain.css',
    '../../../../styles/input_group.css',
    '../../../../styles/file_input.css',
    '../../../../styles/loading.css',
    '../../../../styles/navegador.css',
    '../../../../styles/listas_ps.css',
    '../../../../styles/datatable.css',
    '../../../../styles/dropdown.css',
    '../../../../styles/tabs.css',
    '../../../../styles/buttons.css',
    '../../../../styles/modals.css',
    '../../../../styles/cabecera.css',
    '../../../../styles/cards.css',
    '../../../../styles/clientes.css',
    '../../../../styles/collapsible.css',
    '../../../../styles/row.css',
    '../../../../styles/encabezados.css',
    '../../../../styles/buscador.css',
    '../../../../styles/radioButtons.css',
    '../../../../styles/paginador.css',
    '../../../../styles/landing.css',
    '../../../../styles/colores.css',
    '../../../../styles/switches.css',
    '../../../../styles/explain.css',
    './teci-perfiles-usuarios.component.css',
    './../tec_info.css'
  ]
})
export class TeciPerfilesUsuariosComponent implements OnInit {
  //catalogo de usuarios
  usuarios_catalogo: any = [];
  usuarios_catalogo_search: any;
  usuarios_permisos_solicitud_search: any;
  expandedRowsUsuarios: { [s: string]: boolean } = {};

  //registro de usuarios
  catalogo_general_empresas: any = [];
  list_areas_user: any = [];
  list_cargos_user: any = [];
  public new_user_paterno: string = "";
  public new_user_materno: string = "";
  public new_user_nombres: string = "";
  public new_user_email: string = "";
  public new_user_area: string = "";
  public new_user_empresas_vinculadas: any = [];
  public new_user_cargo: string = "";

  constructor(
    private trab_serv: EmpleadosService,
    private encryptor: ServEncryptService,
    public validator: ValidatorServService,
    public emp_serv: EmpresasServService,
    private translate: TranslateService,
    private users:UsuariosService
  ) { }

  ngOnInit(): void {
    this.listando_catalogo_general_emp();
    this.catalogoAreasEmp();
    this.listando_catalogo_de_usuarios();
  }

  listando_catalogo_general_emp() {
    this.emp_serv.listaEmpresasAll().subscribe(
      response => {
        console.log(response);
        if (response.status == 'success') {
          this.catalogo_general_empresas = response.companies;
          console.log(this.catalogo_general_empresas);
        }
      }, error => { console.log(error); }
    );
  }

  catalogoAreasEmp() {
    this.trab_serv.catalogoAreasEmp().subscribe(
      response => {
        console.log(response);
        if (response.status == 'success') {
          this.list_areas_user = response.areas;

          console.log(this.list_areas_user)
        }
      }, error => { console.log(error); }
    );
  }

  //catalogo de usuarios
  listando_catalogo_de_usuarios() {
    this.users.usuarios_catalogo_general().subscribe(
      response => {
        console.log(response);
        if (response.status == 'success') {
          this.usuarios_catalogo = response.usuarios;

          console.log(this.usuarios_catalogo)
        }
      }, error => { console.log(error); }
    );
  }

  desgloseUsuario(usuario_token: any) {
    const user = this.usuarios_catalogo.find((u: any) => u.usuario_token === usuario_token);
    this.users.usuarios_catalogo_desglose(usuario_token).subscribe(
      response => {
        console.log(response);
        if (response.status == 'success') {
          user.verModalUsuario = true;
          user.desglose_info = response.usuario;
          console.log(this.usuarios_catalogo)
        }
      }, error => { console.log(error); }
    );
  }

  generaCodigosAccessAndPass(usuario_token: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_insert"),
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_insert"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          const user = this.usuarios_catalogo.find((u: any) => u.usuario_token === usuario_token);
          var possible_letter = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
          var possible_char = '.,#$%&/()=';
          var stringDataCode = usuario_token + user.usuario_alias + "code_access";
          var primerDataCode = this.encryptor.santoEncryptCode(stringDataCode).substring(0, 7);
          for (let a = 0; a < 1; a++) {
            primerDataCode = possible_letter.charAt(Math.floor(Math.random() * possible_letter.length)) + primerDataCode;
          }
          var segundaDataCode = this.encryptor.santoEncryptCode(primerDataCode);

          var stringDataPass = usuario_token + Math.random() + user.usuario_alias;
          var primerDataPass = this.encryptor.santoEncryptPass(stringDataPass).substring(0, 8);
          for (let i = 0; i < 2; i++) {
            primerDataPass = primerDataPass + possible_char.charAt(Math.floor(Math.random() * possible_char.length));
          }
          for (let j = 0; j < 1; j++) {
            primerDataPass = possible_letter.charAt(Math.floor(Math.random() * possible_letter.length)) + primerDataPass;
          }
          var segundaDataPass = this.encryptor.santoEncryptPass(primerDataPass);
          console.log(primerDataCode);
          console.log(primerDataPass);
          this.users.generaPassCodeUser(segundaDataCode, segundaDataPass, usuario_token).subscribe(
            response => {
              if (response.status == 'success') {
                this.listando_catalogo_de_usuarios();
                var contenidoHtml = '<html><head><title>titulo de la página</title></head>' +
                  '<body><div style="background-color: #d3d3d3;display:flex;justify-content:center">' +
                  '<h4 style="width: 100%;font-size: 35px;font-weight: bold;"></h4>' +
                  '<h6 style="width: 100%;font-weight: 600;"></h6><br>' +
                  '<p style="width: 100%;margin: 0;padding: 20px;"></p>' +
                  '<p style="width: 100%;margin: 0;padding-left: 20px;">Código de acceso: <strong>' + primerDataCode + '</strong></p>' +
                  '<p style="width: 100%;margin: 0;padding-left: 20px;">Contraseña: <strong>' + primerDataPass + '</strong></p>' +
                  '</div></body></html>';
                const parametros = {
                  from_name: 'SOPORTE SOS',
                  from_email: 'soporte@sos-mexico.com.mx',
                  to_name: user.usuario_alias + ' <' + user.usuario_alias + '>',
                  to_email: user.usuario_alias,
                  access_code: primerDataCode,
                  pass_code: primerDataPass,
                  link: 'https://sos-mexico.com.mx/clientes'
                };
                //emailjs.send(user['email'],contenidoHtml,parametros,'')
                emailjs.send('service_dejznyj', 'template_v1nh0fl', parametros, 'H1Nl6vkZbsBm1MtNF')
                .then((response) => {
                  console.log("success", response.status, response.text);
                  Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: response.text,
                    showConfirmButton: false,
                    timer: 3000
                  });
                }, (err) => {
                  console.log("falla", err);
                  Swal.fire({
                    position: 'top-end',
                    icon: 'warning',
                    title: "falla " + err,
                    showConfirmButton: false,
                    timer: 3000
                  })
                });
              }
            }, error => { console.log(error); }
          );
        }
      }
    );
  }

  revocarCodigosAccessAndPass(usuario_token: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_delete"),
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_delete"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          this.users.revocaPassCodeUser(usuario_token).subscribe(
            response => {
              let translate_response = this.translate.instant(response.message);
              if (response.status == 'success') {
                setTimeout(() => {
                  Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: translate_response,
                    showConfirmButton: false,
                    timer: 3000
                  });
                }, 3000);
              }
              if (response.status == 'error') {
                Swal.fire({
                  position: 'top-end',
                  icon: 'warning',
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }
            },
            error => {
              console.log(error);
            }
          );
        }
      }
    );
  }

  rExpandUsuarios(row: any): boolean {
    return !!this.expandedRowsUsuarios[row.empleado_token];
  }

  userAccesoModuloSsic(usuario_empresa: any, usuario_user: any, acceso: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
    }).then((result) => {
      if (result.isConfirmed) {
        this.users.user_acceso_modulo_ssic(usuario_empresa, usuario_user, acceso).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);
            }
            if (response.status == "error") {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          }, error => { console.log(error); }
        );
      }
    })
  }

  userAccesoModuloDescargaXml(usuario_empresa: any, usuario_user: any, acceso: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
    }).then((result) => {
      if (result.isConfirmed) {
        this.users.user_acceso_modulo_descarga_xml(usuario_empresa, usuario_user, acceso).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);
            }
            if (response.status == "error") {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          }, error => { console.log(error); }
        );
      }
    })
  }

  userAccesoModuloLogistica(usuario_empresa: any, usuario_user: any, acceso: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
    }).then((result) => {
      if (result.isConfirmed) {
        this.users.user_acceso_modulo_logistica(usuario_empresa, usuario_user, acceso).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);
            }
            if (response.status == "error") {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          }, error => { console.log(error); }
        );
      }
    })
  }

  userAccesoModuloCompras(usuario_empresa: any, usuario_user: any, acceso: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
    }).then((result) => {
      if (result.isConfirmed) {
        this.users.user_acceso_modulo_compras(usuario_empresa, usuario_user, acceso).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);
            }
            if (response.status == "error") {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          }, error => { console.log(error); }
        );
      }
    })
  }

  userAccesoModuloProyectos(usuario_empresa: any, usuario_user: any, acceso: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
    }).then((result) => {
      if (result.isConfirmed) {
        this.users.user_acceso_modulo_proyectos(usuario_empresa, usuario_user, acceso).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);
            }
            if (response.status == "error") {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          }, error => { console.log(error); }
        );
      }
    })
  }

  userAccesoModuloTerceros(usuario_empresa: any, usuario_user: any, acceso: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
    }).then((result) => {
      if (result.isConfirmed) {
        this.users.user_acceso_modulo_terceros(usuario_empresa, usuario_user, acceso).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);
            }
            if (response.status == "error") {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          }, error => { console.log(error); }
        );
      }
    })
  }

  userAccesoModuloTercerosAssociates(usuario_empresa: any, usuario_user: any, acceso: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
    }).then((result) => {
      if (result.isConfirmed) {
        this.users.user_acceso_modulo_terceros_associates(usuario_empresa, usuario_user, acceso).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);
            }
            if (response.status == "error") {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          }, error => { console.log(error); }
        );
      }
    })
  }

  userAccesoModuloTercerosClientes(usuario_empresa: any, usuario_user: any, acceso: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
    }).then((result) => {
      if (result.isConfirmed) {
        this.users.user_acceso_modulo_terceros_clientes(usuario_empresa, usuario_user, acceso).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);
            }
            if (response.status == "error") {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          }, error => { console.log(error); }
        );
      }
    })
  }

  userAccesoModuloTercerosProveedores(usuario_empresa: any, usuario_user: any, acceso: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
    }).then((result) => {
      if (result.isConfirmed) {
        this.users.user_acceso_modulo_terceros_proveedores(usuario_empresa, usuario_user, acceso).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);
            }
            if (response.status == "error") {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          }, error => { console.log(error); }
        );
      }
    })
  }

  userAccesoModuloTercerosEmpleados(usuario_empresa: any, usuario_user: any, acceso: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
    }).then((result) => {
      if (result.isConfirmed) {
        this.users.user_acceso_modulo_terceros_empleados(usuario_empresa, usuario_user, acceso).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);
            }
            if (response.status == "error") {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          }, error => { console.log(error); }
        );
      }
    })
  }

  //ingresos
  userIngresosPermAcceso(usuario_empresa: any, usuario_user: any, acceso: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
    }).then((result) => {
      if (result.isConfirmed) {
        this.users.user_permisos_ingresos_acceso(usuario_empresa, usuario_user, acceso).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);

              for (let i = 0; i < this.usuarios_catalogo.length; i++) {
                const user = this.usuarios_catalogo[i];
                if (user["user_token"] == usuario_user) {
                  console.log(response.new_jerarquia);
                  user["conf_ingresos"][0]["jerarquia"] = response.new_jerarquia;
                }
              }
            }
            if (response.status == "error") {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          }, error => { console.log(error); }
        );
      }
    })
  }

  userIngresosPermJerarquia(usuario_empresa: any, usuario_user: any, jerarquia: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
    }).then((result) => {
      if (result.isConfirmed) {
        this.users.user_permisos_ingresos_jerarquia(usuario_empresa, usuario_user, jerarquia).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);

              for (let i = 0; i < this.usuarios_catalogo.length; i++) {
                const user = this.usuarios_catalogo[i];
                if (user["user_token"] == usuario_user) {
                  console.log(response.new_jerarquia);
                  user["conf_ingresos"][0]["jerarquia"] = response.new_jerarquia;
                }
              }
            }
            if (response.status == "error") {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          }, error => { console.log(error); }
        );
      }
    })
  }

  userIngresosPermCrear(usuario_empresa: any, usuario_user: any, perm_crear: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
    }).then((result) => {
      if (result.isConfirmed) {
        this.users.user_permisos_ingresos_crear(usuario_empresa, usuario_user, perm_crear).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);

              for (let i = 0; i < this.usuarios_catalogo.length; i++) {
                const user = this.usuarios_catalogo[i];
                if (user["user_token"] == usuario_user) {
                  console.log(response.new_crear);
                  user["conf_ingresos"][0]["bool_ingr_perm_crear"] = response.new_crear;
                  if (user["permisos_solicitud"].length > 0) {
                    for (let b = 0; b < user["permisos_solicitud"].length; b++) {
                      const soli_user = user["permisos_solicitud"][b];
                      if (soli_user["modulo"] == "ingr" && soli_user["permiso"] == "crear") {
                        user["permisos_solicitud"].splice(b);
                        if (user["permisos_solicitud"].length == 0) {
                          user["class_perm"] = "col-12 noneView";
                          user["class_user"] = "col-12";
                        }
                      }
                    }
                  }

                }
              }
            }
            if (response.status == "error") {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          }, error => { console.log(error); }
        );
      }
    })
  }

  userIngresosPermEditar(usuario_empresa: any, usuario_user: any, perm_editar: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
    }).then((result) => {
      if (result.isConfirmed) {
        this.users.user_permisos_ingresos_editar(usuario_empresa, usuario_user, perm_editar).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);

              for (let i = 0; i < this.usuarios_catalogo.length; i++) {
                const user = this.usuarios_catalogo[i];
                if (user["user_token"] == usuario_user) {
                  console.log(response.new_editar);
                  user["conf_ingresos"][0]["bool_ingr_perm_editar"] = response.new_editar;
                  if (user["permisos_solicitud"].length > 0) {
                    for (let b = 0; b < user["permisos_solicitud"].length; b++) {
                      const soli_user = user["permisos_solicitud"][b];
                      if (soli_user["modulo"] == "ingr" && soli_user["permiso"] == "editar") {
                        user["permisos_solicitud"].splice(b);
                        if (user["permisos_solicitud"].length == 0) {
                          user["class_perm"] = "col-12 noneView";
                          user["class_user"] = "col-12";
                        }
                      }
                    }
                  }

                }
              }
            }
            if (response.status == "error") {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          }, error => { console.log(error); }
        );
      }
    })
  }

  userIngresosPermConsultar(usuario_empresa: any, usuario_user: any, perm_consulta: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
    }).then((result) => {
      if (result.isConfirmed) {
        this.users.user_permisos_ingresos_consultar(usuario_empresa, usuario_user, perm_consulta).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);

              for (let i = 0; i < this.usuarios_catalogo.length; i++) {
                const user = this.usuarios_catalogo[i];
                if (user["user_token"] == usuario_user) {
                  console.log(response.new_editar);
                  user["conf_ingresos"][0]["bool_ingr_perm_consulta"] = response.new_consultar;
                  if (user["permisos_solicitud"].length > 0) {
                    for (let b = 0; b < user["permisos_solicitud"].length; b++) {
                      const soli_user = user["permisos_solicitud"][b];
                      if (soli_user["modulo"] == "ingr" && soli_user["permiso"] == "consulta") {
                        user["permisos_solicitud"].splice(b);
                        if (user["permisos_solicitud"].length == 0) {
                          user["class_perm"] = "col-12 noneView";
                          user["class_user"] = "col-12";
                        }
                      }
                    }
                  }
                }
              }
            }
            if (response.status == "error") {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          }, error => { console.log(error); }
        );
      }
    })
  }

  userIngresosPermEliminar(usuario_empresa: any, usuario_user: any, perm_elimina: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
    }).then((result) => {
      if (result.isConfirmed) {
        this.users.user_permisos_ingresos_eliminar(usuario_empresa, usuario_user, perm_elimina).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);

              for (let i = 0; i < this.usuarios_catalogo.length; i++) {
                const user = this.usuarios_catalogo[i];
                if (user["user_token"] == usuario_user) {
                  console.log(response.new_editar);
                  user["conf_ingresos"][0]["bool_ingr_perm_elimina"] = response.new_eliminar;
                  if (user["permisos_solicitud"].length > 0) {
                    for (let b = 0; b < user["permisos_solicitud"].length; b++) {
                      const soli_user = user["permisos_solicitud"][b];
                      if (soli_user["modulo"] == "ingr" && soli_user["permiso"] == "eliminar") {
                        user["permisos_solicitud"].splice(b);
                        if (user["permisos_solicitud"].length == 0) {
                          user["class_perm"] = "col-12 noneView";
                          user["class_user"] = "col-12";
                        }
                      }
                    }
                  }
                }
              }
            }
            if (response.status == "error") {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          }, error => { console.log(error); }
        );
      }
    })
  }

  userIngresosPermVerDocs(usuario_empresa: any, usuario_user: any, perm_ver_docs: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
    }).then((result) => {
      if (result.isConfirmed) {
        this.users.user_permisos_ingresos_ver_docs(usuario_empresa, usuario_user, perm_ver_docs).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);

              for (let i = 0; i < this.usuarios_catalogo.length; i++) {
                const user = this.usuarios_catalogo[i];
                if (user["user_token"] == usuario_user) {
                  console.log(response.new_editar);
                  user["conf_ingresos"][0]["bool_ingr_perm_ver_docs"] = response.new_ver_docs;
                  if (user["permisos_solicitud"].length > 0) {
                    for (let b = 0; b < user["permisos_solicitud"].length; b++) {
                      const soli_user = user["permisos_solicitud"][b];
                      if (soli_user["modulo"] == "ingr" && soli_user["permiso"] == "ver_docs") {
                        user["permisos_solicitud"].splice(b);
                        if (user["permisos_solicitud"].length == 0) {
                          user["class_perm"] = "col-12 noneView";
                          user["class_user"] = "col-12";
                        }
                      }
                    }
                  }
                }
              }
            }
            if (response.status == "error") {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          }, error => { console.log(error); }
        );
      }
    })
  }

  //Catalogos
  //Route::post("user_permisos_ingresos_catalogos_modulo",[MAIN_UsuarioController::class,"userPermisosIngresosCatalogosModulo"]);
  //Route::post("user_permisos_ingresos_mercancias",[MAIN_UsuarioController::class,"userPermisosIngresosMercancias"]);
  //Route::post("user_permisos_ingresos_servicios",[MAIN_UsuarioController::class,"userPermisosIngresosServicios"]);
  //Route::post("user_permisos_ingresos_lista_precios",[MAIN_UsuarioController::class,"userPermisosIngresosListaPrecios"]);
  //Route::post("user_permisos_ingresos_descuentos",[MAIN_UsuarioController::class,"userPermisosIngresosDescuentos"]);
  //Route::post("user_permisos_ingresos_promociones",[MAIN_UsuarioController::class,"userPermisosIngresosPromociones"]);
  //Route::post("user_permisos_ingresos_impuestos",[MAIN_UsuarioController::class,"userPermisosIngresosImpuestos"]);
  //Route::post("user_permisos_ingresos_clientes",[MAIN_UsuarioController::class,"userPermisosIngresosClientes"]);
  //Route::post("user_permisos_ingresos_ventas_modulo",[MAIN_UsuarioController::class,"userPermisosIngresosVentasModulo"]);
  //Route::post("user_permisos_ingresos_pedidos",[MAIN_UsuarioController::class,"userPermisosIngresosPedidos"]);
  //Route::post("user_permisos_ingresos_ventas",[MAIN_UsuarioController::class,"userPermisosIngresosVentas"]);
  //Route::post("user_permisos_ingresos_seguimiento_ventas",[MAIN_UsuarioController::class,"userPermisosIngresosSeguimientoVentas"]);
  //Route::post("user_permisos_ingresos_devoluciones",[MAIN_UsuarioController::class,"userPermisosIngresosDevoluciones"]);
  //Route::post("user_permisos_ingresos_facturacion",[MAIN_UsuarioController::class,"userPermisosIngresosFacturacion"]);
  //Route::post("user_permisos_ingresos_reportes",[MAIN_UsuarioController::class,"userPermisosIngresosReportes"]);
  //egresos
  userEgresosPermAcceso(usuario_empresa: any, usuario_user: any, acceso: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
    }).then((result) => {
      if (result.isConfirmed) {
        this.users.user_permisos_egresos_acceso(usuario_empresa, usuario_user, acceso).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);

              for (let i = 0; i < this.usuarios_catalogo.length; i++) {
                const user = this.usuarios_catalogo[i];
                if (user["user_token"] == usuario_user) {
                  console.log(response.new_jerarquia);
                  user["conf_ingresos"][0]["jerarquia"] = response.new_jerarquia;
                }
              }
            }
            if (response.status == "error") {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          }, error => { console.log(error); }
        );
      }
    })
  }

  userEgresosPermJerarquia(usuario_empresa: any, usuario_user: any, jerarquia: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
    }).then((result) => {
      if (result.isConfirmed) {
        this.users.user_permisos_egresos_jerarquia(usuario_empresa, usuario_user, jerarquia).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);

              for (let i = 0; i < this.usuarios_catalogo.length; i++) {
                const user = this.usuarios_catalogo[i];
                if (user["user_token"] == usuario_user) {
                  console.log(response.new_jerarquia);
                  //user["conf_ingresos"][0]["jerarquia"] = response.new_jerarquia; 
                  user["conf_egresos"][0]["jerarquia"] = response.new_jerarquia;
                }
              }
            }
            if (response.status == "error") {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          }, error => { console.log(error); }
        );
      }
    })
  }

  userEgresosPermCrear(usuario_empresa: any, usuario_user: any, perm_crear: any) {
     console.log(usuario_user);
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
    }).then((result) => {
      if (result.isConfirmed) {
        this.users.user_permisos_egresos_crear(usuario_empresa, usuario_user, perm_crear).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);

              for (let i = 0; i < this.usuarios_catalogo.length; i++) {
                const user = this.usuarios_catalogo[i];
                if (user["user_token"] == usuario_user) {
                  console.log(response.new_crear);
                  user["conf_egresos"][0]["bool_eegr_perm_crear"] = response.new_crear;
                  if (user["permisos_solicitud"].length > 0) {
                    for (let b = 0; b < user["permisos_solicitud"].length; b++) {
                      const soli_user = user["permisos_solicitud"][b];
                      if (soli_user["modulo"] == "eegr" && soli_user["permiso"] == "crear") {
                        user["permisos_solicitud"].splice(b);
                        if (user["permisos_solicitud"].length == 0) {
                          user["class_perm"] = "col-12 noneView";
                          user["class_user"] = "col-12";
                        }
                      }
                    }
                  }
                }
              }
            }
            if (response.status == "error") {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          }, error => { console.log(error); }
        );
      }
    })
  }

  userEgresosPermEditar(usuario_empresa: any, usuario_user: any, perm_editar: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
    }).then((result) => {
      if (result.isConfirmed) {
        this.users.user_permisos_egresos_editar(usuario_empresa, usuario_user, perm_editar).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);

              for (let i = 0; i < this.usuarios_catalogo.length; i++) {
                const user = this.usuarios_catalogo[i];
                if (user["user_token"] == usuario_user) {
                  console.log(response.new_editar);
                  user["conf_egresos"][0]["bool_eegr_perm_editar"] = response.new_editar;
                  if (user["permisos_solicitud"].length > 0) {
                    for (let b = 0; b < user["permisos_solicitud"].length; b++) {
                      const soli_user = user["permisos_solicitud"][b];
                      if (soli_user["modulo"] == "eegr" && soli_user["permiso"] == "editar") {
                        user["permisos_solicitud"].splice(b);
                        if (user["permisos_solicitud"].length == 0) {
                          user["class_perm"] = "col-12 noneView";
                          user["class_user"] = "col-12";
                        }
                      }
                    }
                  }

                }
              }
            }
            if (response.status == "error") {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          }, error => { console.log(error); }
        );
      }
    })
  }

  userEgresosPermConsultar(usuario_empresa: any, usuario_user: any, perm_consulta: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
    }).then((result) => {
      if (result.isConfirmed) {
        this.users.user_permisos_egresos_consultar(usuario_empresa, usuario_user, perm_consulta).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);

              for (let i = 0; i < this.usuarios_catalogo.length; i++) {
                const user = this.usuarios_catalogo[i];
                if (user["user_token"] == usuario_user) {
                  console.log(response.new_editar);
                  user["conf_egresos"][0]["bool_eegr_perm_consulta"] = response.new_consultar;
                  if (user["permisos_solicitud"].length > 0) {
                    for (let b = 0; b < user["permisos_solicitud"].length; b++) {
                      const soli_user = user["permisos_solicitud"][b];
                      if (soli_user["modulo"] == "eegr" && soli_user["permiso"] == "consulta") {
                        user["permisos_solicitud"].splice(b);
                        if (user["permisos_solicitud"].length == 0) {
                          user["class_perm"] = "col-12 noneView";
                          user["class_user"] = "col-12";
                        }
                      }
                    }
                  }
                }
              }
            }
            if (response.status == "error") {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          }, error => { console.log(error); }
        );
      }
    })
  }

  userEgresosPermEliminar(usuario_empresa: any, usuario_user: any, perm_elimina: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
    }).then((result) => {
      if (result.isConfirmed) {
        this.users.user_permisos_egresos_eliminar(usuario_empresa, usuario_user, perm_elimina).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);

              for (let i = 0; i < this.usuarios_catalogo.length; i++) {
                const user = this.usuarios_catalogo[i];
                if (user["user_token"] == usuario_user) {
                  console.log(response.new_editar);
                  user["conf_egresos"][0]["bool_eegr_perm_elimina"] = response.new_eliminar;
                  if (user["permisos_solicitud"].length > 0) {
                    for (let b = 0; b < user["permisos_solicitud"].length; b++) {
                      const soli_user = user["permisos_solicitud"][b];
                      if (soli_user["modulo"] == "eegr" && soli_user["permiso"] == "eliminar") {
                        user["permisos_solicitud"].splice(b);
                        if (user["permisos_solicitud"].length == 0) {
                          user["class_perm"] = "col-12 noneView";
                          user["class_user"] = "col-12";
                        }
                      }
                    }
                  }
                }
              }
            }
            if (response.status == "error") {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          }, error => { console.log(error); }
        );
      }
    })
  }

  userEgresosPermVerDocs(usuario_empresa: any, usuario_user: any, perm_ver_docs: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
    }).then((result) => {
      if (result.isConfirmed) {
        this.users.user_permisos_egresos_ver_docs(usuario_empresa, usuario_user, perm_ver_docs).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);

              for (let i = 0; i < this.usuarios_catalogo.length; i++) {
                const user = this.usuarios_catalogo[i];
                if (user["user_token"] == usuario_user) {
                  console.log(response.new_editar);
                  user["conf_egresos"][0]["bool_eegr_perm_ver_docs"] = response.new_ver_docs;
                  if (user["permisos_solicitud"].length > 0) {
                    for (let b = 0; b < user["permisos_solicitud"].length; b++) {
                      const soli_user = user["permisos_solicitud"][b];
                      if (soli_user["modulo"] == "eegr" && soli_user["permiso"] == "ver_docs") {
                        user["permisos_solicitud"].splice(b);
                        if (user["permisos_solicitud"].length == 0) {
                          user["class_perm"] = "col-12 noneView";
                          user["class_user"] = "col-12";
                        }
                      }
                    }
                  }
                }
              }
            }
            if (response.status == "error") {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          }, error => { console.log(error); }
        );
      }
    })
  }

  //Route::post("user_permisos_egresos_catalogos_modulo",[MAIN_UsuarioController::class,"userPermisosEgresosCatalogosModulo"]);
  //Route::post("user_permisos_egresos_productos",[MAIN_UsuarioController::class,"userPermisosEgresosProductos"]);
  //Route::post("user_permisos_egresos_servicios",[MAIN_UsuarioController::class,"userPermisosEgresosServicios"]);
  //Route::post("user_permisos_egresos_activos_fijos",[MAIN_UsuarioController::class,"userPermisosEgresosActivosFijos"]);
  //Route::post("user_permisos_egresos_activos_intang",[MAIN_UsuarioController::class,"userPermisosEgresosActivosIntang"]);
  //Route::post("user_permisos_egresos_proveedores",[MAIN_UsuarioController::class,"userPermisosEgresosProveedores"]);
  //Route::post("user_permisos_egresos_establecimientos",[MAIN_UsuarioController::class,"userPermisosEgresosEstablecimientos"]);
  //Compras
  //Route::post("user_permisos_egresos_compras_modulo",[MAIN_UsuarioController::class,"userPermisosEgresosComprasModulo"]);
  //Route::post("user_permisos_egresos_requisiciones",[MAIN_UsuarioController::class,"userPermisosEgresosRequisiciones"]);
  //Route::post("user_permisos_egresos_cotizaciones",[MAIN_UsuarioController::class,"userPermisosEgresosCotizaciones"]);
  //Route::post("user_permisos_egresos_compra_directa",[MAIN_UsuarioController::class,"userPermisosEgresosCompraDirecta"]);
  //Route::post("user_permisos_egresos_compra_seguimiento",[MAIN_UsuarioController::class,"userPermisosEgresosCompraSeguimiento"]);

  //finanzas
  userFinanzasPermAcceso(usuario_empresa: any, usuario_user: any, acceso: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
    }).then((result) => {
      if (result.isConfirmed) {
        this.users.user_permisos_finanzas_acceso(usuario_empresa, usuario_user, acceso).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);

              for (let i = 0; i < this.usuarios_catalogo.length; i++) {
                const user = this.usuarios_catalogo[i];
                if (user["user_token"] == usuario_user) {
                  console.log(response.new_jerarquia);
                  user["conf_ingresos"][0]["jerarquia"] = response.new_jerarquia;
                }
              }
            }
            if (response.status == "error") {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          }, error => { console.log(error); }
        );
      }
    })
  }

  userFinanzasPermJerarquia(usuario_empresa: any, usuario_user: any, jerarquia: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
    }).then((result) => {
      if (result.isConfirmed) {
        this.users.user_permisos_finanzas_jerarquia(usuario_empresa, usuario_user, jerarquia).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);

              for (let i = 0; i < this.usuarios_catalogo.length; i++) {
                const user = this.usuarios_catalogo[i];
                if (user["user_token"] == usuario_user) {
                  console.log(response.new_jerarquia);
                  //user["conf_finanzas"][0]["jerarquia"] = response.new_jerarquia; 
                  user["conf_finanzas"][0]["jerarquia"] = response.new_jerarquia;
                }
              }
            }
            if (response.status == "error") {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          }, error => { console.log(error); }
        );
      }
    })
  }

  userFinanzasPermCrear(usuario_empresa: any, usuario_user: any, perm_crear: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
    }).then((result) => {
      if (result.isConfirmed) {
        this.users.user_permisos_finanzas_crear(usuario_empresa, usuario_user, perm_crear).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);

              for (let i = 0; i < this.usuarios_catalogo.length; i++) {
                const user = this.usuarios_catalogo[i];
                if (user["user_token"] == usuario_user) {
                  console.log(response.new_crear);
                  user["conf_finanzas"][0]["bool_fnzs_perm_crear"] = response.new_crear;
                  if (user["permisos_solicitud"].length > 0) {
                    for (let b = 0; b < user["permisos_solicitud"].length; b++) {
                      const soli_user = user["permisos_solicitud"][b];
                      if (soli_user["modulo"] == "fnzs" && soli_user["permiso"] == "crear") {
                        user["permisos_solicitud"].splice(b);
                        if (user["permisos_solicitud"].length == 0) {
                          user["class_perm"] = "col-12 noneView";
                          user["class_user"] = "col-12";
                        }
                      }
                    }
                  }

                }
              }
            }
            if (response.status == "error") {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          }, error => { console.log(error); }
        );
      }
    })
  }

  userFinanzasPermEditar(usuario_empresa: any, usuario_user: any, perm_editar: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
    }).then((result) => {
      if (result.isConfirmed) {
        this.users.user_permisos_finanzas_editar(usuario_empresa, usuario_user, perm_editar).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);

              for (let i = 0; i < this.usuarios_catalogo.length; i++) {
                const user = this.usuarios_catalogo[i];
                if (user["user_token"] == usuario_user) {
                  console.log(response.new_editar);
                  user["conf_finanzas"][0]["bool_fnzs_perm_editar"] = response.new_editar;
                  if (user["permisos_solicitud"].length > 0) {
                    for (let b = 0; b < user["permisos_solicitud"].length; b++) {
                      const soli_user = user["permisos_solicitud"][b];
                      if (soli_user["modulo"] == "fnzs" && soli_user["permiso"] == "editar") {
                        user["permisos_solicitud"].splice(b);
                        if (user["permisos_solicitud"].length == 0) {
                          user["class_perm"] = "col-12 noneView";
                          user["class_user"] = "col-12";
                        }
                      }
                    }
                  }

                }
              }
            }
            if (response.status == "error") {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          }, error => { console.log(error); }
        );
      }
    })
  }

  userFinanzasPermConsultar(usuario_empresa: any, usuario_user: any, perm_consulta: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
    }).then((result) => {
      if (result.isConfirmed) {
        this.users.user_permisos_finanzas_consultar(usuario_empresa, usuario_user, perm_consulta).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);

              for (let i = 0; i < this.usuarios_catalogo.length; i++) {
                const user = this.usuarios_catalogo[i];
                if (user["user_token"] == usuario_user) {
                  console.log(response.new_editar);
                  user["conf_finanzas"][0]["bool_fnzs_perm_consulta"] = response.new_consultar;
                  if (user["permisos_solicitud"].length > 0) {
                    for (let b = 0; b < user["permisos_solicitud"].length; b++) {
                      const soli_user = user["permisos_solicitud"][b];
                      if (soli_user["modulo"] == "fnzs" && soli_user["permiso"] == "consulta") {
                        user["permisos_solicitud"].splice(b);
                        if (user["permisos_solicitud"].length == 0) {
                          user["class_perm"] = "col-12 noneView";
                          user["class_user"] = "col-12";
                        }
                      }
                    }
                  }
                }
              }
            }
            if (response.status == "error") {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          }, error => { console.log(error); }
        );
      }
    })
  }

  userFinanzasPermEliminar(usuario_empresa: any, usuario_user: any, perm_elimina: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
    }).then((result) => {
      if (result.isConfirmed) {
        this.users.user_permisos_finanzas_eliminar(usuario_empresa, usuario_user, perm_elimina).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);

              for (let i = 0; i < this.usuarios_catalogo.length; i++) {
                const user = this.usuarios_catalogo[i];
                if (user["user_token"] == usuario_user) {
                  console.log(response.new_editar);
                  user["conf_finanzas"][0]["bool_fnzs_perm_elimina"] = response.new_eliminar;
                  if (user["permisos_solicitud"].length > 0) {
                    for (let b = 0; b < user["permisos_solicitud"].length; b++) {
                      const soli_user = user["permisos_solicitud"][b];
                      if (soli_user["modulo"] == "fnzs" && soli_user["permiso"] == "eliminar") {
                        user["permisos_solicitud"].splice(b);
                        if (user["permisos_solicitud"].length == 0) {
                          user["class_perm"] = "col-12 noneView";
                          user["class_user"] = "col-12";
                        }
                      }
                    }
                  }
                }
              }
            }
            if (response.status == "error") {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          }, error => { console.log(error); }
        );
      }
    })
  }

  userFinanzasPermVerDocs(usuario_empresa: any, usuario_user: any, perm_ver_docs: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
    }).then((result) => {
      if (result.isConfirmed) {
        this.users.user_permisos_finanzas_ver_docs(usuario_empresa, usuario_user, perm_ver_docs).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);

              for (let i = 0; i < this.usuarios_catalogo.length; i++) {
                const user = this.usuarios_catalogo[i];
                if (user["user_token"] == usuario_user) {
                  console.log(response.new_editar);
                  user["conf_finanzas"][0]["bool_fnzs_perm_ver_docs"] = response.new_ver_docs;
                  if (user["permisos_solicitud"].length > 0) {
                    for (let b = 0; b < user["permisos_solicitud"].length; b++) {
                      const soli_user = user["permisos_solicitud"][b];
                      if (soli_user["modulo"] == "fnzs" && soli_user["permiso"] == "ver_docs") {
                        user["permisos_solicitud"].splice(b);
                        if (user["permisos_solicitud"].length == 0) {
                          user["class_perm"] = "col-12 noneView";
                          user["class_user"] = "col-12";
                        }
                      }
                    }
                  }
                }
              }
            }
            if (response.status == "error") {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          }, error => { console.log(error); }
        );
      }
    })
  }

  //Route::post("user_permisos_finanzas_catalogos_modulo",[MAIN_UsuarioController::class,"userPermisosFinanzasCatalogosModulo"]);
  //Route::post("user_permisos_finanzas_cuentas_bancarias",[MAIN_UsuarioController::class,"userPermisosFinanzasCuentasBancarias"]);
  //Route::post("user_permisos_finanzas_caja",[MAIN_UsuarioController::class,"userPermisosFinanzasCaja"]);
  //Route::post("user_permisos_finanzas_monederos_electronicos",[MAIN_UsuarioController::class,"userPermisosFinanzasMonederosElectronicos"]);
  //Route::post("user_permisos_finanzas_dispositivos_electronicos",[MAIN_UsuarioController::class,"userPermisosFinanzasDispositivosElectronicos"]);
  //Route::post("user_permisos_finanzas_control_mov_bancarios",[MAIN_UsuarioController::class,"userPermisosFinanzasControlMovBancarios"]);
  //Route::post("user_permisos_finanzas_control_mov_efectivo",[MAIN_UsuarioController::class,"userPermisosFinanzasControlMovEfectivo"]);
  //Route::post("user_permisos_finanzas_ordenes_pago",[MAIN_UsuarioController::class,"userPermisosFinanzasOrdenesPago"]);
  //Route::post("user_permisos_finanzas_ajustes_ycpr",[MAIN_UsuarioController::class,"userPermisosFinanzasAjustesyCPR"]);
  //Route::post("user_permisos_finanzas_info_bancaria",[MAIN_UsuarioController::class,"userPermisosFinanzasInfoBancaria"]);
  //valor_humano
  userValorHumanoPermAcceso(usuario_empresa: any, usuario_user: any, acceso: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
    }).then((result) => {
      if (result.isConfirmed) {
        this.users.user_permisos_valor_humano_acceso(usuario_empresa, usuario_user, acceso).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);

              for (let i = 0; i < this.usuarios_catalogo.length; i++) {
                const user = this.usuarios_catalogo[i];
                if (user["user_token"] == usuario_user) {
                  console.log(response.new_jerarquia);
                  user["conf_ingresos"][0]["jerarquia"] = response.new_jerarquia;
                }
              }
            }
            if (response.status == "error") {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          }, error => { console.log(error); }
        );
      }
    })
  }

  userValorHumanoPermJerarquia(usuario_empresa: any, usuario_user: any, jerarquia: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
    }).then((result) => {
      if (result.isConfirmed) {
        this.users.user_permisos_valor_humano_jerarquia(usuario_empresa, usuario_user, jerarquia).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);

              for (let i = 0; i < this.usuarios_catalogo.length; i++) {
                const user = this.usuarios_catalogo[i];
                if (user["user_token"] == usuario_user) {
                  console.log(response.new_jerarquia);
                  //user["conf_valor_humano"][0]["jerarquia"] = response.new_jerarquia; 
                  user["conf_valor_humano"][0]["jerarquia"] = response.new_jerarquia;
                }
              }
            }
            if (response.status == "error") {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          }, error => { console.log(error); }
        );
      }
    })
  }

  userValorHumanoPermCrear(usuario_empresa: any, usuario_user: any, perm_crear: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
    }).then((result) => {
      if (result.isConfirmed) {
        this.users.user_permisos_valor_humano_crear(usuario_empresa, usuario_user, perm_crear).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);

              for (let i = 0; i < this.usuarios_catalogo.length; i++) {
                const user = this.usuarios_catalogo[i];
                if (user["user_token"] == usuario_user) {
                  console.log(response.new_crear);
                  user["conf_valor_humano"][0]["bool_vhum_perm_crear"] = response.new_crear;
                  if (user["permisos_solicitud"].length > 0) {
                    for (let b = 0; b < user["permisos_solicitud"].length; b++) {
                      const soli_user = user["permisos_solicitud"][b];
                      if (soli_user["modulo"] == "vhum" && soli_user["permiso"] == "crear") {
                        user["permisos_solicitud"].splice(b);
                        if (user["permisos_solicitud"].length == 0) {
                          user["class_perm"] = "col-12 noneView";
                          user["class_user"] = "col-12";
                        }
                      }
                    }
                  }
                }
              }
            }
            if (response.status == "error") {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          }, error => { console.log(error); }
        );
      }
    })
  }

  userValorHumanoPermEditar(usuario_empresa: any, usuario_user: any, perm_editar: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
    }).then((result) => {
      if (result.isConfirmed) {
        this.users.user_permisos_valor_humano_editar(usuario_empresa, usuario_user, perm_editar).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);

              for (let i = 0; i < this.usuarios_catalogo.length; i++) {
                const user = this.usuarios_catalogo[i];
                if (user["user_token"] == usuario_user) {
                  console.log(response.new_editar);
                  user["conf_valor_humano"][0]["bool_vhum_perm_editar"] = response.new_editar;
                  if (user["permisos_solicitud"].length > 0) {
                    for (let b = 0; b < user["permisos_solicitud"].length; b++) {
                      const soli_user = user["permisos_solicitud"][b];
                      if (soli_user["modulo"] == "vhum" && soli_user["permiso"] == "editar") {
                        user["permisos_solicitud"].splice(b);
                        if (user["permisos_solicitud"].length == 0) {
                          user["class_perm"] = "col-12 noneView";
                          user["class_user"] = "col-12";
                        }
                      }
                    }
                  }
                }
              }
            }
            if (response.status == "error") {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          }, error => { console.log(error); }
        );
      }
    })
  }

  userValorHumanoPermConsultar(usuario_empresa: any, usuario_user: any, perm_consulta: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
    }).then((result) => {
      if (result.isConfirmed) {
        this.users.user_permisos_valor_humano_consultar(usuario_empresa, usuario_user, perm_consulta).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);

              for (let i = 0; i < this.usuarios_catalogo.length; i++) {
                const user = this.usuarios_catalogo[i];
                if (user["user_token"] == usuario_user) {
                  console.log(response.new_consultar);
                  user["conf_valor_humano"][0]["bool_vhum_perm_consulta"] = response.new_consultar;
                  if (user["permisos_solicitud"].length > 0) {
                    for (let b = 0; b < user["permisos_solicitud"].length; b++) {
                      const soli_user = user["permisos_solicitud"][b];
                      if (soli_user["modulo"] == "vhum" && soli_user["permiso"] == "consulta") {
                        user["permisos_solicitud"].splice(b);
                        if (user["permisos_solicitud"].length == 0) {
                          user["class_perm"] = "col-12 noneView";
                          user["class_user"] = "col-12";
                        }
                      }
                    }
                  }
                }
              }
            }
            if (response.status == "error") {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          }, error => { console.log(error); }
        );
      }
    })
  }

  userValorHumanoPermEliminar(usuario_empresa: any, usuario_user: any, perm_elimina: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
    }).then((result) => {
      if (result.isConfirmed) {
        this.users.user_permisos_valor_humano_eliminar(usuario_empresa, usuario_user, perm_elimina).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);

              for (let i = 0; i < this.usuarios_catalogo.length; i++) {
                const user = this.usuarios_catalogo[i];
                if (user["user_token"] == usuario_user) {
                  console.log(response.new_editar);
                  user["conf_valor_humano"][0]["bool_vhum_perm_elimina"] = response.new_eliminar;
                  if (user["permisos_solicitud"].length > 0) {
                    for (let b = 0; b < user["permisos_solicitud"].length; b++) {
                      const soli_user = user["permisos_solicitud"][b];
                      if (soli_user["modulo"] == "vhum" && soli_user["permiso"] == "eliminar") {
                        user["permisos_solicitud"].splice(b);
                        if (user["permisos_solicitud"].length == 0) {
                          user["class_perm"] = "col-12 noneView";
                          user["class_user"] = "col-12";
                        }
                      }
                    }
                  }
                }
              }
            }
            if (response.status == "error") {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          }, error => { console.log(error); }
        );
      }
    })
  }

  userValorHumanoPermVerDocs(usuario_empresa: any, usuario_user: any, perm_ver_docs: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
    }).then((result) => {
      if (result.isConfirmed) {
        this.users.user_permisos_valor_humano_ver_docs(usuario_empresa, usuario_user, perm_ver_docs).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);

              for (let i = 0; i < this.usuarios_catalogo.length; i++) {
                const user = this.usuarios_catalogo[i];
                if (user["user_token"] == usuario_user) {
                  console.log(response.new_editar);
                  user["conf_valor_humano"][0]["bool_vhum_perm_ver_docs"] = response.new_ver_docs;
                  if (user["permisos_solicitud"].length > 0) {
                    for (let b = 0; b < user["permisos_solicitud"].length; b++) {
                      const soli_user = user["permisos_solicitud"][b];
                      if (soli_user["modulo"] == "vhum" && soli_user["permiso"] == "ver_docs") {
                        user["permisos_solicitud"].splice(b);
                        if (user["permisos_solicitud"].length == 0) {
                          user["class_perm"] = "col-12 noneView";
                          user["class_user"] = "col-12";
                        }
                      }
                    }
                  }
                }
              }
            }
            if (response.status == "error") {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          }, error => { console.log(error); }
        );
      }
    })
  }

  //Route::post("user_permisos_valor_humano_catalogos",[MAIN_UsuarioController::class,"userPermisosValorHumanoCatalogos"]);
  //Route::post("user_permisos_valor_humano_reembolsos",[MAIN_UsuarioController::class,"userPermisosValorHumanoReembolsos"]);
  //Route::post("user_permisos_valor_humano_justificacion_gastos",[MAIN_UsuarioController::class,"userPermisosValorHumanoJustificacionGastos"]);
  //Route::post("user_permisos_valor_humano_reportes",[MAIN_UsuarioController::class,"userPermisosValorHumanoReportes"]);
  //contabilidad
  userContabilidadPermAcceso(usuario_empresa: any, usuario_user: any, acceso: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
    }).then((result) => {
      if (result.isConfirmed) {
        this.users.user_permisos_contabilidad_acceso(usuario_empresa, usuario_user, acceso).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);

              for (let i = 0; i < this.usuarios_catalogo.length; i++) {
                const user = this.usuarios_catalogo[i];
                if (user["user_token"] == usuario_user) {
                  console.log(response.new_jerarquia);
                  user["conf_ingresos"][0]["jerarquia"] = response.new_jerarquia;
                }
              }
            }
            if (response.status == "error") {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          }, error => { console.log(error); }
        );
      }
    })
  }

  userContabilidadPermJerarquia(usuario_empresa: any, usuario_user: any, jerarquia: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
    }).then((result) => {
      if (result.isConfirmed) {
        this.users.user_permisos_contabilidad_jerarquia(usuario_empresa, usuario_user, jerarquia).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);

              for (let i = 0; i < this.usuarios_catalogo.length; i++) {
                const user = this.usuarios_catalogo[i];
                if (user["user_token"] == usuario_user) {
                  console.log(response.new_jerarquia);
                  //user["conf_contabilidad"][0]["jerarquia"] = response.new_jerarquia; 
                  user["conf_contabilidad"][0]["jerarquia"] = response.new_jerarquia;
                }
              }
            }
            if (response.status == "error") {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          }, error => { console.log(error); }
        );
      }
    })
  }

  userContabilidadPermCrear(usuario_empresa: any, usuario_user: any, perm_crear: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
    }).then((result) => {
      if (result.isConfirmed) {
        this.users.user_permisos_contabilidad_crear(usuario_empresa, usuario_user, perm_crear).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);

              for (let i = 0; i < this.usuarios_catalogo.length; i++) {
                const user = this.usuarios_catalogo[i];
                if (user["user_token"] == usuario_user) {
                  console.log(response.new_crear);
                  user["conf_contabilidad"][0]["bool_cont_perm_crear"] = response.new_crear;
                  if (user["permisos_solicitud"].length > 0) {
                    for (let b = 0; b < user["permisos_solicitud"].length; b++) {
                      const soli_user = user["permisos_solicitud"][b];
                      if (soli_user["modulo"] == "cont" && soli_user["permiso"] == "crear") {
                        user["permisos_solicitud"].splice(b);
                        if (user["permisos_solicitud"].length == 0) {
                          user["class_perm"] = "col-12 noneView";
                          user["class_user"] = "col-12";
                        }
                      }
                    }
                  }

                }
              }
            }
            if (response.status == "error") {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          }, error => { console.log(error); }
        );
      }
    })
  }

  userContabilidadPermEditar(usuario_empresa: any, usuario_user: any, perm_editar: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
    }).then((result) => {
      if (result.isConfirmed) {
        this.users.user_permisos_contabilidad_editar(usuario_empresa, usuario_user, perm_editar).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);

              for (let i = 0; i < this.usuarios_catalogo.length; i++) {
                const user = this.usuarios_catalogo[i];
                if (user["user_token"] == usuario_user) {
                  console.log(response.new_editar);
                  user["conf_contabilidad"][0]["bool_cont_perm_editar"] = response.new_editar;
                  if (user["permisos_solicitud"].length > 0) {
                    for (let b = 0; b < user["permisos_solicitud"].length; b++) {
                      const soli_user = user["permisos_solicitud"][b];
                      if (soli_user["modulo"] == "cont" && soli_user["permiso"] == "editar") {
                        user["permisos_solicitud"].splice(b);
                        if (user["permisos_solicitud"].length == 0) {
                          user["class_perm"] = "col-12 noneView";
                          user["class_user"] = "col-12";
                        }
                      }
                    }
                  }

                }
              }
            }
            if (response.status == "error") {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          }, error => { console.log(error); }
        );
      }
    })
  }

  userContabilidadPermConsultar(usuario_empresa: any, usuario_user: any, perm_consulta: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
    }).then((result) => {
      if (result.isConfirmed) {
        this.users.user_permisos_contabilidad_consultar(usuario_empresa, usuario_user, perm_consulta).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);

              for (let i = 0; i < this.usuarios_catalogo.length; i++) {
                const user = this.usuarios_catalogo[i];
                if (user["user_token"] == usuario_user) {
                  console.log(response.new_editar);
                  user["conf_contabilidad"][0]["bool_cont_perm_consulta"] = response.new_consultar;
                  if (user["permisos_solicitud"].length > 0) {
                    for (let b = 0; b < user["permisos_solicitud"].length; b++) {
                      const soli_user = user["permisos_solicitud"][b];
                      if (soli_user["modulo"] == "cont" && soli_user["permiso"] == "consulta") {
                        user["permisos_solicitud"].splice(b);
                        if (user["permisos_solicitud"].length == 0) {
                          user["class_perm"] = "col-12 noneView";
                          user["class_user"] = "col-12";
                        }
                      }
                    }
                  }
                }
              }
            }
            if (response.status == "error") {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          }, error => { console.log(error); }
        );
      }
    })
  }

  userContabilidadPermEliminar(usuario_empresa: any, usuario_user: any, perm_elimina: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
    }).then((result) => {
      if (result.isConfirmed) {
        this.users.user_permisos_contabilidad_eliminar(usuario_empresa, usuario_user, perm_elimina).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);

              for (let i = 0; i < this.usuarios_catalogo.length; i++) {
                const user = this.usuarios_catalogo[i];
                if (user["user_token"] == usuario_user) {
                  console.log(response.new_editar);
                  user["conf_contabilidad"][0]["bool_cont_perm_elimina"] = response.new_eliminar;
                  if (user["permisos_solicitud"].length > 0) {
                    for (let b = 0; b < user["permisos_solicitud"].length; b++) {
                      const soli_user = user["permisos_solicitud"][b];
                      if (soli_user["modulo"] == "cont" && soli_user["permiso"] == "eliminar") {
                        user["permisos_solicitud"].splice(b);
                        if (user["permisos_solicitud"].length == 0) {
                          user["class_perm"] = "col-12 noneView";
                          user["class_user"] = "col-12";
                        }
                      }
                    }
                  }
                }
              }
            }
            if (response.status == "error") {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          }, error => { console.log(error); }
        );
      }
    })
  }

  userContabilidadPermVerDocs(usuario_empresa: any, usuario_user: any, perm_ver_docs: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
    }).then((result) => {
      if (result.isConfirmed) {
        this.users.user_permisos_contabilidad_ver_docs(usuario_empresa, usuario_user, perm_ver_docs).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);

              for (let i = 0; i < this.usuarios_catalogo.length; i++) {
                const user = this.usuarios_catalogo[i];
                if (user["user_token"] == usuario_user) {
                  console.log(response.new_editar);
                  user["conf_contabilidad"][0]["bool_cont_perm_ver_docs"] = response.new_ver_docs;
                  if (user["permisos_solicitud"].length > 0) {
                    for (let b = 0; b < user["permisos_solicitud"].length; b++) {
                      const soli_user = user["permisos_solicitud"][b];
                      if (soli_user["modulo"] == "cont" && soli_user["permiso"] == "ver_docs") {
                        user["permisos_solicitud"].splice(b);
                        if (user["permisos_solicitud"].length == 0) {
                          user["class_perm"] = "col-12 noneView";
                          user["class_user"] = "col-12";
                        }
                      }
                    }
                  }
                }
              }
            }
            if (response.status == "error") {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          }, error => { console.log(error); }
        );
      }
    })
  }

  //Route::post("user_permisos_contabilidad_catalogos",[MAIN_UsuarioController::class,"userPermisosContabilidadCatalogos"]);
  //Route::post("user_permisos_contabilidad_politicas",[MAIN_UsuarioController::class,"userPermisosContabilidadPoliticas"]);
  //Route::post("user_permisos_contabilidad_catalogo_cuentas",[MAIN_UsuarioController::class,"userPermisosContabilidadCatalogoCuentas"]);
  //Route::post("user_permisos_contabilidad_estados_financieros",[MAIN_UsuarioController::class,"userPermisosContabilidadEstadosFinancieros"]);
  //Route::post("user_permisos_contabilidad_reportes",[MAIN_UsuarioController::class,"userPermisosContabilidadReportes"]);
  //tec_info
  userTecInfoPermAcceso(usuario_empresa: any, usuario_user: any, acceso: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
    }).then((result) => {
      if (result.isConfirmed) {
        this.users.user_permisos_teci_info_acceso(usuario_empresa, usuario_user, acceso).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);

              for (let i = 0; i < this.usuarios_catalogo.length; i++) {
                const user = this.usuarios_catalogo[i];
                if (user["user_token"] == usuario_user) {
                  console.log(response.new_jerarquia);
                  user["conf_ingresos"][0]["jerarquia"] = response.new_jerarquia;
                }
              }
            }
            if (response.status == "error") {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          }, error => { console.log(error); }
        );
      }
    })
  }

  userTecInfoPermJerarquia(usuario_empresa: any, usuario_user: any, jerarquia: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
    }).then((result) => {
      if (result.isConfirmed) {
        this.users.user_permisos_teci_info_jerarquia(usuario_empresa, usuario_user, jerarquia).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);

              for (let i = 0; i < this.usuarios_catalogo.length; i++) {
                const user = this.usuarios_catalogo[i];
                if (user["user_token"] == usuario_user) {
                  console.log(response.new_jerarquia);
                  //user["conf_tec_info"][0]["jerarquia"] = response.new_jerarquia; 
                  user["conf_tec_info"][0]["jerarquia"] = response.new_jerarquia;
                }
              }
            }
            if (response.status == "error") {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          }, error => { console.log(error); }
        );
      }
    })
  }

  userTecInfoPermCrear(usuario_empresa: any, usuario_user: any, perm_crear: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
    }).then((result) => {
      if (result.isConfirmed) {
        this.users.user_permisos_teci_info_crear(usuario_empresa, usuario_user, perm_crear).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);

              for (let i = 0; i < this.usuarios_catalogo.length; i++) {
                const user = this.usuarios_catalogo[i];
                if (user["user_token"] == usuario_user) {
                  console.log(response.new_crear);
                  user["conf_tec_info"][0]["bool_teci_perm_crear"] = response.new_crear;
                  if (user["permisos_solicitud"].length > 0) {
                    for (let b = 0; b < user["permisos_solicitud"].length; b++) {
                      const soli_user = user["permisos_solicitud"][b];
                      if (soli_user["modulo"] == "teci" && soli_user["permiso"] == "crear") {
                        user["permisos_solicitud"].splice(b);
                        if (user["permisos_solicitud"].length == 0) {
                          user["class_perm"] = "col-12 noneView";
                          user["class_user"] = "col-12";
                        }
                      }
                    }
                  }

                }
              }
            }
            if (response.status == "error") {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          }, error => { console.log(error); }
        );
      }
    })
  }

  userTecInfoPermEditar(usuario_empresa: any, usuario_user: any, perm_editar: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
    }).then((result) => {
      if (result.isConfirmed) {
        this.users.user_permisos_teci_info_editar(usuario_empresa, usuario_user, perm_editar).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);

              for (let i = 0; i < this.usuarios_catalogo.length; i++) {
                const user = this.usuarios_catalogo[i];
                if (user["user_token"] == usuario_user) {
                  console.log(response.new_editar);
                  user["conf_tec_info"][0]["bool_teci_perm_editar"] = response.new_editar;
                  if (user["permisos_solicitud"].length > 0) {
                    for (let b = 0; b < user["permisos_solicitud"].length; b++) {
                      const soli_user = user["permisos_solicitud"][b];
                      if (soli_user["modulo"] == "teci" && soli_user["permiso"] == "editar") {
                        user["permisos_solicitud"].splice(b);
                        if (user["permisos_solicitud"].length == 0) {
                          user["class_perm"] = "col-12 noneView";
                          user["class_user"] = "col-12";
                        }
                      }
                    }
                  }

                }
              }
            }
            if (response.status == "error") {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          }, error => { console.log(error); }
        );
      }
    })
  }

  userTecInfoPermConsultar(usuario_empresa: any, usuario_user: any, perm_consulta: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
    }).then((result) => {
      if (result.isConfirmed) {
        this.users.user_permisos_teci_info_consultar(usuario_empresa, usuario_user, perm_consulta).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);

              for (let i = 0; i < this.usuarios_catalogo.length; i++) {
                const user = this.usuarios_catalogo[i];
                if (user["user_token"] == usuario_user) {
                  console.log(response.new_editar);
                  user["conf_tec_info"][0]["bool_teci_perm_consulta"] = response.new_consultar;
                  if (user["permisos_solicitud"].length > 0) {
                    for (let b = 0; b < user["permisos_solicitud"].length; b++) {
                      const soli_user = user["permisos_solicitud"][b];
                      if (soli_user["modulo"] == "teci" && soli_user["permiso"] == "consulta") {
                        user["permisos_solicitud"].splice(b);
                        if (user["permisos_solicitud"].length == 0) {
                          user["class_perm"] = "col-12 noneView";
                          user["class_user"] = "col-12";
                        }
                      }
                    }
                  }
                }
              }
            }
            if (response.status == "error") {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          }, error => { console.log(error); }
        );
      }
    })
  }

  userTecInfoPermEliminar(usuario_empresa: any, usuario_user: any, perm_elimina: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
    }).then((result) => {
      if (result.isConfirmed) {
        this.users.user_permisos_teci_info_eliminar(usuario_empresa, usuario_user, perm_elimina).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);

              for (let i = 0; i < this.usuarios_catalogo.length; i++) {
                const user = this.usuarios_catalogo[i];
                if (user["user_token"] == usuario_user) {
                  console.log(response.new_editar);
                  user["conf_tec_info"][0]["bool_teci_perm_elimina"] = response.new_eliminar;
                  if (user["permisos_solicitud"].length > 0) {
                    for (let b = 0; b < user["permisos_solicitud"].length; b++) {
                      const soli_user = user["permisos_solicitud"][b];
                      if (soli_user["modulo"] == "teci" && soli_user["permiso"] == "eliminar") {
                        user["permisos_solicitud"].splice(b);
                        if (user["permisos_solicitud"].length == 0) {
                          user["class_perm"] = "col-12 noneView";
                          user["class_user"] = "col-12";
                        }
                      }
                    }
                  }
                }
              }
            }
            if (response.status == "error") {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          }, error => { console.log(error); }
        );
      }
    })
  }

  userTecInfoPermVerDocs(usuario_empresa: any, usuario_user: any, perm_ver_docs: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
    }).then((result) => {
      if (result.isConfirmed) {
        this.users.user_permisos_teci_info_ver_docs(usuario_empresa, usuario_user, perm_ver_docs).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);

              for (let i = 0; i < this.usuarios_catalogo.length; i++) {
                const user = this.usuarios_catalogo[i];
                if (user["user_token"] == usuario_user) {
                  console.log(response.new_editar);
                  user["conf_tec_info"][0]["bool_teci_perm_ver_docs"] = response.new_ver_docs;
                  if (user["permisos_solicitud"].length > 0) {
                    for (let b = 0; b < user["permisos_solicitud"].length; b++) {
                      const soli_user = user["permisos_solicitud"][b];
                      if (soli_user["modulo"] == "teci" && soli_user["permiso"] == "ver_docs") {
                        user["permisos_solicitud"].splice(b);
                        if (user["permisos_solicitud"].length == 0) {
                          user["class_perm"] = "col-12 noneView";
                          user["class_user"] = "col-12";
                        }
                      }
                    }
                  }
                }
              }
            }
            if (response.status == "error") {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          }, error => { console.log(error); }
        );
      }
    })
  }

  userTecInfoPermAppsComplementarias(usuario_empresa: any, usuario_user: any, perm_apps: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
    }).then((result) => {
      if (result.isConfirmed) {
        this.users.user_permisos_teci_info_apps_complementarias(usuario_empresa, usuario_user, perm_apps).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);

              for (let i = 0; i < this.usuarios_catalogo.length; i++) {
                const user = this.usuarios_catalogo[i];
                if (user["user_token"] == usuario_user) {
                  console.log(response.new_apps);
                  user["conf_tec_info"][0]["bool_teci_apps_complement"] = response.new_apps;
                  if (user["permisos_solicitud"].length > 0) {
                    for (let b = 0; b < user["permisos_solicitud"].length; b++) {
                      const soli_user = user["permisos_solicitud"][b];
                      if (soli_user["modulo"] == "teci" && soli_user["permiso"] == "apps_complementarias") {
                        user["permisos_solicitud"].splice(b);
                        if (user["permisos_solicitud"].length == 0) {
                          user["class_perm"] = "col-12 noneView";
                          user["class_user"] = "col-12";
                        }
                      }
                    }
                  }
                }
              }
            }
            if (response.status == "error") {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          }, error => { console.log(error); }
        );
      }
    })
  }

  userTecInfoPermSoporte(usuario_empresa: any, usuario_user: any, perm_soporte: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
    }).then((result) => {
      if (result.isConfirmed) {
        this.users.user_permisos_teci_info_soporte(usuario_empresa, usuario_user, perm_soporte).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);

              for (let i = 0; i < this.usuarios_catalogo.length; i++) {
                const user = this.usuarios_catalogo[i];
                if (user["user_token"] == usuario_user) {
                  console.log(response.new_soporte);
                  user["conf_tec_info"][0]["bool_teci_soporte"] = response.new_soporte;
                  if (user["permisos_solicitud"].length > 0) {
                    for (let b = 0; b < user["permisos_solicitud"].length; b++) {
                      const soli_user = user["permisos_solicitud"][b];
                      if (soli_user["modulo"] == "teci" && soli_user["permiso"] == "soporte") {
                        user["permisos_solicitud"].splice(b);
                        if (user["permisos_solicitud"].length == 0) {
                          user["class_perm"] = "col-12 noneView";
                          user["class_user"] = "col-12";
                        }
                      }
                    }
                  }
                }
              }
            }
            if (response.status == "error") {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          }, error => { console.log(error); }
        );
      }
    })
  }

  userTecInfoPermComunicacion(usuario_empresa: any, usuario_user: any, perm_comunicacion: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
    }).then((result) => {
      if (result.isConfirmed) {
        this.users.user_permisos_teci_info_comunicacion(usuario_empresa, usuario_user, perm_comunicacion).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);

              for (let i = 0; i < this.usuarios_catalogo.length; i++) {
                const user = this.usuarios_catalogo[i];
                if (user["user_token"] == usuario_user) {
                  console.log(response.new_comunicacion);
                  user["conf_tec_info"][0]["bool_teci_comunicacion"] = response.new_comunicacion;
                  if (user["permisos_solicitud"].length > 0) {
                    for (let b = 0; b < user["permisos_solicitud"].length; b++) {
                      const soli_user = user["permisos_solicitud"][b];
                      if (soli_user["modulo"] == "teci" && soli_user["permiso"] == "comunicacion") {
                        user["permisos_solicitud"].splice(b);
                        if (user["permisos_solicitud"].length == 0) {
                          user["class_perm"] = "col-12 noneView";
                          user["class_user"] = "col-12";
                        }
                      }
                    }
                  }
                }
              }
            }
            if (response.status == "error") {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          }, error => { console.log(error); }
        );
      }
    })
  }

  userTecInfoPermPublicaciones(usuario_empresa: any, usuario_user: any, perm_publicaciones: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
    }).then((result) => {
      if (result.isConfirmed) {
        this.users.user_permisos_teci_info_publicaciones(usuario_empresa, usuario_user, perm_publicaciones).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);

              for (let i = 0; i < this.usuarios_catalogo.length; i++) {
                const user = this.usuarios_catalogo[i];
                if (user["user_token"] == usuario_user) {
                  console.log(response.new_publicaciones);
                  user["conf_tec_info"][0]["bool_teci_publicaciones"] = response.new_publicaciones;
                  if (user["permisos_solicitud"].length > 0) {
                    for (let b = 0; b < user["permisos_solicitud"].length; b++) {
                      const soli_user = user["permisos_solicitud"][b];
                      if (soli_user["modulo"] == "teci" && soli_user["permiso"] == "publicaciones") {
                        user["permisos_solicitud"].splice(b);
                        if (user["permisos_solicitud"].length == 0) {
                          user["class_perm"] = "col-12 noneView";
                          user["class_user"] = "col-12";
                        }
                      }
                    }
                  }
                }
              }
            }
            if (response.status == "error") {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          }, error => { console.log(error); }
        );
      }
    })
  }

  //Route::post("user_permisos_teci_info_apps_complementarias",[MAIN_UsuarioController::class,"userPermisosTeciInfoAppsComplementarias"]);
  //Route::post("user_permisos_teci_info_soporte",[MAIN_UsuarioController::class,"userPermisosTeciInfoSoporte"]);
  //Route::post("user_permisos_teci_info_comunicacion",[MAIN_UsuarioController::class,"userPermisosTeciInfoComunicacion"]);
  //Route::post("user_permisos_teci_info_publicaciones",[MAIN_UsuarioController::class,"userPermisosTeciInfoPublicaciones"]);

  //permisos
  //ingresos

  //egresos

  //bool_eegr_perm_crear
  changePermCrearUser(user_token: any) { console.log("user_token " + user_token); }
  //bool_eegr_perm_editar
  changePermEditarUser(user_token: any) { console.log("user_token " + user_token); }
  //bool_eegr_perm_consulta
  changePermConsultaUser(user_token: any) { console.log("user_token " + user_token); }
  //bool_eegr_perm_elimina
  changePermEliminaUser(user_token: any) { console.log("user_token " + user_token); }
  //bool_eegr_perm_ver_docs
  changePermVerDocsUser(user_token: any) { console.log("user_token " + user_token); }

  //bool_eegr_catalogos
  changeEegrCatalogosUser(user_token: any) { console.log("user_token " + user_token); }
  //bool_eegr_cat_prod
  changeEegrCatProdUser(user_token: any) { console.log("user_token " + user_token); }
  //bool_eegr_cat_serv
  changeEegrCatServUser(user_token: any) { console.log("user_token " + user_token); }
  //bool_eegr_cat_actf
  changeEegrCatActfUser(user_token: any) { console.log("user_token " + user_token); }
  //bool_eegr_cat_acti
  changeEegrCatActiUser(user_token: any) { console.log("user_token " + user_token); }
  //bool_eegr_cat_prov
  changeEegrCatProvUser(user_token: any) { console.log("user_token " + user_token); }
  //bool_eegr_cat_esta
  changeEegrCatEstaUser(user_token: any) { console.log("user_token " + user_token); }

  //bool_eegr_compras
  changeEegrComprasUser(user_token: any) { console.log("user_token " + user_token); }
  //bool_eegr_comp_req
  changeEegrCompReqUser(user_token: any) { console.log("user_token " + user_token); }
  //bool_eegr_comp_cot
  changeEegrCompCotUser(user_token: any) { console.log("user_token " + user_token); }
  //bool_eegr_comp_dir
  changeEegrCompDirUser(user_token: any) { console.log("user_token " + user_token); }
  //bool_eegr_comp_seg
  changeEegrCompSegUser(user_token: any) { console.log("user_token " + user_token); }

  //finanzas
  //valor_humano
  //contabilidad
  //tec_info

  //registro de usuarios
  get isPaternoValid(): boolean {
    return this.new_user_paterno != '' && this.validator.strFilter(this.new_user_paterno) && this.new_user_paterno.length >= 4;
  }

  get isMaternoValid(): boolean {
    return this.new_user_materno != '' && this.validator.strFilter(this.new_user_materno) && this.new_user_materno.length >= 4;
  }

  get isNombresValid(): boolean {
    return this.new_user_nombres != '' && this.validator.strFilter(this.new_user_nombres) && this.new_user_nombres.length >= 3;
  }

  get isEmailValid(): boolean {
    return this.new_user_email != '' && this.validator.filtroCorreo(this.new_user_email) == true;
  }

  get isAreaValid(): boolean {
    const area_r = this.list_areas_user.find((a: any) => a.token_area === this.new_user_area);
    return this.new_user_area != "" && typeof area_r !== 'undefined';
  }

  get isCargoValid(): boolean {
    const cargo_r = this.list_cargos_user.find((c: any) => c.cargo_tkn === this.new_user_cargo);
    return this.new_user_cargo != "" && typeof cargo_r !== 'undefined';
  }

  get isEmpresasValid(): boolean {
    return this.new_user_empresas_vinculadas && this.new_user_empresas_vinculadas.length > 0;
  }

  creaPaternoUsuario(event: any) {
    const validacion = event.value != "" && this.validator.strFilter(event.value) && event.value.length >= 4;
    this.new_user_paterno = validacion ? event.value : "";
  }

  creaMaternoUsuario(event: any) {
    const validacion = event.value != "" && this.validator.strFilter(event.value) && event.value.length >= 4;
    this.new_user_materno = validacion ? event.value : "";
  }

  creaNombresUsuario(event: any) {
    const validacion = event.value != "" && this.validator.strFilter(event.value) && event.value.length >= 3;
    this.new_user_nombres = validacion ? event.value : "";
  }

  creaEmailUsuario(event: any) {
    const validacion = event.value != '' && this.validator.filtroCorreo(event.value);
    this.new_user_email = validacion ? event.value : "";
  }

  selectEmpresaUsuario(event: any) {
    const validacion = event.value != '' && this.validator.filtroCorreo(event.value);
    this.new_user_email = validacion ? event.value : "";
  }

  selectAreasUsuario(opcion: any) {
    console.log(opcion);
    const area_r = this.list_areas_user.find((a: any) => a.token_area === opcion.token_area);
    this.list_cargos_user = typeof area_r !== 'undefined' ? area_r.cargos : [];
    console.log(this.list_cargos_user);
    this.new_user_area = typeof area_r !== 'undefined' ? area_r.token_area : '';
  }

  selectCargoUsuario(opcion: any) {
    console.log(opcion);
    const cargo_r = this.list_cargos_user.find((a: any) => a.cargo_tkn === opcion.cargo_tkn);
    this.new_user_cargo = typeof cargo_r !== 'undefined' ? cargo_r.cargo_tkn : '';
  }

  get valida_registro_usuario(): Boolean {
    return this.isPaternoValid && this.isMaternoValid && this.isNombresValid && this.isEmailValid && this.isEmpresasValid && this.isAreaValid && this.isCargoValid;
  }

  registraUsuario() {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_insert"),
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_insert"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this.users.registrar_usuario_nuevo(this.new_user_paterno, this.new_user_materno, this.new_user_nombres, this.new_user_email, this.encryptor.santoEncryptCode(this.new_user_email), this.new_user_empresas_vinculadas, this.new_user_area, this.new_user_cargo).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);
              console.log(response.token_user_new);
              this.listando_catalogo_de_usuarios();
              var token_user_new = response.token_user_new;
              var possible_letter = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
              var possible_char = '.,#$%&/()=';
              var stringDataCode = token_user_new + this.new_user_paterno + this.new_user_materno + this.new_user_nombres + this.new_user_email + "code_access";
              var primerDataCode = this.encryptor.santoEncryptCode(stringDataCode).substring(0, 7);
              for (let a = 0; a < 1; a++) {
                primerDataCode = possible_letter.charAt(Math.floor(Math.random() * possible_letter.length)) + primerDataCode;
              }
              var segundaDataCode = this.encryptor.santoEncryptCode(primerDataCode);

              var stringDataPass = token_user_new + Math.random() + this.new_user_paterno + this.new_user_email + this.new_user_nombres + "password" + this.new_user_materno;
              var primerDataPass = this.encryptor.santoEncryptPass(stringDataPass).substring(0, 8);
              for (let i = 0; i < 2; i++) {
                primerDataPass = primerDataPass + possible_char.charAt(Math.floor(Math.random() * possible_char.length));
              }
              for (let j = 0; j < 1; j++) {
                primerDataPass = possible_letter.charAt(Math.floor(Math.random() * possible_letter.length)) + primerDataPass;
              }
              var segundaDataPass = this.encryptor.santoEncryptPass(primerDataPass);

              console.log(primerDataCode);
              console.log(primerDataPass);
              this.users.generaPassCodeUser(segundaDataCode, segundaDataPass, token_user_new).subscribe(
                response => {
                  if (response.status == 'success') {
                    var contenidoHtml = '<html><head><title>titulo de la página</title></head>' +
                      '<body><div style="background-color: #d3d3d3;display:flex;justify-content:center">' +
                      '<h4 style="width: 100%;font-size: 35px;font-weight: bold;"></h4>' +
                      '<h6 style="width: 100%;font-weight: 600;"></h6><br>' +
                      '<p style="width: 100%;margin: 0;padding: 20px;"></p>' +
                      '<p style="width: 100%;margin: 0;padding-left: 20px;">Código de acceso: <strong>' + primerDataCode + '</strong></p>' +
                      '<p style="width: 100%;margin: 0;padding-left: 20px;">Contraseña: <strong>' + primerDataPass + '</strong></p>' +
                      '</div></body></html>';
                    const parametros = {
                      from_name: 'SOPORTE SOS',
                      from_email: 'soporte@sos-mexico.com.mx',
                      to_name: this.new_user_paterno + ' ' + this.new_user_materno + ' ' + this.new_user_nombres + ' <' + this.new_user_email + '>',
                      to_email: this.new_user_email,
                      access_code: primerDataCode,
                      pass_code: primerDataPass,
                      link: 'https://sos-mexico.com.mx/clientes'
                    };

                    //emailjs.send(user['email'],contenidoHtml,parametros,'')
                    emailjs.send('service_dejznyj', 'template_v1nh0fl', parametros, 'H1Nl6vkZbsBm1MtNF')
                      .then((response) => {
                        console.log("success", response.status, response.text);
                        Swal.fire({
                          position: 'center',
                          icon: 'success',
                          title: response.text,
                          showConfirmButton: false,
                          timer: 3000
                        });
                        setTimeout(function () {
                          window.location.reload();
                        }, 3000);
                      }, (err) => {
                        console.log("falla", err);
                        Swal.fire({
                          position: 'top-end',
                          icon: 'warning',
                          title: "falla " + err,
                          showConfirmButton: false,
                          timer: 3000
                        })
                      });

                  }
                }, error => { console.log(error); }
              );
              //window.location.reload();
            }
            if (response.status == "error") {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          }, error => { console.log(error); }
        );
      }
    });
  }
}
