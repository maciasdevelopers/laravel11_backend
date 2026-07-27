import { Component, OnInit, ElementRef, Renderer2, ViewChild, ViewEncapsulation, Input } from "@angular/core";
import { Usuarios } from "../../../../../modelos/Usuarios";
import { global } from "../../../../../servicios/global_ssic"; 

import { HttpCancelService } from "../../../../../servicios/ssic/http-cancel.service";
import { ClientesService } from "../../../../../servicios/ssic/clientes.service";

import { InterfPais } from "../../../../../interfaces/interf-pais";
import { PaisService } from "../../../../../servicios/ssic/pais.service";
import { DireccionesService } from "../../../../../servicios/ssic/direcciones.service";

import { InterfMonedas } from "../../../../../interfaces/interf-monedas";
import { MonedasService } from "../../../../../servicios/monedas.service";

import { InterfPagoForma } from "../../../../../interfaces/interf-pago-forma";
import { FormaPagoService } from "../../../../../servicios/ssic/forma-pago.service";

import { MetodoPagoServService } from "../../../../../servicios/ssic/metodo-pago-serv.service";
import { InterfMetodoPago } from "../../../../../interfaces/interf-metodo-pago";

import { ValidatorServService } from "../../../../../servicios/validator-serv.service";
import { ServEncryptService } from "../../../../../servicios/ssic/serv-encrypt.service";
import { TranslateService } from "@ngx-translate/core";

import { passwordsAngularModelo } from "../../../../../modelos/passwordsAngularModelo";

import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from "ngx-file-drop";
import { fromEvent, Subscription, interval, timer, take, of } from "rxjs";
import Swal from "sweetalert2";
import emailjs from "@emailjs/browser";
import { Router } from "@angular/router";
import { DomSanitizer } from "@angular/platform-browser";
import numeral from 'numeral';
import { Html5QrcodeScanner } from "html5-qrcode";
// To use Html5Qrcode (more info below)
import { Html5Qrcode } from "html5-qrcode";

@Component({
  selector: 'app-interno-ingresos-catalogos',
  templateUrl: './politicas_home.component.html',
  standalone:false,
  styleUrls: [
    '../../../../../styles/listas_ps.css',
    '../../../../../styles/datatable.css',
    '../../../../../styles/datatable.css',
    '../../../../../styles/tabs.css',
    '../../../../../styles/input_group.css',
    '../../../../../styles/buttons.css',
    '../../../../../styles/modals.css',
    '../../../../../styles/cabecera.css',
    '../../../../../styles/clientes.css',
    '../../../../../styles/collapsible.css',
    '../../../../../styles/encabezados.css',
    '../../../../../styles/buscador.css',
    '../../../../../styles/radioButtons.css',
    '../../../../../styles/paginador.css',
    '../../../../../styles/breadcrumb.css',
    '../../../../../styles/dropdown.css',
    '../../../../../styles/canvas.css',
    '../../contabilidad.css',
    './politicas_home.component.css'
  ]
})

export class ContabilidadPoliticasHomeComponent implements OnInit {
  options = {};
  public usuario: Usuarios;

  constructor(
    public renderer: Renderer2,
    public _fpago: FormaPagoService,
    public _metPago: MetodoPagoServService,
    private routerr: Router,
    private translate: TranslateService,
    private validator: ValidatorServService,
    private encryptor: ServEncryptService,
    private httpCancelServ: HttpCancelService,
    private sanitizer: DomSanitizer,
  ) {
    this.usuario = new Usuarios(1,"","","","","","","",1,1,"","","","");
  }

  ngOnInit(): void {
    var porcentajeCarga = 0;
    var intervalo = setInterval(() => {
      porcentajeCarga = porcentajeCarga + 1;
      var porcentDiv = porcentajeCarga + '%';
      $(".h6loadingBlue").html('cargando... ' + porcentDiv);
      if (porcentajeCarga == 100) {
        clearInterval(intervalo);
        $("#iContent").removeClass("noneView");
        setTimeout(function () {
          $("#loadingSeccion").fadeOut("slow");
        }, 3000);
      }
    }, 30);

    //this.dataTableServ.cargaDatatable("#cont_table_politics_comi");
    //this.dataTableServ.cargaDatatable("#cont_table_politics_reem");
    //this.dataTableServ.cargaDatatable("#cont_table_politics_just");
    //this.dataTableServ.cargaDatatable("#cont_table_politics_prov");

    //this.recarga_tablas_data();
  }

  recarga_tablas_comi_data(){
    var segundos_comi = 0;
    var interval_comi = setInterval(() => {
      segundos_comi = segundos_comi+1;
      if (segundos_comi == 10) {
        clearInterval(interval_comi);
        segundos_comi = 0;
      }
    },5);
  }


  recarga_tablas_reem_data(){
    var segundos_reem = 0;
    var interval_reem = setInterval(() => {
      segundos_reem = segundos_reem+1;
      if (segundos_reem == 10) {
        clearInterval(interval_reem);
        segundos_reem = 0;
      }
    },5);
  }

  recarga_tablas_just_data(){
    var segundos_just = 0;
    var interval_just = setInterval(() => {
      segundos_just = segundos_just+1;
      if (segundos_just == 10) {
        clearInterval(interval_just);
        segundos_just = 0;
      }
    },5);
  }

  recarga_tablas_prov_data(){
    var segundos_prov = 0;
    var interval_prov = setInterval(() => {
      segundos_prov = segundos_prov+1;
      if (segundos_prov == 10) {
        clearInterval(interval_prov);
        segundos_prov = 0;
      }
    },5);
  }

}
