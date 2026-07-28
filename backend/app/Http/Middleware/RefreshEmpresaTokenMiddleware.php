<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\ExpiredException;
use Symfony\Component\HttpFoundation\Response;

class RefreshEmpresaTokenMiddleware{
  /**
   * Handle an incoming request.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  \Closure  $next
   * @return \Symfony\Component\HttpFoundation\Response
   */
  public function handle(Request $request, Closure $next): Response{
    // Priorizar header x-moriah-key/X-Moriah-Key sobre cookie
    $token = $request->header('X-Moriah-Key') ?? $request->cookie('moriah_key');
  
    if (!$token) {
      return $next($request);
    }

    $payloadData = null;
    $shouldRefresh = false;
  
    try {
      $key = config('services.jwt.secret');
      $decoded = JWT::decode($token, new Key($key, 'HS256'));
      $payloadData = $decoded;
      $shouldRefresh = ($decoded->exp - time()) <= 1200; // Quedan 20 min o menos (se refresca cada 10 min si exp es 30 min)
    } catch (ExpiredException $e) {
      /**
       * Si el JWT expiró, intentamos recuperarlo manualmente para renovar
       * siempre que el token original siga presente.
       */
      try {
        $tks = explode('.', $token);
        if (count($tks) === 3) {
          $payloadData = JWT::jsonDecode(JWT::urlsafeB64Decode($tks[1]));
          $shouldRefresh = true;
        }
      } catch (\Throwable $inner) {
        return $next($request);
      }
    } catch (\Throwable $e) {
      return $next($request);
    }
    
    // Validar que tengamos los datos necesarios para el contexto
    if ($payloadData && $shouldRefresh && !empty($payloadData->empresa_token)) {
      $newPayload = [
        'ctx'           => 'moriah',
        'user_token'    => $payloadData->user_token ?? null,
        'empresa_token' => $payloadData->empresa_token,
        'iat'           => time(),
        'exp'           => time() + (30 * 60) // 30 minutos más
      ];

      $newJwt = JWT::encode($newPayload, config('services.jwt.secret'), 'HS256');

      /**
       * Actualizamos la cookie en el request para que EnsureMalchutContext
       * trabaje con el token nuevo.
       */
      $request->cookies->set('moriah_key', $newJwt);

      // Mantener consistencia con el dominio (.sos-mexico.com.mx)
      $cookie = cookie(
        'moriah_key',
        $newJwt,
        240, // 4 horas
        '/',
        '.sos-mexico.com.mx', 
        true,
        true,
        false,
        'None'
      );

      $response = $next($request);
      $response->headers->set('X-Refreshed-Moriah', $newJwt);
      return $response->withCookie($cookie);
    }

    return $next($request);
  }
}