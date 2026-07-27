import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderServService {
  isLoading$ = new Subject<boolean>();
  constructor() { }

  mostrar():void{
    this.isLoading$.next(true);
  }

  desaparecer():void{
    this.isLoading$.next(false);
  }
}
