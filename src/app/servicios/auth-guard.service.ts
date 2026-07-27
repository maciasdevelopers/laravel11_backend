import { Injectable } from '@angular/core';
import {CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import { GuardGuard } from './guard.guard';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(
    private authGuard:GuardGuard,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean>{
    const isLoggedIn = false; // ... your login logic here
    const countLocalStorage = localStorage.length;
    const countSessionStorage = sessionStorage.length;
    //console.log(countLocalStorage+" "+countSessionStorage);
    //console.log(userLogin);

    if (localStorage.length > 0) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }

}
