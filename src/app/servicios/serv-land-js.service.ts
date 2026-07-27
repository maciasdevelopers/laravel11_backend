import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
//import { InterfServicios } from '../../interfaces/intef-servicios'; 
import { global } from './global_ssic'
import { Usuarios } from '../modelos/Usuarios';
import { servicioAngularModelo } from '../modelos/servicioAngularModelo';
import { fileAngularModelo } from '../modelos/fileAngularModelo';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ServLandJSService {
  public url: string;
  public user:any;
  httpOptions = {
    Headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(
    private _httpClient: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { 
    this.url = global.urlApi;
    //this.user = sessionStorage.getItem('inside_session_code');
    this.user = isPlatformBrowser(this.platformId) ? sessionStorage.getItem('inside_session_code') : null;
  }

  cargaArchJs(archivos:string[]){
    for (let cssArch of archivos) {
      let jsscript = document.createElement("script"); 
      jsscript.src = "./assets/js/"+cssArch+".js";
      let head = document.getElementById("bodyIndex");
      head?.appendChild(jsscript);
    }
  }
}
