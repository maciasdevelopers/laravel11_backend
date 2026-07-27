<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\ExpiredException;
use Symfony\Component\HttpFoundation\Response;

class RefreshUserTokenMiddleware{
  /**
   * Handle an incoming request.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  \Closure  $next
   * @return \Symfony\Component\HttpFoundation\Response
   */
  public function handle(Request $request, Closure $next): Response{
    $token = $request->cookie('code_inside');
  
    if (!$token) {
      return $next($request);
    }
  
    $userToken = null;
    $shouldRefresh = false;

    try {
      $key = config('services.jwt.secret');
      $decoded = JWT::decode($token, new Key($key, 'HS256'));
      $userToken = $decoded->user_token ?? null;

      // Se refresca si queda menos del 66% del tiempo (si exp es 30m, refresca si quedan <= 20m)
      // Esto asegura que cada 10m de actividad se renueve.
      $shouldRefresh = ($decoded->exp - time()) <= 1200;
    } catch (ExpiredException $e) {
      /**
       * Si el JWT expiró, intentamos recuperarlo manualmente para renovar
       * siempre que la cookie de larga duración (4h) siga presente.
       */
      try {
        $tks = explode('.', $token);
        if (count($tks) === 3) {
          $payload = JWT::jsonDecode(JWT::urlsafeB64Decode($tks[1]));
          $userToken = $payload->user_token ?? null;
          $shouldRefresh = true;
        }
      } catch (\Throwable $inner) {
        return $next($request);
      }
    } catch (\Throwable $e) {
      return $next($request);
    }
  
    if ($userToken && $shouldRefresh) {
      $newPayload = [
        'user_token' => $userToken,
        'iat'        => time(),
        'exp'        => time() + (30 * 60), // 30 minutos de vida
      ];
  
      $newJwt = JWT::encode($newPayload, config('services.jwt.secret'), 'HS256');
  
      /**
       * Actualizamos la cookie en el request para que JwtMiddleware
       * trabaje con el token nuevo.
       */
      $request->cookies->set('code_inside', $newJwt);

      $cookie = cookie(
        'code_inside',
        $newJwt,
        240, // 4 horas de persistencia en navegador
        '/',
        '.sos-mexico.com.mx',
        true,
        true,
        false,
        'None'
      );

      $response = $next($request);
      return $response->withCookie($cookie);
    }
  
    return $next($request);
  }
}