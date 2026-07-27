import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ServNavSuperiorService } from '../servicios/ssic/serv-nav-superior.service';
import { catchError, map, of } from 'rxjs';

export const pagosGuard: CanActivateFn = (route, state) => {
  const navSupServ = inject(ServNavSuperiorService);
  const router = inject(Router);
  return navSupServ.acceso_finanzas_acceso_ordenesdepago().pipe(
    map((response) => {
      if (response.status == 'success' && response.acceso_paym_ord == true) {
        return true;
      } else {
        // ❌ NO TIENE PERMISO: Redirigimos a la página de error
        // En los Guards modernos, retornar un UrlTree redirige automáticamente
        return router.createUrlTree(['/plataformas/permission_denied']);
      }
    }),
    catchError((error) => {
      console.error('Error verificando permisos de pagos:', error);
      // Si falla el servidor o la red, por seguridad bloqueamos y redirigimos
      return of(router.createUrlTree(['/plataformas/permission_denied']));
    })
  );
};
