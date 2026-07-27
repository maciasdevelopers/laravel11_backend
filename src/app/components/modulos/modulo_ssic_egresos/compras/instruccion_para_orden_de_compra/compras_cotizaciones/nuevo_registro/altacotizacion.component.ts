import { Component, OnInit, ElementRef, Renderer2, ViewChild, Input } from '@angular/core';
import { Usuarios } from '../../../../../../../modelos/Usuarios';
import { RequisicionesService } from '../../../../../../../servicios/ssic/requisiciones.service';
import { SentinelArkManager } from '../../../../../../../servicios/sentinel-ark-manager';
import { UniMedServService } from '../../../../../../../servicios/uni-med-serv.service';
import { CotizacionesService } from '../../../../../../../servicios/ssic/cotizaciones.service';
import { MonedasService } from '../../../../../../../servicios/monedas.service';
import { ProveedoresService } from '../../../../../../../servicios/proveedores.service';
import { InterfPagoForma } from '../../../../../../../interfaces/interf-pago-forma';
import { FormaPagoService } from '../../../../../../../servicios/ssic/forma-pago.service';
import { MetodoPagoServService } from '../../../../../../../servicios/ssic/metodo-pago-serv.service';
import { InterfMetodoPago } from '../../../../../../../interfaces/interf-metodo-pago';
import Swal from 'sweetalert2';
import { ValidatorServService } from '../../../../../../../servicios/validator-serv.service';
//<qrcode [qrdata]="'Tu cadena de datos'" [width]="256" [errorCorrectionLevel]="'M'"></qrcode> imports QRCodeComponent,
import numeral from 'numeral';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { SessionContextService } from '../../../../../../../servicios/session-context';

@Component({
  selector: 'app_interno_egresos_compras_cotizacion_registro',
  templateUrl: './altacotizacion.component.html',
  standalone: false,
  styleUrls: [
    '../../../../../../../styles/cards.css',
    '../../../../../../../styles/colores.css',
    '../../../../../../../styles/switches.css',
    '../../../../../../../styles/listas_ps.css',
    '../../../../../../../styles/tabs.css',
    '../../../../../../../styles/datatable.css',
    '../../../../../../../styles/input_group.css',
    '../../../../../../../styles/buttons.css',
    '../../../../../../../styles/modals.css',
    '../../../../../../../styles/clientes.css',
    '../../../../../../../styles/collapsible.css',
    '../../../../../../../styles/pushpin.css',
    '../../../../../../../styles/collection.css',
    '../../../../../../../styles/row.css',
    '../../../../../../../styles/encabezados.css',
    '../../../../../../../styles/buscador.css',
    '../../../../../../../styles/radioButtons.css',
    '../../../../../../../styles/paginador.css',
    '../../../../../../../styles/cabecera.css',
    '../../../../../../../styles/loading.css',
    '../../../../../../../styles/navegador.css',
    '../../../../../../../styles/listas_ps.css',
    '../../../../../../../styles/landing.css',
    '../../../../../../../styles/colores.css',
    '../../../../../../../styles/explain.css',
    '../../../../../../../styles/contraccion.css',
    '../../../../egresos.css',
    './altacotizacion.component.css'],
  //providers: [RequisicionesService,LoginService]
})
export class AltaCotizacionComponent implements OnInit {
  public usuario: Usuarios;
  public identidad: any;
  lista_proveedores: any = [];
  lista_proveedor_seleccionado: any = [];
  lista_proveedor_select_mejor_opcion: any = [];
  searchProv: any;
  pageProv: number = 1;
  pageCotizacion: number = 1;
  public verCotiSoliList: boolean = false;
  cotiSolicitudes: any = [];
  solicitudCotizacionModal: any = [];
  reqDetalle: any = [];
  catalogo_monedas_api: any = [];
  lista_unidad_medida: any = [];
  lista_forma_pago: InterfPagoForma[] = [];
  lista_metodo_pago: InterfMetodoPago[] = [];
  public valida_cotizacion_completa: boolean = false;
  public emp_moneda_code: string = "";
  public emp_moneda_decimales: string = "";

  registroSelectedDocs: string = "";
  registroSelectedCotizaciones: string = "";

  @ViewChild('btnaddRegCompra') btnaddRegCompra: ElementRef = {} as ElementRef;
  optionTool = { "placement": "top", "showDelay": "500" };
  public bool_compress_proveedores: boolean = false;

  url_activa: string = "";

  constructor(
    private validator: ValidatorServService,
    private _reqService: RequisicionesService,
    private _medidasCat: UniMedServService,
    private _cotService: CotizacionesService,
    private _monedasServ: MonedasService,
    private _provServ: ProveedoresService,
    private sentinela: SentinelArkManager,
    private _fpago: FormaPagoService,
    private _mPago: MetodoPagoServService,
    private translate: TranslateService,
    private sessionContext: SessionContextService,
    private router: Router) {
    this.usuario = new Usuarios(1, "", "", "", "", "", "", "", 1, 1, "", "", "", "");
    this.identidad = this.sentinela.getIdentifUsuario();
  }

  ngOnInit(): void {
    //this.loadPageServ.comienza_contador_carga();
    this.url_activa = this.router.url;
    this.monedas_lista();
    this.unidad_medida();
    this.listFormaPago();
    this.listMetodoPago();
    this.proveedores_lista();
    this.cotizaciones_solicitudes();

    this.emp_moneda_code = this.sessionContext.empresa_data?.e_moneda_code;
    this.emp_moneda_decimales = this.sessionContext.empresa_data?.e_moneda_decimales;
    console.log(this.emp_moneda_code + " " + this.emp_moneda_decimales);
  }

  public paginarData(array: any[]): any[] {
    const inicio = (this.pageCotizacion - 1) * 10;
    const fin = inicio + 10;
    return array.slice(inicio, fin);
  }

  cambiaPagina(event: any, token_solicitud: any) {
    const index_soli = this.solicitudCotizacionModal.findIndex((row: any) => row.token_solicitud_cotizacion == token_solicitud);
    const principia = event.first;
    const registros = event.rows;
    this.solicitudCotizacionModal[index_soli]["deglose_pag"] = this.solicitudCotizacionModal[index_soli]["deglose"].slice(principia, principia + registros);
  }

  cerrarModal(modal: any) {
    $(modal).removeClass("open");
  }

  get permiso_crear() {
    return this.sessionContext.privilegio_crear;
  }

  monedas_lista() {
    this._monedasServ.getApiMonedasCatalogo().subscribe(
      response => {
        if (response.status == 'success') {
          this.catalogo_monedas_api = response.monedas;
          console.log(this.catalogo_monedas_api);
        }
      }
    )
  }

