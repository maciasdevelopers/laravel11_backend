import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LenguajesService {
  lenguajesSoportados = ['es','en'];
  lenguajePorDefecto = 'es';
  constructor(private translate:TranslateService) {}

  getLenguaje(){
    const lenguajeUsuario:any = this.translate.getBrowserLang();
    return this.lenguajesSoportados.includes(lenguajeUsuario) ? lenguajeUsuario : this.lenguajePorDefecto;
  }

}
