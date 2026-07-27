import { Injectable } from '@angular/core';
import {CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import { GuardGuard } from './guard.guard';

@Injectable()
export class LogDisGuardService implements CanActivate {

  constructor(
    private authGuard:GuardGuard,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean>{
    console.log(sessionStorage.length);
    if (sessionStorage.length == 0) {
      return true;
    } else {
      return false;
    }
  }

}