  unidad_medida() {
    this._medidasCat.getApiUniMedCatalogo().subscribe(
      response => {
        if (response.status == 'success') {
          //console.log(response.listMedidas);
          this.lista_unidad_medida = response.unidades_medida;
          console.log(this.lista_unidad_medida);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  listFormaPago() {
    this._fpago.getformapago().subscribe((data: InterfPagoForma[]) => {
      this.lista_forma_pago = data;
      console.log(this.lista_forma_pago);
    })
  }

  listMetodoPago() {
    this._mPago.getMetodo().subscribe((data: InterfMetodoPago[]) => {
      this.lista_metodo_pago = data;
      console.log(this.lista_metodo_pago);
    });
  }

  proveedores_lista() {
    this._provServ.catalogo_prov_autorizados().subscribe(
      response => {
        if (response.status == 'success') {
          response.listado.sort((a: any, b: any) => a.nombre.localeCompare(b.nombre));
          this.lista_proveedores = response.listado;
          console.log(this.lista_proveedores);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  cotizaciones_solicitudes() {
    this.verCotiSoliList = false;
    this._cotService.cotiSolicitudes().subscribe(
      response => {
        if (response.status == 'success') {
          this.verCotiSoliList = true;
          this.cotiSolicitudes = response.solicitudes;
          console.log(this.cotiSolicitudes);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  abre_solicitud(token_solicitud: any) {
    this.bool_compress_proveedores = false;
    this.solicitudCotizacionModal = [];
    for (let i = 0; i < this.cotiSolicitudes.length; i++) {
      const soli = this.cotiSolicitudes[i];
      if (soli["token_solicitud_cotizacion"] == token_solicitud) {
        soli["desglose_pag"] = soli["desglose"].slice(0, 10);
        this.solicitudCotizacionModal.push(soli);
        soli["abierto"] = true;
        var soli_cot_prov_cat: any = document.getElementById("soli_cot_prov_cat");
        var soli_cot_registros: any = document.getElementById("soli_cot_registros");
        soli_cot_prov_cat.classList.remove('minimized');
        soli_cot_registros.classList.remove('expanded');
        soli_cot_prov_cat.classList.add('col-12', 'col-sm-4', 'col-md-4', 'col-lg-3', 'col-xl-3', 'col-xxl-3');
        soli_cot_registros.classList.add('col-12', 'col-sm-8', 'col-md-8', 'col-lg-9', 'col-xl-9', 'col-xxl-9');
      }
    }
  }

  miniMizaCtalogosProv() {
    this.bool_compress_proveedores = this.bool_compress_proveedores == false ? true : false;
    var soli_cot_prov_cat: any = document.getElementById("soli_cot_prov_cat");
    var soli_cot_registros: any = document.getElementById("soli_cot_registros");

    if (soli_cot_prov_cat.classList.contains('minimized')) {
      soli_cot_prov_cat.classList.remove('minimized');
      soli_cot_registros.classList.remove('expanded');
      soli_cot_prov_cat.classList.add('col-12', 'col-sm-4', 'col-md-4', 'col-lg-3', 'col-xl-3', 'col-xxl-3');
      soli_cot_registros.classList.add('col-12', 'col-sm-8', 'col-md-8', 'col-lg-9', 'col-xl-9', 'col-xxl-9');
    } else {
      soli_cot_prov_cat.classList.add('minimized');
      soli_cot_registros.classList.add('expanded');
      soli_cot_prov_cat.classList.remove('col-12', 'col-sm-4', 'col-md-4', 'col-lg-3', 'col-xl-3', 'col-xxl-3');
      soli_cot_registros.classList.remove('col-12', 'col-sm-8', 'col-md-8', 'col-lg-9', 'col-xl-9', 'col-xxl-9');
    }
  }

  openRequiDetail(token_requisicion: any) {
    this._reqService.detalleRequisicion(token_requisicion).subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response);
          this.reqDetalle = response.desglose_true;
        }
        if (response.status == 'error') {
          let translate_response = this.translate.instant(response.message);
          Swal.fire({
            position: 'top-end',
            icon: 'warning',
            title: translate_response,
            showConfirmButton: false,
            timer: 3000
          })
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  viewDocumento(event: any) {
    window.open(event.value, '_blank');
  }

  selecciona_proveedor(event: any) {
    for (let a = 0; a < this.lista_proveedores.length; a++) {
      const row = this.lista_proveedores[a];
      console.log(event.checked);
      if (event.checked == true) {
        if (row["token_cat_proveedores"] == event.value) {
          row["encendido"] = true;
          this.lista_proveedor_seleccionado.push({
            "token_cat_proveedores": row["token_cat_proveedores"],
            "nombre": row["nombre"],
            "especificaciones": "",
            "cantidad": "",
            "precio": "",
            "moneda": this.emp_moneda_code,
            "tipo_cambio": "1.00",
            "conversion": "",
            "calidad": "",
            "servicio": "",
            "entrega_tipo": "",
            "entrega_tiempo": "",
            "descuento": "",
            "retenciones": "0.00",
            "traslados": "0.00",
            "credito_otorga": false,
            "credito_time": "",
            "garantia": "",
            "unidad_medida": "",
            "forma_pago": "",
            "valoracion": "",
            "selected": false
          });

          this.lista_proveedor_select_mejor_opcion.push({
            "token_cat_proveedores": row["token_cat_proveedores"],
            "name": row["nombre"],
            "posicion": "",
            "selected_observaciones": ""
          });
          //for (let i = 0; i < this.cotiSolicitudes.length; i++) {
          //  const soli = this.cotiSolicitudes[i];
          //  for (let b = 0; b < soli["desglose"].length; b++) {
          //    const desg = soli["desglose"][b];
          //    if (desg["open_desglose"] == true) {
          //      new DataTable("#tableReq_coti_"+soli["folio_registro"]+desg["num_lista"]).destroy();
          //    }
          //  }
          //}

        }
      } else {
        for (let b = 0; b < this.lista_proveedor_seleccionado.length; b++) {
          const select = this.lista_proveedor_seleccionado[b];
          if (select["token_cat_proveedores"] == event.value) {
            row["encendido"] = false;
            this.lista_proveedor_seleccionado.splice(b, 1);
            this.lista_proveedor_select_mejor_opcion.splice(b, 1);
          }
        }
      }
    }
    console.log(this.lista_proveedor_seleccionado);
    if (this.lista_proveedor_seleccionado.length < 3) {
      for (let i = 0; i < this.cotiSolicitudes.length; i++) {
        const soli = this.cotiSolicitudes[i];
        for (let b = 0; b < soli["desglose"].length; b++) {
          const desg = soli["desglose"][b];
          desg["open_desglose"] = false;
          $("#card_coti_" + soli["folio_registro"] + desg["num_lista"] + "_desglose").addClass("noneView");
          $("#card_coti_" + soli["folio_registro"] + desg["num_lista"]).removeClass("card_cotizacion_abierto");
        }
      }
    }
  }

  verDesglose(data: any, token_solicitud: any, token_detalle_requisicion: any) {
    this.registroSelectedCotizaciones = this.registroSelectedCotizaciones === data ? null : data;
    this.registroSelectedCotizaciones === data ? this.abre_desglose(token_solicitud, token_detalle_requisicion) : this.cierra_desglose(token_solicitud, token_detalle_requisicion);
  }

  verDocs(data: any) {
    this.registroSelectedDocs = this.registroSelectedDocs === data ? null : data;
  }

  abre_desglose(token_solicitud: any, token_detalle_requisicion: any) {
    for (let i = 0; i < this.cotiSolicitudes.length; i++) {
      const soli = this.cotiSolicitudes[i];
      if (soli["token_solicitud_cotizacion"] == token_solicitud) {
        for (let b = 0; b < soli["desglose"].length; b++) {
          const desg = soli["desglose"][b];
          if (desg["token_detalle_requisicion"] == token_detalle_requisicion) {
            desg["open_desglose"] = true;
            //$(card_main).addClass("card_cotizacion_abierto");
            //$(card_desglose).removeClass("noneView");
            desg["proveedores"] = this.lista_proveedor_seleccionado;
            desg["proveedores_mejor_opcion"] = this.lista_proveedor_select_mejor_opcion;
            ////
          } else {
            desg["open_desglose"] = false;
            $("#card_coti_" + soli["folio_registro"] + desg["num_lista"] + "_desglose").addClass("noneView");
            $("#card_coti_" + soli["folio_registro"] + desg["num_lista"]).removeClass("card_cotizacion_abierto");
          }
        }
      }
    }
  }

  cierra_desglose(token_solicitud: any, token_detalle_requisicion: any) {
    for (let i = 0; i < this.cotiSolicitudes.length; i++) {
      const soli = this.cotiSolicitudes[i];
      if (soli["token_solicitud_cotizacion"] == token_solicitud) {
        for (let b = 0; b < soli["desglose"].length; b++) {
          const desg = soli["desglose"][b];
          if (desg["token_detalle_requisicion"] == token_detalle_requisicion) {
            desg["open_desglose"] = false;
            //$(card_desglose).addClass("noneView");
            //$(card_main).removeClass("card_cotizacion_abierto");
          }
        }
      }
    }
  }

  onKeyPressNumbers(e: KeyboardEvent) {
    this.validator.key_press_numbers(e);
  }

  onKeyPressAlfa(e: KeyboardEvent) {
    this.validator.key_press_alfa(e);
  }

  validaMoreNuevaclaveCotizacion(event: any, token_solicitud: any, token_detalle_requisicion: any) {
    for (let a = 0; a < this.cotiSolicitudes.length; a++) {
      const soli = this.cotiSolicitudes[a];
      if (soli["token_solicitud_cotizacion"] == token_solicitud) {
        for (let b = 0; b < soli["desglose"].length; b++) {
          const desg = soli["desglose"][b];
          if (desg["token_detalle_requisicion"] == token_detalle_requisicion) {
            if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
              desg["nueva_clave_nombre"] = event.value;
              this.validator.correctoInputRow(event);
            } else {
              desg["nueva_clave_nombre"] = "";
              this.validator.errorInputRow(event);
            }
          }
        }
      }
    }
  }

  addMoreCotizacion(token_solicitud: any, token_detalle_requisicion: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        for (let a = 0; a < this.cotiSolicitudes.length; a++) {
          const soli = this.cotiSolicitudes[a];
          if (soli["token_solicitud_cotizacion"] == token_solicitud) {
            for (let b = 0; b < soli["desglose"].length; b++) {
              const desg = soli["desglose"][b];
              if (desg["token_detalle_requisicion"] == token_detalle_requisicion) {
                var array_interno = [];
                for (let p = 0; p < desg["proveedores"].length; p++) {
                  const prv = desg["proveedores"][p];
                  array_interno.push({ "token_cat_proveedores": prv["token_cat_proveedores"], "valor": "" });
                }
                desg["adicionales"].push({ "clave": desg["nueva_clave_nombre"], "proveedores": array_interno });
                desg["nueva_clave_nombre"] = "";
                console.log(desg["adicionales"]);
              }
            }
          }
        }

        this.validacion_total_cotizacion(token_solicitud, token_detalle_requisicion);
      }
    })
  }

  validaMoreNuevoValorCotizacion(event: any, token_solicitud: any, token_detalle_requisicion: any, clave: any, proveedor: any) {
    for (let a = 0; a < this.cotiSolicitudes.length; a++) {
      const soli = this.cotiSolicitudes[a];
      if (soli["token_solicitud_cotizacion"] == token_solicitud) {
        for (let b = 0; b < soli["desglose"].length; b++) {
          const desg = soli["desglose"][b];
          if (desg["token_detalle_requisicion"] == token_detalle_requisicion) {
            for (let m = 0; m < desg["adicionales"].length; m++) {
              const more = desg["adicionales"][m];
              if (more["clave"] == clave) {
                for (let p = 0; p < more["proveedores"].length; p++) {
                  const prv = more["proveedores"][p];
                  if (prv["token_cat_proveedores"] == proveedor) {
                    if (event.innerText != "" && this.validator.filtroAlfaNumerico(event.innerText) == true) {
                      prv["valor"] = event.innerText;
                      this.validator.correctoTD(event);
                    } else {
                      prv["valor"] = "";
                      this.validator.errorTD(event);
                    }
                  }
                }
              }
            }
            console.log(desg["adicionales"]);
          }
        }
      }
    }
    this.validacion_total_cotizacion(token_solicitud, token_detalle_requisicion);
  }

  validaEspecificacionesCotizacion(event: any, token_solicitud: any, token_detalle_requisicion: any, proveedor: any) {
    for (let a = 0; a < this.cotiSolicitudes.length; a++) {
      const soli = this.cotiSolicitudes[a];
      if (soli["token_solicitud_cotizacion"] == token_solicitud) {
        for (let b = 0; b < soli["desglose"].length; b++) {
          const desg = soli["desglose"][b];
          if (desg["token_detalle_requisicion"] == token_detalle_requisicion) {
            for (let p = 0; p < desg["proveedores"].length; p++) {
              const prv = desg["proveedores"][p];
              if (prv["token_cat_proveedores"] == proveedor) {
                if (event.innerText != "" && this.validator.filtroAlfaNumerico(event.innerText) == true) {
                  prv["especificaciones"] = event.innerText;
                  this.validator.correctoTD(event);
                } else {
                  prv["especificaciones"] = "";
                  this.validator.errorTD(event);
                }
              }
            }
            const arreglo_vacio = desg["proveedores"].filter((row: any) => row.length == 0);
            console.log(arreglo_vacio);
          }
        }
      }
    }
    this.validacion_total_cotizacion(token_solicitud, token_detalle_requisicion);
  }

  validaCantidadCotizacion(event: any, valor: any, token_solicitud: any, token_detalle_requisicion: any, proveedor: any) {
    for (let a = 0; a < this.cotiSolicitudes.length; a++) {
      const soli = this.cotiSolicitudes[a];
      if (soli["token_solicitud_cotizacion"] == token_solicitud) {
        for (let b = 0; b < soli["desglose"].length; b++) {
          const desg = soli["desglose"][b];
          if (desg["token_detalle_requisicion"] == token_detalle_requisicion) {
            for (let p = 0; p < desg["proveedores"].length; p++) {
              const prv = desg["proveedores"][p];
              if (prv["token_cat_proveedores"] == proveedor) {
                if (valor.innerText != "" && this.validator.filtroNum(valor.innerText) == true) {
                  prv["cantidad"] = valor.innerText;
                  this.validator.correctoTD(valor);
                } else {
                  event.preventDefault();
                  prv["cantidad"] = "";
                  this.validator.errorTD(valor);
                }
              }
            }
            const arreglo_vacio = desg["proveedores"].filter((row: any) => row.length == 0);
            console.log(arreglo_vacio);
          }
        }
      }
    }
    this.validacion_total_cotizacion(token_solicitud, token_detalle_requisicion);
  }

  validaPrecioCotizacion(event: any, token_solicitud: any, token_detalle_requisicion: any, proveedor: any) {
    for (let a = 0; a < this.cotiSolicitudes.length; a++) {
      const soli = this.cotiSolicitudes[a];
      if (soli["token_solicitud_cotizacion"] == token_solicitud) {
        for (let b = 0; b < soli["desglose"].length; b++) {
          const desg = soli["desglose"][b];
          if (desg["token_detalle_requisicion"] == token_detalle_requisicion) {
            for (let p = 0; p < desg["proveedores"].length; p++) {
              const prv = desg["proveedores"][p];
              if (prv["token_cat_proveedores"] == proveedor) {
                if (event.innerText != "" && this.validator.filtroNum(event.innerText) == true) {
                  prv["precio"] = event.innerText;
                  this.validator.correctoTD(event);
                } else {
                  prv["precio"] = "";
                  this.validator.errorTD(event);
                }
                this.extraeImporteTC(token_solicitud, token_detalle_requisicion, proveedor);
              }
            }
            const arreglo_vacio = desg["proveedores"].filter((row: any) => row.length == 0);
            console.log(arreglo_vacio);
          }
        }
      }
    }
    this.validacion_total_cotizacion(token_solicitud, token_detalle_requisicion);
  }

  validaMonedaCotizacion(event: any, token_solicitud: any, token_detalle_requisicion: any, proveedor: any) {
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value);

    console.log(event.value);
    for (let a = 0; a < this.cotiSolicitudes.length; a++) {
      const soli = this.cotiSolicitudes[a];
      if (soli["token_solicitud_cotizacion"] == token_solicitud) {
        for (let b = 0; b < soli["desglose"].length; b++) {
          const desg = soli["desglose"][b];
          if (desg["token_detalle_requisicion"] == token_detalle_requisicion) {
            for (let p = 0; p < desg["proveedores"].length; p++) {
              const prv = desg["proveedores"][p];
              if (prv["token_cat_proveedores"] == proveedor) {

                const index_mnd = this.catalogo_monedas_api.findIndex((row: any) => row.langEN === event.value);
                const desglose_mnd = this.catalogo_monedas_api[index_mnd];
                console.log(desglose_mnd["code"] + " " + this.emp_moneda_code);
                prv["moneda"] = validacion ? desglose_mnd["code"] : '';
                if (validacion && desglose_mnd["code"] == this.emp_moneda_code) {
                  prv["tipo_cambio"] = "1." + "0".repeat(parseInt(this.emp_moneda_decimales));
                } else if (validacion && desglose_mnd["code"] != this.emp_moneda_code) {
                  prv["tipo_cambio"] = "0." + "0".repeat(parseInt(desglose_mnd["decimales"]));
                } else {
                  prv["tipo_cambio"] = "0." + "0".repeat(parseInt(desglose_mnd["decimales"]));
                }
              }
            }
            const arreglo_vacio = desg["proveedores"].filter((row: any) => row.length == 0);
            console.log(arreglo_vacio);
          }
        }
      }
    }
    this.validacion_total_cotizacion(token_solicitud, token_detalle_requisicion);
  }

  validaTipoCambioCotizacion(event: any, token_solicitud: any, token_detalle_requisicion: any, proveedor: any) {
    for (let a = 0; a < this.cotiSolicitudes.length; a++) {
      const soli = this.cotiSolicitudes[a];
      if (soli["token_solicitud_cotizacion"] == token_solicitud) {
        for (let b = 0; b < soli["desglose"].length; b++) {
          const desg = soli["desglose"][b];
          if (desg["token_detalle_requisicion"] == token_detalle_requisicion) {
            for (let p = 0; p < desg["proveedores"].length; p++) {
              const prv = desg["proveedores"][p];
              if (prv["token_cat_proveedores"] == proveedor) {
                if (event.innerText != "" && this.validator.filtroNum(event.innerText) == true) {
                  prv["tipo_cambio"] = event.innerText;
                  this.validator.correctoTD(event);
                } else {
                  prv["tipo_cambio"] = "";
                  this.validator.errorTD(event);
                }
                this.extraeImporteTC(token_solicitud, token_detalle_requisicion, proveedor);
              }
            }
            const arreglo_vacio = desg["proveedores"].filter((row: any) => row.length == 0);
            console.log(arreglo_vacio);
          }
        }
      }
    }
    this.validacion_total_cotizacion(token_solicitud, token_detalle_requisicion);
  }

  extraeImporteTC(token_solicitud: any, token_detalle_requisicion: any, proveedor: any) {
    var decim_string = "";
    for (let i = 0; i < parseInt(this.emp_moneda_decimales); i++) { decim_string = decim_string + "0"; }
    //console.log(decim_string);
    for (let a = 0; a < this.cotiSolicitudes.length; a++) {
      const soli = this.cotiSolicitudes[a];
      if (soli["token_solicitud_cotizacion"] == token_solicitud) {
        for (let b = 0; b < soli["desglose"].length; b++) {
          const desg = soli["desglose"][b];
          if (desg["token_detalle_requisicion"] == token_detalle_requisicion) {
            for (let p = 0; p < desg["proveedores"].length; p++) {
              const prv = desg["proveedores"][p];
              if (prv["token_cat_proveedores"] == proveedor) {
                if (prv["moneda"] == this.emp_moneda_code) {
                  var resultando = parseFloat(prv["precio"]) * 1;
                  prv["conversion"] = numeral(resultando).format('$0,0.' + decim_string);
                } else {
                  var resultando = parseFloat(prv["precio"]) * parseFloat(prv["tipo_cambio"]);
                  prv["conversion"] = numeral(resultando).format('$0,0.' + decim_string);
                }
              }
            }
          }
        }
      }
    }
  }

  validaCalidadCotizacion(event: any, token_solicitud: any, token_detalle_requisicion: any, proveedor: any) {
    for (let a = 0; a < this.cotiSolicitudes.length; a++) {
      const soli = this.cotiSolicitudes[a];
      if (soli["token_solicitud_cotizacion"] == token_solicitud) {
        for (let b = 0; b < soli["desglose"].length; b++) {
          const desg = soli["desglose"][b];
          if (desg["token_detalle_requisicion"] == token_detalle_requisicion) {
            for (let p = 0; p < desg["proveedores"].length; p++) {
              const prv = desg["proveedores"][p];
              if (prv["token_cat_proveedores"] == proveedor) {
                if (event.innerText != "" && this.validator.filtroAlfaNumerico(event.innerText) == true) {
                  prv["calidad"] = event.innerText;
                  this.validator.correctoTD(event);
                } else {
                  prv["calidad"] = "";
                  this.validator.errorTD(event);
                }
              }
            }
            const arreglo_vacio = desg["proveedores"].filter((row: any) => row.length == 0);
            console.log(arreglo_vacio);
          }
        }
      }
    }
    this.validacion_total_cotizacion(token_solicitud, token_detalle_requisicion);
  }

  validaServicioCotizacion(event: any, token_solicitud: any, token_detalle_requisicion: any, proveedor: any) {
    for (let a = 0; a < this.cotiSolicitudes.length; a++) {
      const soli = this.cotiSolicitudes[a];
      if (soli["token_solicitud_cotizacion"] == token_solicitud) {
        for (let b = 0; b < soli["desglose"].length; b++) {
          const desg = soli["desglose"][b];
          if (desg["token_detalle_requisicion"] == token_detalle_requisicion) {
            for (let p = 0; p < desg["proveedores"].length; p++) {
              const prv = desg["proveedores"][p];
              if (prv["token_cat_proveedores"] == proveedor) {
                if (event.innerText != "" && this.validator.filtroAlfaNumerico(event.innerText) == true) {
                  prv["servicio"] = event.innerText;
                  this.validator.correctoTD(event);
                } else {
                  prv["servicio"] = "";
                  this.validator.errorTD(event);
                }
              }
            }
            const arreglo_vacio = desg["proveedores"].filter((row: any) => row.length == 0);
            console.log(arreglo_vacio);
          }
        }
      }
    }
    this.validacion_total_cotizacion(token_solicitud, token_detalle_requisicion);
  }

  validaTypoEntregaCotizacion(event: any, token_solicitud: any, token_detalle_requisicion: any, proveedor: any) {
    for (let a = 0; a < this.cotiSolicitudes.length; a++) {
      const soli = this.cotiSolicitudes[a];
      if (soli["token_solicitud_cotizacion"] == token_solicitud) {
        for (let b = 0; b < soli["desglose"].length; b++) {
          const desg = soli["desglose"][b];
          if (desg["token_detalle_requisicion"] == token_detalle_requisicion) {
            for (let p = 0; p < desg["proveedores"].length; p++) {
              const prv = desg["proveedores"][p];
              if (prv["token_cat_proveedores"] == proveedor) {
                if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
                  prv["entrega_tipo"] = event.value;
                  this.validator.correctoTD(event);
                } else {
                  prv["entrega_tipo"] = "";
                  this.validator.errorTD(event);
                }
              }
            }
            const arreglo_vacio = desg["proveedores"].filter((row: any) => row.length == 0);
            console.log(arreglo_vacio);
          }
        }
      }
    }
    this.validacion_total_cotizacion(token_solicitud, token_detalle_requisicion);
  }

  validaTiempoEntregaCotizacion(event: any, token_solicitud: any, token_detalle_requisicion: any, proveedor: any) {
    for (let a = 0; a < this.cotiSolicitudes.length; a++) {
      const soli = this.cotiSolicitudes[a];
      if (soli["token_solicitud_cotizacion"] == token_solicitud) {
        for (let b = 0; b < soli["desglose"].length; b++) {
          const desg = soli["desglose"][b];
          if (desg["token_detalle_requisicion"] == token_detalle_requisicion) {
            for (let p = 0; p < desg["proveedores"].length; p++) {
              const prv = desg["proveedores"][p];
              if (prv["token_cat_proveedores"] == proveedor) {
                if (event.innerText != "" && this.validator.filtroAlfaNumerico(event.innerText) == true) {
                  prv["entrega_tiempo"] = event.innerText;
                  this.validator.correctoTD(event);
                } else {
                  prv["entrega_tiempo"] = "";
                  this.validator.errorTD(event);
                }
              }
            }
            const arreglo_vacio = desg["proveedores"].filter((row: any) => row.length == 0);
            console.log(arreglo_vacio);
          }
        }
      }
    }
    this.validacion_total_cotizacion(token_solicitud, token_detalle_requisicion);
  }

  validaDescuentoCotizacion(event: any, token_solicitud: any, token_detalle_requisicion: any, proveedor: any) {
    for (let a = 0; a < this.cotiSolicitudes.length; a++) {
      const soli = this.cotiSolicitudes[a];
      if (soli["token_solicitud_cotizacion"] == token_solicitud) {
        for (let b = 0; b < soli["desglose"].length; b++) {
          const desg = soli["desglose"][b];
          if (desg["token_detalle_requisicion"] == token_detalle_requisicion) {
            for (let p = 0; p < desg["proveedores"].length; p++) {
              const prv = desg["proveedores"][p];
              if (prv["token_cat_proveedores"] == proveedor) {
                if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
                  prv["descuento"] = event.value;
                  this.validator.correctoTD(event);
                } else {
                  prv["descuento"] = "";
                  this.validator.errorTD(event);
                }
              }
            }
            const arreglo_vacio = desg["proveedores"].filter((row: any) => row.length == 0);
            console.log(arreglo_vacio);
          }
        }
      }
    }
    this.validacion_total_cotizacion(token_solicitud, token_detalle_requisicion);
  }

  validaRetencionesCotizacion(event: any, token_solicitud: any, token_detalle_requisicion: any, proveedor: any) {
    for (let a = 0; a < this.cotiSolicitudes.length; a++) {
      const soli = this.cotiSolicitudes[a];
      if (soli["token_solicitud_cotizacion"] == token_solicitud) {
        for (let b = 0; b < soli["desglose"].length; b++) {
          const desg = soli["desglose"][b];
          if (desg["token_detalle_requisicion"] == token_detalle_requisicion) {
            for (let p = 0; p < desg["proveedores"].length; p++) {
              const prv = desg["proveedores"][p];
              if (prv["token_cat_proveedores"] == proveedor) {
                if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
                  prv["retenciones"] = event.value;
                  this.validator.correctoTD(event);
                } else {
                  prv["retenciones"] = "";
                  this.validator.errorTD(event);
                }
              }
            }
            const arreglo_vacio = desg["proveedores"].filter((row: any) => row.length == 0);
            console.log(arreglo_vacio);
          }
        }
      }
    }
    this.validacion_total_cotizacion(token_solicitud, token_detalle_requisicion);
  }

  validaTrasladosCotizacion(event: any, token_solicitud: any, token_detalle_requisicion: any, proveedor: any) {
    for (let a = 0; a < this.cotiSolicitudes.length; a++) {
      const soli = this.cotiSolicitudes[a];
      if (soli["token_solicitud_cotizacion"] == token_solicitud) {
        for (let b = 0; b < soli["desglose"].length; b++) {
          const desg = soli["desglose"][b];
          if (desg["token_detalle_requisicion"] == token_detalle_requisicion) {
            for (let p = 0; p < desg["proveedores"].length; p++) {
              const prv = desg["proveedores"][p];
              if (prv["token_cat_proveedores"] == proveedor) {
                if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
                  prv["traslados"] = event.value;
                  this.validator.correctoTD(event);
                } else {
                  prv["traslados"] = "";
                  this.validator.errorTD(event);
                }
              }
            }
            const arreglo_vacio = desg["proveedores"].filter((row: any) => row.length == 0);
            console.log(arreglo_vacio);
          }
        }
      }
    }
    this.validacion_total_cotizacion(token_solicitud, token_detalle_requisicion);
  }

  validaCredOfreceCotizacion(event: any, token_solicitud: any, token_detalle_requisicion: any, proveedor: any) {
    for (let a = 0; a < this.cotiSolicitudes.length; a++) {
      const soli = this.cotiSolicitudes[a];
      if (soli["token_solicitud_cotizacion"] == token_solicitud) {
        for (let b = 0; b < soli["desglose"].length; b++) {
          const desg = soli["desglose"][b];
          if (desg["token_detalle_requisicion"] == token_detalle_requisicion) {
            for (let p = 0; p < desg["proveedores"].length; p++) {
              const prv = desg["proveedores"][p];
              if (prv["token_cat_proveedores"] == proveedor) {
                if (event.checked == true) {
                  prv["credito_otorga"] = true;
                } else {
                  prv["credito_otorga"] = false;
                  prv["credito_time"] = "";
                }
              }
            }
            const arreglo_vacio = desg["proveedores"].filter((row: any) => row.length == 0);
            console.log(arreglo_vacio);
          }
        }
      }
    }
    this.validacion_total_cotizacion(token_solicitud, token_detalle_requisicion);
  }

  validaCredTimeCotizacion(event: any, token_solicitud: any, token_detalle_requisicion: any, proveedor: any) {
    for (let a = 0; a < this.cotiSolicitudes.length; a++) {
      const soli = this.cotiSolicitudes[a];
      if (soli["token_solicitud_cotizacion"] == token_solicitud) {
        for (let b = 0; b < soli["desglose"].length; b++) {
          const desg = soli["desglose"][b];
          if (desg["token_detalle_requisicion"] == token_detalle_requisicion) {
            for (let p = 0; p < desg["proveedores"].length; p++) {
              const prv = desg["proveedores"][p];
              if (prv["token_cat_proveedores"] == proveedor) {
                if (event.innerText != "" && this.validator.filtroAlfaNumerico(event.innerText) == true) {
                  prv["credito_time"] = event.innerText;
                  this.validator.correctoTD(event);
                } else {
                  prv["credito_time"] = "";
                  this.validator.errorTD(event);
                }
              }
            }
            const arreglo_vacio = desg["proveedores"].filter((row: any) => row.length == 0);
            console.log(arreglo_vacio);
          }
        }
      }
    }
    this.validacion_total_cotizacion(token_solicitud, token_detalle_requisicion);
  }

  validaGarantiaCotizacion(event: any, token_solicitud: any, token_detalle_requisicion: any, proveedor: any) {
    for (let a = 0; a < this.cotiSolicitudes.length; a++) {
      const soli = this.cotiSolicitudes[a];
      if (soli["token_solicitud_cotizacion"] == token_solicitud) {
        for (let b = 0; b < soli["desglose"].length; b++) {
          const desg = soli["desglose"][b];
          if (desg["token_detalle_requisicion"] == token_detalle_requisicion) {
            for (let p = 0; p < desg["proveedores"].length; p++) {
              const prv = desg["proveedores"][p];
              if (prv["token_cat_proveedores"] == proveedor) {
                if (event.innerText != "" && this.validator.filtroAlfaNumerico(event.innerText) == true) {
                  prv["garantia"] = event.innerText;
                  this.validator.correctoTD(event);
                } else {
                  prv["garantia"] = "";
                  this.validator.errorTD(event);
                }
              }
            }
            const arreglo_vacio = desg["proveedores"].filter((row: any) => row.length == 0);
            console.log(arreglo_vacio);
          }
        }
      }
    }
    this.validacion_total_cotizacion(token_solicitud, token_detalle_requisicion);
  }

  validaUnidadMedidaCotizacion(event: any, token_solicitud: any, token_detalle_requisicion: any, proveedor: any) {
    for (let a = 0; a < this.cotiSolicitudes.length; a++) {
      const soli = this.cotiSolicitudes[a];
      if (soli["token_solicitud_cotizacion"] == token_solicitud) {
        for (let b = 0; b < soli["desglose"].length; b++) {
          const desg = soli["desglose"][b];
          if (desg["token_detalle_requisicion"] == token_detalle_requisicion) {
            for (let p = 0; p < desg["proveedores"].length; p++) {
              const prv = desg["proveedores"][p];
              if (prv["token_cat_proveedores"] == proveedor) {
                /*for (let i = 0; i < this.lista_unidad_medida.length; i++) {
                  const row = this.lista_unidad_medida[i];
                  if (row["unidad_medida"] == event.value) {
                    console.log(row);
                    if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
                      prv["unidad_medida"] = row["token_unidad_medida"];
                      this.validator.correctoInputRow(event);
                    } else {
                      prv["unidad_medida"] = "";
                      this.validator.errorInputRow(event);
                    }
                    return;
                  } else {
                    prv["unidad_medida"] = "";
                    this.validator.errorInputRow(event);
                  }
                }*/

                let med = this.lista_unidad_medida.find((row: any) => row.nombre === event.value);
                const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && typeof med !== 'undefined';
                prv["unidad_medida"] = validacion ? med.nombre : '';
                validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
                //validacion ? this.validatePartidaReqNew() : null;
                //this.validaReqUnidadMedToken = row["token_unidad_medida"];row["unidad_medida"] + " clave " + row["sat_clave"] + " representa " + row["representa"];
              }
            }
            const arreglo_vacio = desg["proveedores"].filter((row: any) => row.length == 0);
            console.log(arreglo_vacio);
          }
        }
      }
    }
    this.validacion_total_cotizacion(token_solicitud, token_detalle_requisicion);
  }

  validaFormaPagoCotizacion(event: any, token_solicitud: any, token_detalle_requisicion: any, proveedor: any) {
    for (let a = 0; a < this.cotiSolicitudes.length; a++) {
      const soli = this.cotiSolicitudes[a];
      if (soli["token_solicitud_cotizacion"] == token_solicitud) {
        for (let b = 0; b < soli["desglose"].length; b++) {
          const desg = soli["desglose"][b];
          if (desg["token_detalle_requisicion"] == token_detalle_requisicion) {
            for (let p = 0; p < desg["proveedores"].length; p++) {
              const prv = desg["proveedores"][p];
              if (prv["token_cat_proveedores"] == proveedor) {
                if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
                  for (let i = 0; i < this.lista_forma_pago.length; i++) {
                    const row = this.lista_forma_pago[i];
                    if (row["forma"] == event.value) {
                      prv["forma_pago"] = row["token_formapago"];
                      this.validator.correctoInputRow(event);
                      return;
                    } else {
                      prv["forma_pago"] = "";
                      this.validator.errorInputRow(event);
                    }
                  }
                } else {
                  prv["forma_pago"] = "";
                  this.validator.errorInputRow(event);
                }
              }
            }
            const arreglo_vacio = desg["proveedores"].filter((row: any) => row.length == 0);
            console.log(arreglo_vacio);
          }
        }
      }
    }
    this.validacion_total_cotizacion(token_solicitud, token_detalle_requisicion);
  }

  validaValoracionCotizacion(event: any, token_solicitud: any, token_detalle_requisicion: any, proveedor: any) {
    for (let a = 0; a < this.cotiSolicitudes.length; a++) {
      const soli = this.cotiSolicitudes[a];
      if (soli["token_solicitud_cotizacion"] == token_solicitud) {
        for (let b = 0; b < soli["desglose"].length; b++) {
          const desg = soli["desglose"][b];
          if (desg["token_detalle_requisicion"] == token_detalle_requisicion) {
            for (let p = 0; p < desg["proveedores"].length; p++) {
              const prv = desg["proveedores"][p];
              if (prv["token_cat_proveedores"] == proveedor) {
                if (event.innerText != "" && this.validator.filtroAlfaNumerico(event.innerText) == true) {
                  prv["valoracion"] = event.innerText;
                  this.validator.correctoTD(event);
                } else {
                  prv["valoracion"] = "";
                  this.validator.errorTD(event);
                }
              }
            }
            const arreglo_vacio = desg["proveedores"].filter((row: any) => row.length == 0);
            console.log(arreglo_vacio);
          }
        }
      }
    }
    this.validacion_total_cotizacion(token_solicitud, token_detalle_requisicion);
  }

  validacion_total_cotizacion(token_solicitud: any, token_detalle_requisicion: any) {
    for (let a = 0; a < this.cotiSolicitudes.length; a++) {
      const soli = this.cotiSolicitudes[a];
      if (soli["token_solicitud_cotizacion"] == token_solicitud) {
        for (let b = 0; b < soli["desglose"].length; b++) {
          const desg = soli["desglose"][b];
          if (desg["token_detalle_requisicion"] == token_detalle_requisicion) {

            if (desg["adicionales"].length == 0) {
              this.valida_cotizacion_completa = true;
            } else {
              for (let m = 0; m < desg["adicionales"].length; m++) {
                const more = desg["adicionales"][m];
                for (let p = 0; p < more["proveedores"].length; p++) {
                  const prv = more["proveedores"][p];
                  if (prv["valor"] != "" && this.validator.filtroAlfaNumerico(prv["valor"]) == true) {
                    this.valida_cotizacion_completa = true;
                  } else {
                    this.valida_cotizacion_completa = false;
                    return;
                  }
                }
              }
            }

            for (let p = 0; p < desg["proveedores"].length; p++) {
              const prv = desg["proveedores"][p];
              if (prv["especificaciones"] != "" && this.validator.filtroAlfaNumerico(prv["especificaciones"]) == true &&
                prv["cantidad"] != "" && this.validator.filtroNum(prv["cantidad"]) == true &&
                prv["precio"] != "" && this.validator.filtroNum(prv["precio"]) == true && prv["moneda"] != "" &&
                prv["tipo_cambio"] != "" && this.validator.filtroNum(prv["tipo_cambio"]) == true &&
                prv["calidad"] != "" && this.validator.filtroAlfaNumerico(prv["calidad"]) == true &&
                prv["servicio"] != "" && this.validator.filtroAlfaNumerico(prv["servicio"]) == true &&
                prv["entrega_tipo"] != "" && this.validator.filtroAlfaNumerico(prv["entrega_tipo"]) == true &&
                prv["entrega_tiempo"] != "" && this.validator.filtroAlfaNumerico(prv["entrega_tiempo"]) == true &&
                prv["descuento"] != "" && this.validator.filtroAlfaNumerico(prv["descuento"]) == true &&
                prv["garantia"] != "" && this.validator.filtroAlfaNumerico(prv["garantia"]) == true &&
                prv["unidad_medida"] != "" && prv["forma_pago"] != "" && prv["valoracion"] != "" && this.validator.filtroAlfaNumerico(prv["valoracion"]) == true) {
                if (prv["credito_otorga"] == true) {
                  if (prv["credito_time"] != "" && this.validator.filtroAlfaNumerico(prv["credito_time"]) == true) {
                    this.valida_cotizacion_completa = true;
                  } else {
                    this.valida_cotizacion_completa = false;
                  }
                } else {
                  this.valida_cotizacion_completa = true;
                }
              } else {
                this.valida_cotizacion_completa = false;
                return;
              }
            }
            const arreglo_vacio = desg["proveedores"].filter((row: any) => row.length == 0);
            console.log(arreglo_vacio);
          }
        }
      }
    }
  }

  posicionarProveedor(token_solicitud: any, token_detalle_requisicion: any) {
    const soli = this.cotiSolicitudes.find((row: any) => row.token_solicitud_cotizacion === token_solicitud);
    const desg = soli.desglose.find((row: any) => row.token_detalle_requisicion === token_detalle_requisicion);
    const prv = desg.proveedores_mejor_opcion[0];
    const prv2 = desg.proveedores_mejor_opcion[1];
    const prv3 = desg.proveedores_mejor_opcion[2];

    if (typeof soli !== 'undefined' && typeof desg !== 'undefined') {
      prv.posicion = 1;
      prv2.posicion = 2;
      prv3.posicion = 3;
      this.mejor_opcion_valida_llenado(token_solicitud, token_detalle_requisicion);
    } else {
      prv.posicion = "";
      prv2.posicion = "";
      prv3.posicion = "";
    }
    console.log(this.lista_proveedor_select_mejor_opcion[0]);
    console.log(desg.proveedores_mejor_opcion);
  }

  /*mejor_opcion_estrellas(token_solicitud:any,token_detalle_requisicion:any,token_cat_proveedores:any,event:any){
    for (let a = 0; a < this.cotiSolicitudes.length; a++) {
      const soli = this.cotiSolicitudes[a];
      if (soli["token_solicitud_cotizacion"] == token_solicitud) {
        for (let b = 0; b < soli["desglose"].length; b++) {
          const desg = soli["desglose"][b];
          if (desg["token_detalle_requisicion"] == token_detalle_requisicion) {

            for (let p = 0; p < desg["proveedores_mejor_opcion"].length; p++) {
              const prv = desg["proveedores_mejor_opcion"][p];
              if (prv["token_cat_proveedores"] == token_cat_proveedores) {

                if (event.value != "" && this.validator.filtroNum(event.value) == true) {
                  prv["posicion"] = event.value;
                  this.validator.correctoInputRow(event);
                  this.mejor_opcion_valida_llenado(token_solicitud,token_detalle_requisicion);
                } else {
                  prv["posicion"] = "";
                  this.validator.errorInputRow(event);
                }

              }
            }
            console.log(desg["proveedores_mejor_opcion"]);
          }
        }
      }
    }
  }*/

  mejor_opcion_observaciones(token_solicitud: any, token_detalle_requisicion: any, token_cat_proveedores: any, event: any) {
    for (let a = 0; a < this.cotiSolicitudes.length; a++) {
      const soli = this.cotiSolicitudes[a];
      if (soli["token_solicitud_cotizacion"] == token_solicitud) {
        for (let b = 0; b < soli["desglose"].length; b++) {
          const desg = soli["desglose"][b];
          if (desg["token_detalle_requisicion"] == token_detalle_requisicion) {

            for (let p = 0; p < desg["proveedores_mejor_opcion"].length; p++) {
              const prv = desg["proveedores_mejor_opcion"][p];
              if (prv["token_cat_proveedores"] == token_cat_proveedores) {

                if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
                  prv["selected_observaciones"] = event.value;
                  this.validator.correctoInputRow(event);
                  this.mejor_opcion_valida_llenado(token_solicitud, token_detalle_requisicion);
                } else {
                  prv["selected_observaciones"] = "";
                  this.validator.errorInputRow(event);
                }

              }
            }
            console.log(desg["proveedores_mejor_opcion"]);
          }
        }
      }
    }
  }

  mejor_opcion_valida_llenado(token_solicitud: any, token_detalle_requisicion: any) {
    for (let a = 0; a < this.cotiSolicitudes.length; a++) {
      const soli = this.cotiSolicitudes[a];
      if (soli["token_solicitud_cotizacion"] == token_solicitud) {
        for (let b = 0; b < soli["desglose"].length; b++) {
          const desg = soli["desglose"][b];
          if (desg["token_detalle_requisicion"] == token_detalle_requisicion) {

            var some_selected = desg["proveedores_mejor_opcion"].some((row: any) => row.selected_observaciones == "");
            desg["proveedores_opcion_bool"] = some_selected;
            if (some_selected == true) {
              console.log("listas llenas")
            } else {
              console.log("listas vacias")
            }
          }
        }
      }
    }
  }

  comentarios_finales(token_solicitud: any, token_detalle_requisicion: any, event: any) {
    for (let a = 0; a < this.cotiSolicitudes.length; a++) {
      const soli = this.cotiSolicitudes[a];
      if (soli["token_solicitud_cotizacion"] == token_solicitud) {
        for (let b = 0; b < soli["desglose"].length; b++) {
          const desg = soli["desglose"][b];
          if (desg["token_detalle_requisicion"] == token_detalle_requisicion) {
            if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
              desg["comentarios_finales"] = event.value;
              this.validator.correctoInputRow(event);
            } else {
              desg["comentarios_finales"] = "";
              this.validator.errorInputRow(event);
            }
          }
        }
      }
    }
  }

  guardar_cotizacion(token_solicitud: any, token_detalle_requisicion: any, prov_cotizaciones: any, adicionales: any, proveedores_mejor_opcion: any, comentarios_finales: any) {
    console.log("codigo de guardadoi de cotiozación");
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this._cotService.cotNewPrevReq(token_solicitud, token_detalle_requisicion, prov_cotizaciones, adicionales, proveedores_mejor_opcion, comentarios_finales).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == "success") {
              setTimeout(function () {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: translate_response,
                  showConfirmButton: false,
                  timer: 3000
                })
              }, 1000);
            }
            if (response.status == "error") {
              Swal.fire({
                position: "top-end",
                icon: "warning",
                title: translate_response,
                showConfirmButton: false,
                timer: 3000
              })
            }
          }, error => { console.log(error); }
        );
      }
    })
  }

  cierra_solicitud(token_solicitud: any) {
    for (let i = 0; i < this.cotiSolicitudes.length; i++) {
      const soli = this.cotiSolicitudes[i];
      if (soli["token_solicitud_cotizacion"] == token_solicitud) {
        soli["abierto"] = false;
      }
    }
  }
}
