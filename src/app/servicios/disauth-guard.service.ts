import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import {CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import { GuardGuard } from './guard.guard';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class DisAuthGuardService implements CanActivate {

  constructor(private authGuard:GuardGuard,private router: Router,@Inject(PLATFORM_ID) private platformId: Object) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean>{
    const ls = localStorage;
    const ss = sessionStorage;

    //console.log(ls.length, ss.length);

    if (ls.length === 0) {
      ss.clear();
    }
    
    //if (localStorage.length > 0) this.router.navigate(['/plataformas/home']);
    //return ls.length === 0 ? true : false;
    if (ls.length === 0) {
      return true;
    } else {
      this.router.navigate(['/plataformas/home']);
      return false;
    }
  }

}
