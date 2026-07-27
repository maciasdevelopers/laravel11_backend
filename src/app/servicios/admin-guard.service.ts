import { Injectable } from '@angular/core';
import {CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import { GuardGuard } from './guard.guard';
import { SessionContextService } from './session-context';

@Injectable()
export class AdminGuardService implements CanActivate {

  constructor(
    private authGuard:GuardGuard,
    private sessionContext: SessionContextService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean>{
    const es_admin_emp = this.sessionContext.empresa_data?.es_administradora;
    if (localStorage.length > 0 && es_admin_emp) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }

}
