import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Usuarios } from '../modelos/Usuarios';
import { global } from './global_ssic';
import Swal from "sweetalert2";
import { TranslateService } from '@ngx-translate/core';
import { Router,ActivatedRoute } from '@angular/router';
import { Idle, NotIdle } from 'idlejs';

@Injectable({
  providedIn: 'root'
})
export class CargaPaginaService {

  options = {};

  httpOptions = {
    Headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor() {
  }

  prueba(){
    return "Hola Mundo";
  }

  comienza_contador_carga():void{
    var porcentajeCarga = 0;
    //alert("cargando");h
    var intervalo = setInterval(() => {
      porcentajeCarga = porcentajeCarga +1;
      var porcentDiv = porcentajeCarga+'%';
      $(".h6loadingSeccion").html('cargando... '+porcentDiv);
      if (porcentajeCarga == 100) {
        clearInterval(intervalo);
        $("#vContent").removeClass("noneView");
        setTimeout(function(){
          $("#loadingSeccion").fadeOut("slow");
        },3000);
      }
    },30);
  }
}
