import { ChangeDetectorRef, Component,OnInit, ViewEncapsulation} from '@angular/core';
import { Usuarios } from '../../../../../modelos/Usuarios';
import { ValidatorServService } from '../../../../../servicios/validator-serv.service';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import numeral from 'numeral';
//<qrcode [qrdata]="'Tu cadena de datos'" [width]="256" [errorCorrectionLevel]="'M'"></qrcode> imports QRCodeComponent,
import { ImpuestosServService } from '../../../../../servicios/ssic/impuestos-serv.service';
import { MonedasService } from '../../../../../servicios/monedas.service';
import { SentinelArkManager } from '../../../../../servicios/sentinel-ark-manager';
import { ExcelColumnas } from '../../../../../interfaces/ExcelColumnas';
import { DescargaExcel } from '../../../../../servicios/descarga-excel';


@Component({
  selector: 'app-interno-egresos-catalogos-listaprod',
  templateUrl: './catalogo_general_impuestos.component.html',
  standalone:false,
  styleUrls: [
    '../../../../../styles/loading.css',
    '../../../../../styles/listas_ps.css',
    '../../../../../styles/datatable.css',
    '../../../../../styles/dropdown.css',
    '../../../../../styles/tabs.css',
    '../../../../../styles/input_group.css',
    '../../../../../styles/file_input.css',
    '../../../../../styles/buttons.css',
    '../../../../../styles/modals.css',
    '../../../../../styles/cabecera.css',
    '../../../../../styles/cards.css',
    '../../../../../styles/clientes.css',
    '../../../../../styles/collapsible.css',
    '../../../../../styles/row.css',
    '../../../../../styles/encabezados.css',
    '../../../../../styles/buscador.css',
    '../../../../../styles/radioButtons.css',
    '../../../../../styles/paginador.css',
    '../../../../../styles/landing.css',
    '../../../../../styles/colores.css',
    '../../../../../styles/switches.css',
    '../../../../../styles/navegador.css',
    './catalogo_general_impuestos.component.css'
  ],
  encapsulation: ViewEncapsulation.None,
})

export class CatalogoGeneralImpuestosComponent implements OnInit {
  public usuario: Usuarios;
  public identidad: any;

  public impuesto_esquema:string = "";
  impuesto_esquema_selection:any = [];
  public bool_esquema_registro:boolean = false;

  public impEsquemasListaTrue:any = [];
  public impEsquemasDetalle:any = [];
  public impEsquemasListaFalse:any = [];
  public view_lista_esquemas:boolean = false;
  public view_lista_esquemas_delete:boolean = false;
  
  public impuesto_abreviacion:string = "";
  public impuesto_concepto:string = "";
  public impuesto_modulo:string = "";
  public impuesto_nivel:string = "";
  public impuesto_clave_sat:string = "";
  public impuesto_tipo:string = "";
  public impuesto_exento:boolean = false;
  public impuesto_tasa_cuota:string = "";
  public impuesto_importe_simbolo:string = "";
  public impuesto_importe:string = "";
  public impuesto_tipo_cambio:string = "";
  catalogo_monedas:any = [];
  public impuesto_moneda_aplicada:string = "";
  public impuesto_aplica_sobre:string = "";
  public impuesto_desglose:boolean = false;
  public impuesto_gl_por_pagar_o_cobrar :string = "";
  public impuesto_gl_efectivamente_pagada_o_cobrada :string = "";
  public impuesto_observaciones:string = ""; 
  public bool_impuestos_update:boolean = false;

  public impuestos_nuevo_registro:any = []; // asegúrate de que esto esté inicializado como arreglo vacío

  impListaBuscar:any = [];
  public impuestosListaTrue:any = [];
  indicadorImpuestosCat:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
  rangoPeriodoImpuestosCat: Date[] | undefined;

  public impuestosListaEnabled:any = [];
  public detalleImpuestosArray:any = [];
  public impDeletedBuscar: string = '';
  public impuestosDeletedArray:any = [];
  public view_lista_impuestos_delete:boolean = false;

  constructor(
    private translate:TranslateService,
    private _catImp: ImpuestosServService,
    private validator:ValidatorServService,
    private _monedasServ: MonedasService,
    private sentinela: SentinelArkManager,
    private servXlsx:DescargaExcel,
    private cd: ChangeDetectorRef
  ) {
    this.usuario = new Usuarios(1,"","","","","","","",1,1,"","","","");
    this.identidad = this.sentinela.getIdentifUsuario();
  }

  ngOnInit(): void {
    //$('.tooltipped').tooltip();
    var elems = document.querySelectorAll('.tooltipped');
    //var instances = M.Tooltip.init(elems, this.options);
    this.esquemaImpuestosCatalogoTrue();
    this.esquemaImpuestosCatalogoFalse();

    this.catalogo_general_impuestos('hoy');
    this.catalogoGeneralImpuestosEnabled();
    this.catalogoGeneralImpuestosFalse();
    this.monedas_lista();
    this.impuestos_nuevo_registro = [{"id":1}];
    this.impListaBuscar = ['token_catalogo_impuesto','folio_impuesto','abreviacion_impuesto','concepto_impuesto','modulo','nivel_aplicacion',
      'catalogo_sat','tipo_impuesto','exento','calculo','txtimporte','tipo_cambio','monedas_codigo','monedas_moneda','base_aplicable','desglose',
      'gl_por_pagarcobrar','gl_pagada_o_cobrada','observaciones','habilitado'];
  }

  lista_catalogo_general_impuestos() {
    this.catalogo_general_impuestos(this.indicadorImpuestosCat);
  }

  catalogo_general_impuestos(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas') {
    this.indicadorImpuestosCat = filtro;
    let periodo_inicio = '';
    let periodo_fin = '';

    if (filtro == 'otras_fechas') {
      var cat_impuestos_otras_fechas = document.getElementById("cat_impuestos_otras_fechas");
      if (this.rangoPeriodoImpuestosCat && this.rangoPeriodoImpuestosCat.length === 2) {
        const dateInicio = this.rangoPeriodoImpuestosCat[0];
        const dateFin = this.rangoPeriodoImpuestosCat[1];
        if (dateInicio && dateFin) {
          const validacionInicio = this.validator.filtroFecha(dateInicio.toISOString().split('T')[0]);
          const validacionFin = this.validator.filtroFecha(dateFin.toISOString().split('T')[0]);
          if (validacionInicio && validacionFin) {
            periodo_inicio = dateInicio.toISOString().split('T')[0];
            periodo_fin = dateFin.toISOString().split('T')[0];
            this.validator.correctoInputRow(cat_impuestos_otras_fechas);
          } else {
            this.validator.errorInputRow(cat_impuestos_otras_fechas);
          }
        } else {
          this.validator.errorInputRow(cat_impuestos_otras_fechas);
          return;
        }
      } else {
        this.validator.errorInputRow(cat_impuestos_otras_fechas);
      }
    }
    
    this._catImp.catalogoGeneralImpuestosTrue(filtro,periodo_inicio,periodo_fin).subscribe({
      next: (response) => this.procesarRespuestaImpuestos(response),
      error: (err) => this.manejarErrorImpuestos(err)
    });
  }

  private procesarRespuestaImpuestos(response: any) {
    if (response.status === 'success') {
      this.impuestosListaTrue = response.impuestos;
      console.log(this.impuestosListaTrue);
      this.cd.detectChanges(); // Forzamos detección de cambios si es necesario
    } else {
      this.impuestosListaTrue = []; // O manejar mensaje de "sin datos"
    }
  }

  private manejarErrorImpuestos(error: any) {
    console.error('Error al cargar la lista general de impuestos:', error);
    this.impuestosListaTrue = [];
  }

  descarga_excel_impuestos(){
    console.log(this.impuestosListaTrue);
    const columnas:ExcelColumnas[] = [
			{label: "Abreviación", field: "abreviacion_impuesto", rowspan: 2, align: "center"},
			{label: "Concepto", field: "concepto_impuesto", rowspan: 2, align: "left"},
			{label: "Módulo", field: "modulo", rowspan: 2, align: "center"},
			{label: "Nivel de aplicación", field: "nivel_aplicacion", rowspan: 2, align: "center"},
			{label: "Clave sat", field: "catalogo_sat", rowspan: 2, align: "center"},
			{label: "Tipo", field: "tipo_impuesto", rowspan: 2, align: "center"},
			{label: "Exento", field: "exento", rowspan: 2, align: "center"},
			{label: "Tasa o cuota", field: "calculo", rowspan: 2, align: "center"},
			{label: "Importe del impuesto", field: "txtimporte", rowspan: 2, align: "right"},
			{label: "Tipo de cambio aplicado", field: "tipo_cambio", rowspan: 2, align: "right"},
			{label: "Moneda aplicada", field: "monedas_codigo", rowspan: 2, align: "left"},
			{label: "Aplica sobre", field: "base_aplicable", rowspan: 2, align: "center"},
			{label: "Desglose", field: "desglose", rowspan: 2, align: "center"},
			{label: "GL por pagar o cobrar", field: "gl_por_pagarcobrar", rowspan: 2, align: "center"},
			{label: "GL efectivamente pagada o cobrada", field: "gl_pagada_o_cobrada", rowspan: 2, align: "left"},
			{label: this.translate.instant("observ"), field: "observaciones", rowspan: 2, align: "left"},
    ];
    this.servXlsx.descarga_xlsx_documento(this.impuestosListaTrue,columnas,'Impuestos','Catálogo de impuestos.xlsx');
  }

  catalogoGeneralImpuestosEnabled(){
    this._catImp.catalogoGeneralImpuestosEnabled().subscribe(
      response => {
        if (response.status == 'success') {
          this.impuestosListaEnabled = response.impuestos;
          console.log(this.impuestosListaEnabled);
        }
      }, 
      error => {
        console.log(error);
      }
    );
  }

  catalogoGeneralImpuestosFalse(){
    this.view_lista_impuestos_delete = false;
    this._catImp.catalogoGeneralImpuestosFalse().subscribe(
      response => {
        if (response.status == 'success') {    
          this.view_lista_impuestos_delete = true;
          this.impuestosDeletedArray = response.impuestos
        }
      }, 
      error => {
        console.log(error);
      }
    );
  }

  monedas_lista(){
    this._monedasServ.getMonedasDos().subscribe((data) => {
      this.catalogo_monedas = data;
      console.log(data);
    });
  }

  onKeyPressAlfa(e:KeyboardEvent) {
    this.validator.key_press_alfa(e);
  }

  onKeyPressNumbers(e:KeyboardEvent) {
    this.validator.key_press_numbers(e);
  }

  //esquemas
    keyupImpuestoEsquemaDescripcion(event:any){
      if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
        this.impuesto_esquema = event.value;
        this.validator.correctoTextareaRow(event);
      } else  {
        this.impuesto_esquema = "";
        this.validator.errorTextareaRow(event);
      }
      this.validaEsquemaNuevo();
    }

    seleccionarImpuestoForEsquemas(token_catalogo_impuesto:any,event:any){
      for (let i = 0; i < this.impuestosListaTrue.length; i++) {
        const imp = this.impuestosListaTrue[i];
        if (imp["token_catalogo_impuesto"] == token_catalogo_impuesto) {
          imp["vinculacion"] = event.checked == true ? true : false; 
          this.validaEsquemaNuevo();
        }
      }
      console.log(this.impuestosListaTrue);
    }

    validaEsquemaNuevo(){
      let buscadorSelect = this.impuestosListaTrue.some((row:any) => row.vinculacion == true);
      if ((this.impuesto_esquema != "" && this.validator.filtroAlfaNumerico(this.impuesto_esquema) == true) && buscadorSelect == true) {
        this.bool_esquema_registro = true;
      } else {
        this.bool_esquema_registro = false;
      }
    }

    registraEsquemaImpuesto(){
      Swal.fire({
        title: this.translate.instant("swal_attenc"),
        text: this.translate.instant("swal_insert"),
        icon: 'warning',
        confirmButtonColor: '#388E3C',
        confirmButtonText: this.translate.instant("swal_yes_insert"),
        showCancelButton: true,
        cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
      }).then((result) => {
        if (result.isConfirmed) {

          for (let i = 0; i < this.impuestosListaTrue.length; i++) {
            const imp = this.impuestosListaTrue[i];
            if (imp["vinculacion"] == true) {
              this.impuesto_esquema_selection.push({"token_catalogo_impuesto":imp["token_catalogo_impuesto"]});
              imp["vinculacion"] == false;
            }
          }

          this._catImp.esquemaImpuestosRegistro(
            this.impuesto_esquema,
            this.impuesto_esquema_selection
          ).subscribe(
            response => {
              let translate_response = this.translate.instant(response.message);
              if (response.status == 'success') {
                setTimeout(function(){
                  Swal.fire({
                    position:'center',
                    icon: 'success',
                    title: translate_response,
                    showConfirmButton:false,
                    timer: 3000
                  })
                },1000);
                this.impuesto_esquema = "";
                this.impuesto_esquema_selection = [];
                this.lista_catalogo_general_impuestos();
              }
              if (response.status == 'error') {
                Swal.fire({
                  position:'top-end',
                  icon: 'warning',
                  title: translate_response,
                  showConfirmButton:false,
                  timer: 3000
                })
              }
            },
            error => {
              console.log(error);
            }
          )
        }
      });
    }

    esquemaImpuestosCatalogoTrue(){
      this.view_lista_esquemas = false;
      this._catImp.esquemaImpuestosCatalogo().subscribe(
        response => {
          if (response.status == 'success') {
            this.view_lista_esquemas = true;
            this.impEsquemasListaTrue = response.esquemas;
            console.log(this.impEsquemasListaTrue);
          }
        }, 
        error => {
          console.log(error);
        }
      );
    }

    verDetalleEsquemaImpuesto(esquema_token:any){
      this._catImp.seleccionarEsquemaImpuestosInfo(esquema_token).subscribe(
        response => {
          if (response.status == 'success') {
            console.log(response.esquemas);
            this.impEsquemasDetalle = response.esquemas; 
          }
        }, 
        error => {
          console.log(error);
        }
      )
    }

    habilitaEsquemaImpuesto(esquema_token:any){
      Swal.fire({
        title: this.translate.instant("swal_attenc"),
        text: this.translate.instant("swal_update"),
        icon: 'warning',
        confirmButtonColor: '#388E3C',
        confirmButtonText: this.translate.instant("swal_yes_update"),
        showCancelButton: true,
        cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
      }).then((result) => {
        if (result.isConfirmed) {
          this._catImp.enableEsquemaImpuestos(esquema_token).subscribe(
            response => {
              let translate_response = this.translate.instant(response.message);
              if (response.status == 'success') {
                setTimeout(function(){
                  Swal.fire({
                    position:'center',
                    icon: 'success',
                    title: translate_response,
                    showConfirmButton:false,
                    timer: 3000
                  })
                },1000);
                this.lista_catalogo_general_impuestos();
                this.verDetalleEsquemaImpuesto(esquema_token);
              }
              if (response.status == 'error') {
                Swal.fire({
                  position:'top-end',
                  icon: 'warning',
                  title: translate_response,
                  showConfirmButton:false,
                  timer: 3000
                })
              }
            },
            error => {
              console.log(error);
            }
          )
        }
      });
    }

    deshabilitaEsquemaImpuesto(esquema_token:any){
      Swal.fire({
        title: this.translate.instant("swal_attenc"),
        text: this.translate.instant("swal_update"),
        icon: 'warning',
        confirmButtonColor: '#388E3C',
        confirmButtonText: this.translate.instant("swal_yes_update"),
        showCancelButton: true,
        cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
      }).then((result) => {
        if (result.isConfirmed) {
          this._catImp.disableEsquemaImpuestos(esquema_token).subscribe(
            response => {
              let translate_response = this.translate.instant(response.message);
              if (response.status == 'success') {
                setTimeout(function(){
                  Swal.fire({
                    position:'center',
                    icon: 'success',
                    title: translate_response,
                    showConfirmButton:false,
                    timer: 3000
                  })
                },1000);
                this.lista_catalogo_general_impuestos();
                this.verDetalleEsquemaImpuesto(esquema_token);
              }
              if (response.status == 'error') {
                Swal.fire({
                  position:'top-end',
                  icon: 'warning',
                  title: translate_response,
                  showConfirmButton:false,
                  timer: 3000
                })
              }
            },
            error => {
              console.log(error);
            }
          )
        }
      });
    }


    keyupUpdateImpuestoEsquemaDescripcion(event:any){
      if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
        this.impEsquemasDetalle[0]["esquema_concepto_respaldo"] = event.value;
        this.validator.correctoTextareaRow(event);
      } else  {
        this.impEsquemasDetalle[0]["esquema_concepto_respaldo"] = "";
        this.validator.errorTextareaRow(event);
      }
      console.log(this.impEsquemasDetalle[0]["esquema_concepto_respaldo"]);
    }

    updateConceptoEsquemaImpuesto(esquema_token:any,esquema_concepto:any){
      Swal.fire({
        title: this.translate.instant("swal_attenc"),
        text: this.translate.instant("swal_insert"),
        icon: 'warning',
        confirmButtonColor: '#388E3C',
        confirmButtonText: this.translate.instant("swal_yes_insert"),
        showCancelButton: true,
        cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
      }).then((result) => {
        if (result.isConfirmed) {
          this._catImp.actualizarEsquemaImpuestosSelected(esquema_token,esquema_concepto).subscribe(
            response => {
              let translate_response = this.translate.instant(response.message);
              if (response.status == 'success') {
                setTimeout(function(){
                  Swal.fire({
                    position:'center',
                    icon: 'success',
                    title: translate_response,
                    showConfirmButton:false,
                    timer: 3000
                  })
                },1000);
                this.lista_catalogo_general_impuestos();
                this.verDetalleEsquemaImpuesto(esquema_token);
              }
              if (response.status == 'error') {
                Swal.fire({
                  position:'top-end',
                  icon: 'warning',
                  title: translate_response,
                  showConfirmButton:false,
                  timer: 3000
                })
              }
            },
            error => {
              console.log(error);
            }
          )
        }
      });
    }

    seleccionarImpuestoForUpdateEsquemas(event:any,esquema_token:any,token_catalogo_impuesto:any){
      var esq = this.impEsquemasDetalle[0];
      //imp["vinculacion"] = event.checked == true ? true : false; 
      if (event.checked == true) {
        Swal.fire({
          title: this.translate.instant("swal_attenc"),
          text: this.translate.instant("swal_update"),
          icon: 'warning',
          confirmButtonColor: '#388E3C',
          confirmButtonText: this.translate.instant("swal_yes_update"),
          showCancelButton: true,
          cancelButtonColor: '#D32F2F',
          cancelButtonText: this.translate.instant("swal_cancel"),
        }).then((result) => {
          if (result.isConfirmed) {
            this._catImp.actualizarEsquemaImpuestosAadSelected(esquema_token,token_catalogo_impuesto).subscribe(
              response => {
                let translate_response = this.translate.instant(response.message);
                if (response.status == 'success') {
                  esq["vinculado"] = true;
                  setTimeout(function(){
                    Swal.fire({
                      position:'center',
                      icon: 'success',
                      title: translate_response,
                      showConfirmButton:false,
                      timer: 3000
                    })
                  },1000);
                  this.verDetalleEsquemaImpuesto(esquema_token);
                }
                if (response.status == 'error') {
                  Swal.fire({
                    position:'top-end',
                    icon: 'warning',
                    title: translate_response,
                    showConfirmButton:false,
                    timer: 3000
                  })
                }
              },
              error => {
                console.log(error);
              }
            )
          } else {
            esq["vinculado"] = false;
          }
        });
      } else {
        Swal.fire({
          title: this.translate.instant("swal_attenc"),
          text: this.translate.instant("swal_update"),
          icon: 'warning',
          confirmButtonColor: '#388E3C',
          confirmButtonText: this.translate.instant("swal_yes_update"),
          showCancelButton: true,
          cancelButtonColor: '#D32F2F',
          cancelButtonText: this.translate.instant("swal_cancel"),
        }).then((result) => {
          if (result.isConfirmed) {
            this._catImp.actualizarEsquemaImpuestosRemoveSelected(esquema_token,token_catalogo_impuesto).subscribe(
              response => {
                let translate_response = this.translate.instant(response.message);
                if (response.status == 'success') {
                  esq["vinculado"] = true;
                  setTimeout(function(){
                    Swal.fire({
                      position:'center',
                      icon: 'success',
                      title: translate_response,
                      showConfirmButton:false,
                      timer: 3000
                    })
                  },1000);
                  this.verDetalleEsquemaImpuesto(esquema_token);
                }
                if (response.status == 'error') {
                  Swal.fire({
                    position:'top-end',
                    icon: 'warning',
                    title: translate_response,
                    showConfirmButton:false,
                    timer: 3000
                  })
                }
              },
              error => {
                console.log(error);
              }
            )
          } else {
            esq["vinculado"] = true;
          }
        });
      }
    }

    eliminaEsquemaImpuesto(esquema_token:any){
      Swal.fire({
        title: this.translate.instant("swal_attenc"),
        text: this.translate.instant("swal_delete"),
        icon: 'warning',
        confirmButtonColor: '#388E3C',
        confirmButtonText: this.translate.instant("swal_yes_delete"),
        showCancelButton: true,
        cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
      }).then((result) => {
        if (result.isConfirmed) {
          this._catImp.papeleraSaveEsquemaImpuestosSelected(esquema_token).subscribe(
            response => {
              let translate_response = this.translate.instant(response.message);
              if (response.status == 'success') {
                setTimeout(function(){
                  Swal.fire({
                    position:'center',
                    icon: 'success',
                    title: translate_response,
                    showConfirmButton:false,
                    timer: 3000
                  })
                },1000);
                this.esquemaImpuestosCatalogoTrue();
                this.esquemaImpuestosCatalogoFalse();
              }
              if (response.status == 'error') {
                Swal.fire({
                  position:'top-end',
                  icon: 'warning',
                  title: translate_response,
                  showConfirmButton:false,
                  timer: 3000
                })
              }
            },
            error => {
              console.log(error);
            }
          )
        }
      });
    }

    esquemaImpuestosCatalogoFalse(){
      this.view_lista_esquemas = false;
      this._catImp.esquemaImpuestosCatalogoEliminados().subscribe(
        response => {
          if (response.status == 'success') {
            this.view_lista_esquemas = true;
            this.impEsquemasListaFalse = response.esquemas;
            console.log(this.impEsquemasListaFalse);
          }
        }, 
        error => {
          console.log(error);
        }
      );
    }

    restauraEsquemaImpuestos(esquema_token:any){
      Swal.fire({
        title: this.translate.instant("swal_attenc"),
        text: this.translate.instant("swal_restore"),
        icon: 'warning',
        confirmButtonColor: '#388E3C',
        confirmButtonText: this.translate.instant("swal_yes_restore"),
        showCancelButton: true,
        cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
      }).then((result) => {
        if (result.isConfirmed) {
          this._catImp.restaurarEsquemaImpuestosSelected(esquema_token).subscribe(
            response => {
              let translate_response = this.translate.instant(response.message);
              if (response.status == 'success') {
                setTimeout(function(){
                  Swal.fire({
                    position:'center',
                    icon: 'success',
                    title: translate_response,
                    showConfirmButton:false,
                    timer: 3000
                  })
                },1000);
                this.esquemaImpuestosCatalogoTrue();
                this.esquemaImpuestosCatalogoFalse();
              }
              if (response.status == 'error') {
                Swal.fire({
                  position:'top-end',
                  icon: 'warning',
                  title: translate_response,
                  showConfirmButton:false,
                  timer: 3000
                })
              }
            },
            error => {
              console.log(error);
            }
          )
        }
      });
    }

    eliminaPermEsquemaImpuestos(esquema_token:any){
      Swal.fire({
        title: this.translate.instant("swal_attenc"),
        text: this.translate.instant("swal_delete"),
        icon: 'warning',
        confirmButtonColor: '#388E3C',
        confirmButtonText: this.translate.instant("swal_yes_delete"),
        showCancelButton: true,
        cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
      }).then((result) => {
        if (result.isConfirmed) {
          this._catImp.eliminarPermEsquemaImpuestosSelected(esquema_token).subscribe(
            response => {
              let translate_response = this.translate.instant(response.message);
              if (response.status == 'success') {
                setTimeout(function(){
                  Swal.fire({
                    position:'center',
                    icon: 'success',
                    title: translate_response,
                    showConfirmButton:false,
                    timer: 3000
                  })
                },1000);
                this.esquemaImpuestosCatalogoTrue();
                this.esquemaImpuestosCatalogoFalse();
              }
              if (response.status == 'error') {
                Swal.fire({
                  position:'top-end',
                  icon: 'warning',
                  title: translate_response,
                  showConfirmButton:false,
                  timer: 3000
                })
              }
            },
            error => {
              console.log(error);
            }
          )
        }
      });
    }

  //registro
    keyupImpuestoAbreviacion(event:any){
      const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value);
      this.impuesto_abreviacion = validacion ? event.value : "";
      validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    }

    keyupImpuestoConcepto(event:any){
      const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value);
      this.impuesto_concepto = validacion ? event.value : "";
      validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    }

    keyupImpuestoModulo(event:any){
      const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value);
      this.impuesto_modulo = validacion ? event.value : "";
      validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    }

    keyupImpuestoNivel(event:any){
      const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value);
      this.impuesto_nivel = validacion ? event.value : "";
      validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    }

    keyupImpuestoClaveSat(event:any){
      const validacion = event.value != '' && this.validator.filtroNum(event.value) && event.value.length == 3;
      this.impuesto_clave_sat = validacion ? event.value : "";
      validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    }

    keyupImpuestoTipo(event:any){
      const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value);
      this.impuesto_tipo = validacion ? event.value : "";
      validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    }

    keyupImpuestoExento(event:any){
      this.impuesto_exento = event.checked == true ? true : false;
    }

    keyupImpuestoTasacuota(event:any){
      var imppassoc_importe = document.getElementById("imppassoc_importe");
      const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value);
      this.impuesto_tasa_cuota = validacion ? event.value : "";
      this.impuesto_importe_simbolo = validacion ? (event.value == "tasa" ? "%" : "$") : "";
      this.impuesto_importe = "";
      validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
      validacion ? this.validator.limpiaInputRow(imppassoc_importe) : null;
    }

    keyupImpuestoImporte(event:any){
      const validacion = event.value != "" && ((this.impuesto_tasa_cuota == "tasa" && this.validator.filtroPorcentaje(event.value) == true) || (this.impuesto_tasa_cuota == "cuota" && this.validator.filtroCosto(event.value) == true));
      this.impuesto_importe = validacion ? event.value : "";
      validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    }

    keyupImpuestoTipoCambio(event:any){
      const validacion = event.value != "" && this.impuesto_tasa_cuota == "cuota" && this.validator.filtroCosto(event.value) == true;
      this.impuesto_tipo_cambio = validacion ? numeral(event.value).format('0.00') : "";
      validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    }

    keyupImpuestoMoneda(event:any){
      var decim_inicial = "";
      for (let i = 0; i < parseInt(this.identidad.moneda_decimales); i++) {decim_inicial = decim_inicial+"0";}
      console.log(event.value);
      for (let i = 0; i < this.catalogo_monedas.length; i++) {
        const money = this.catalogo_monedas[i];
        if (money['moneda'] == event.value) {
          if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
            this.impuesto_moneda_aplicada = money["token_monedas"];
            this.validator.correctoInputRow(event);
          } else {
            this.impuesto_moneda_aplicada = "";
            this.impuesto_tipo_cambio = "1."+decim_inicial;
            this.validator.errorInputRow(event);
          }
          return;
        } else {
          this.impuesto_moneda_aplicada = "";
          this.validator.errorInputRow(event);
        }
      }
    }

    keyupImpuestoAplicaSobre(event:any){
      const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value);
      this.impuesto_aplica_sobre = validacion ? event.value : "";
      validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    }

    keyupImpuestoDecideDesglose(event:any){
      this.impuesto_desglose = event.checked == true ? true : false;
    }

    keyupImpuestoGLxPagarOCobrar(event:any){
      const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value);
      this.impuesto_gl_por_pagar_o_cobrar = validacion ? event.value : "";
      validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    }

    keyupImpuestoGLEfectivamentePagadaOCobrada(event:any){
      const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value);
      this.impuesto_gl_efectivamente_pagada_o_cobrada = validacion ? event.value : "";
      validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    }

    keyupImpuestoObsevaciones(event:any){
      const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value);
      this.impuesto_observaciones = validacion ? event.value : "";
      validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    }

    get validaRegistroImpuesto():Boolean{
      const valida_abreviacion = this.impuesto_abreviacion != "" && this.validator.filtroAlfaNumerico(this.impuesto_abreviacion) == true;
      const valida_concepto = this.impuesto_concepto != "" && this.validator.filtroAlfaNumerico(this.impuesto_concepto) == true;
      const valida_modulo = this.impuesto_modulo != "" && this.validator.filtroAlfaNumerico(this.impuesto_modulo);
      const valida_nivel = this.impuesto_nivel != "" && this.validator.filtroAlfaNumerico(this.impuesto_nivel);
      const valida_clave_sat = this.impuesto_clave_sat != '' && this.validator.filtroNum(this.impuesto_clave_sat) && this.impuesto_clave_sat.length == 3;
      const valida_tipo = this.impuesto_tipo != "" && this.validator.filtroAlfaNumerico(this.impuesto_tipo);
      const valida_tasa_cuota = this.impuesto_tasa_cuota != "" && this.validator.filtroAlfaNumerico(this.impuesto_tasa_cuota) == true;
      const valida_importe = this.impuesto_importe != "" && ((this.impuesto_tasa_cuota == "tasa" && this.validator.filtroPorcentaje(this.impuesto_importe) == true) || (this.impuesto_tasa_cuota == "cuota" && this.validator.filtroCosto(this.impuesto_importe) == true));
      const valida_tipo_cambio = this.impuesto_tipo_cambio != "" && this.impuesto_tasa_cuota == "cuota" && this.validator.filtroCosto(this.impuesto_tipo_cambio) == true;
      const valida_aplica_sobre = this.impuesto_aplica_sobre != "" && this.validator.filtroAlfaNumerico(this.impuesto_aplica_sobre);
      const valida_gl_por_pagar_o_cobrar = this.impuesto_gl_por_pagar_o_cobrar != "" && this.validator.filtroAlfaNumerico(this.impuesto_gl_por_pagar_o_cobrar);
      const valida_gl_efectivamente_pagada_o_cobrada = this.impuesto_gl_efectivamente_pagada_o_cobrada != "" && this.validator.filtroAlfaNumerico(this.impuesto_gl_efectivamente_pagada_o_cobrada);
      const valida_observaciones = this.impuesto_observaciones != "" && this.validator.filtroAlfaNumerico(this.impuesto_observaciones);

      return valida_abreviacion && valida_concepto && valida_modulo && valida_nivel && (this.impuesto_exento || (valida_tipo && valida_tasa_cuota &&
        valida_importe && valida_aplica_sobre)) && valida_observaciones;
    }

    limpiar_todo(){
      this.impuesto_abreviacion = ""; 
      this.impuesto_concepto = "";
      this.impuesto_modulo = "";
      this.impuesto_nivel = "";
      this.impuesto_clave_sat = "";
      this.impuesto_tipo = "";
      this.impuesto_exento = false;
      this.impuesto_tasa_cuota = "";
      this.impuesto_importe = "";
      this.impuesto_gl_por_pagar_o_cobrar = "";2
      this.impuesto_gl_efectivamente_pagada_o_cobrada = "";
      this.impuesto_aplica_sobre = "";
      this.impuesto_observaciones = "";
      
      this.validator.limpiaTextarea(document.getElementById("impuesto_abreviacion"))
      this.validator.limpiaTextarea(document.getElementById("impuesto_concepto"))
      this.validator.limpiaSelect(document.getElementById("impuesto_modulo"))
      this.validator.limpiaInputRow(document.getElementById("impuesto_nivel_aplicacion"))
      this.validator.limpiaInputRow(document.getElementById("impuesto_clave_sat"))
      this.validator.limpiaSelect(document.getElementById("impuesto_tipo"))
      this.validator.limpiaSelect(document.getElementById("impuesto_exento"))
      this.validator.limpiaSelect(document.getElementById("impuesto_tasa_cuota"))
      this.validator.limpiaInputRow(document.getElementById("imppassoc_importe"))
      this.validator.limpiaInputRow(document.getElementById("impuesto_tipo_cambio"))
      this.validator.limpiaInputRow(document.getElementById("impuesto_moneda"))
      this.validator.limpiaSelect(document.getElementById("impuesto_aplica_sobre"))
      $("#impuesto_decide_desglose").prop("checked", false);
      this.validator.limpiaInputRow(document.getElementById("impuesto_glx_pagar_o_cobrar"))
      this.validator.limpiaInputRow(document.getElementById("impuesto_gl_efec_pag_o_cob"))
      this.validator.limpiaTextarea(document.getElementById("impuesto_observaciones"))
    }
  
    registraImpuesto(){
      Swal.fire({
        title: this.translate.instant("swal_attenc"),
        text: this.translate.instant("swal_insert"),
        icon: 'warning',
        confirmButtonColor: '#388E3C',
        confirmButtonText: this.translate.instant("swal_yes_insert"),
        showCancelButton: true,
        cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
      }).then((result) => {
        if (result.isConfirmed) {
          this._catImp.registrarImpuestosCatalogo(
            this.impuesto_abreviacion,
            this.impuesto_concepto,
            this.impuesto_modulo,
            this.impuesto_nivel,
            this.impuesto_clave_sat,
            this.impuesto_tipo,
            this.impuesto_exento,
            this.impuesto_tasa_cuota,
            this.impuesto_importe,
            this.impuesto_tipo_cambio,
            this.impuesto_moneda_aplicada,
            this.impuesto_aplica_sobre,
            this.impuesto_desglose,
            this.impuesto_gl_por_pagar_o_cobrar,
            this.impuesto_gl_efectivamente_pagada_o_cobrada,
            this.impuesto_observaciones
          ).subscribe(
            response => {
              let translate_response = this.translate.instant(response.message);
              if (response.status == 'success') {
                setTimeout(function(){
                  Swal.fire({
                    position:'center',
                    icon: 'success',
                    title: translate_response,
                    showConfirmButton:false,
                    timer: 3000
                  })
                },1000);
                
                this.limpiar_todo();
                this.lista_catalogo_general_impuestos();
              }
              if (response.status == 'error') {
                Swal.fire({
                  position:'top-end',
                  icon: 'warning',
                  title: translate_response,
                  showConfirmButton:false,
                  timer: 3000
                })
              }
            },
            error => {
              console.log(error);
            }
          )
        }
      });
    }

  //catalogos
    verDetalleImpuesto(token_impuesto:any){
      this._catImp.seleccionarImpuestoInfo(token_impuesto).subscribe(
        response => {
          if (response.status == 'success') {
            console.log(response.datosImpuesto);
            this.detalleImpuestosArray = response.datosImpuesto; 
          }
        }, 
        error => {
          console.log(error);
        }
      )
    }

    keyupImpuestoUpdateModulo(event:any){
      var det = this.detalleImpuestosArray[0];
      det["modulo_respaldo"] = event.value;
      console.log(det["modulo_respaldo"]);
      if (det["modulo_respaldo"] != "" && this.validator.filtroAlfaNumerico(det["modulo_respaldo"]) == true && det["modulo_respaldo"] != det["modulo"]) {
        this.validator.correctoInputRow(event);
      } else  {
        this.validator.errorInputRow(event);
      }
      this.validaActualizacionImpuesto();
    }

    keyupImpuestoUpdateNivel(event:any){
      var det = this.detalleImpuestosArray[0];
      det["nivel_aplicacion_respaldo"] = event.value;
      if (det["nivel_aplicacion_respaldo"] != "" && this.validator.filtroAlfaNumerico(det["nivel_aplicacion_respaldo"]) == true && det["nivel_aplicacion_respaldo"] != det["nivel_aplicacion"]) {
        this.validator.correctoInputRow(event);
      } else  {
        this.validator.errorInputRow(event);
      }
      this.validaActualizacionImpuesto();
    }

    keyupImpuestoUpdateClaveSat(event:any){
      var det = this.detalleImpuestosArray[0];
      det["catalogo_sat_respaldo"] = event.value;
      if (det["catalogo_sat_respaldo"] != '' && this.validator.filtroNum(det["catalogo_sat_respaldo"]) == true && det["catalogo_sat_respaldo"].length == 3 && det["catalogo_sat_respaldo"] != det["catalogo_sat"]) {
        this.validator.correctoInputRow(event);
      } else  {
        this.validator.errorInputRow(event);
      }
      this.validaActualizacionImpuesto();
    }

    keyupImpuestoUpdateTipo(event:any){
      var det = this.detalleImpuestosArray[0];
      det["tipo_impuesto_respaldo"] = event.value;
      if (det["tipo_impuesto_respaldo"] != "" && this.validator.filtroAlfaNumerico(det["tipo_impuesto_respaldo"]) == true && det["tipo_impuesto_respaldo"] != det["tipo_impuesto"]) {
        this.validator.correctoInputRow(event);
      } else  {
        this.validator.errorInputRow(event);
      }
      this.validaActualizacionImpuesto();
    }

    keyupImpuestoUpdateTasacuota(event:any){
      var det = this.detalleImpuestosArray[0];
      det["calculo_respaldo"] = event.value;
      var imppassoc_importe = document.getElementById("detailimppassoc_importe");
      if (det["calculo_respaldo"] != "" && this.validator.filtroAlfaNumerico(det["calculo_respaldo"]) == true && det["calculo_respaldo"] != det["calculo"]) {
        this.validator.correctoInputRow(event);
        det["impuesto_importe_simbolo"] = det["calculo_respaldo"] == "tasa" ? "%" : "$";
        det["importe_respaldo"] = "";
        this.validator.limpiaInputRow(imppassoc_importe);
      } else  {
        det["calculo_respaldo"] = det["calculo"];
        det["impuesto_importe_simbolo"] = "";
        det["importe_respaldo"] = det["importe"];
        this.validator.errorInputRow(event);
      }
      this.validaActualizacionImpuesto();
    }

    keyupImpuestoUpdateImporte(event:any){
      var det = this.detalleImpuestosArray[0];
      det["importe_respaldo"] = event.value;
      if (det["importe_respaldo"] != "" && det["importe_respaldo"] != det["importe"] && ((det["calculo_respaldo"] == "tasa" && this.validator.filtroPorcentaje(det["importe_respaldo"]) == true) || (det["calculo_respaldo"] == "cuota" && this.validator.filtroCosto(det["importe_respaldo"]) == true))) {
        //this.impuesto_importe = this.impuesto_tasa_cuota == "tasa" ? event.value+"%" : numeral(event.value).format('$0,0.00');
        this.validator.correctoInputRow(event);
      } else {
        this.validator.errorInputRow(event);
      }
      this.validaActualizacionImpuesto();
    }

    keyupImpuestoUpdateTipoCambio(event:any){
      var det = this.detalleImpuestosArray[0];
      det["tipo_cambio_respaldo"] = event.value;
      console.log(det["tipo_cambio_respaldo"]+" "+det["tipo_cambio"]);
      if (det["tipo_cambio_respaldo"] != "" && det["calculo_respaldo"] == "cuota" && this.validator.filtroCosto(det["tipo_cambio_respaldo"]) == true && det["tipo_cambio_respaldo"] != det["tipo_cambio"]) {
        this.validator.correctoInputRow(event);
      } else {
        this.validator.errorInputRow(event);
      }
      this.validaActualizacionImpuesto();
    }

    keyupImpuestoUpdateMoneda(event:any){
      var det = this.detalleImpuestosArray[0];
      det["monedas_moneda_respaldo"] = event.value;
      var decim_inicial = "";
      for (let i = 0; i < parseInt(this.identidad.moneda_decimales); i++) {decim_inicial = decim_inicial+"0";}
      console.log(event.value);
      for (let i = 0; i < this.catalogo_monedas.length; i++) {
        const money = this.catalogo_monedas[i];
        if (money['moneda'] == det["monedas_moneda_respaldo"]) {
          if (det["monedas_moneda_respaldo"] != "" && this.validator.filtroAlfaNumerico(det["monedas_moneda_respaldo"]) == true) {
            det["monedas_tkn_respaldo"] = money["token_monedas"];
            this.validator.correctoInputRow(event);
            this.validaActualizacionImpuesto();
          } else {
            det["tipo_cambio_respaldo"] = "1."+decim_inicial;
            this.validator.errorInputRow(event);
            this.validaActualizacionImpuesto();
          }
          return;
        } else {
          this.validator.errorInputRow(event);
        }
      }
      this.validaActualizacionImpuesto();
    }

    keyupImpuestoUpdateAplicaSobre(event:any){
      var det = this.detalleImpuestosArray[0];
      det["base_aplicable_respaldo"] = event.value;
      if (det["base_aplicable_respaldo"] != "" && this.validator.filtroAlfaNumerico(det["base_aplicable_respaldo"]) == true && det["base_aplicable_respaldo"] != det["base_aplicable"]) {
        this.validator.correctoInputRow(event);
      } else  {
        this.validator.errorInputRow(event);
      }
      this.validaActualizacionImpuesto();
    }

    keyupImpuestoUpdateDecideDesglose(event:any){
      var det = this.detalleImpuestosArray[0];
      det["desglose_respaldo"] = event.checked == true ? true : false;
      this.validaActualizacionImpuesto();
    }

    keyupImpuestoUpdateGLxPagarOCobrar(event:any){
      var det = this.detalleImpuestosArray[0];
      det["gl_por_pagarcobrar_respaldo"] = event.value;
      if (event.det["gl_por_pagarcobrar_respaldo"] != "" && this.validator.filtroAlfaNumerico(det["gl_por_pagarcobrar_respaldo"]) == true && det["gl_por_pagarcobrar_respaldo"] != det["gl_por_pagarcobrar"]) {
        this.validator.correctoInputRow(event);
      } else  {
        this.validator.errorInputRow(event);
      }
      this.validaActualizacionImpuesto();
    }

    keyupImpuestoUpdateGLEfectivamentePagadaOCobrada(event:any){
      var det = this.detalleImpuestosArray[0];
      det["gl_pagada_o_cobrada_respaldo"] = event.value;
      if (det["gl_pagada_o_cobrada_respaldo"] != "" && this.validator.filtroAlfaNumerico(det["gl_pagada_o_cobrada_respaldo"]) == true && det["gl_pagada_o_cobrada_respaldo"] != det["gl_pagada_o_cobrada"]) {
        this.validator.correctoInputRow(event);
      } else  {
        this.validator.errorInputRow(event);
      }
      this.validaActualizacionImpuesto();
    }

    keyupImpuestoUpdateObsevaciones(event:any){
      var det = this.detalleImpuestosArray[0];
      det["observaciones_respaldo"] = event.value;
      if (det["observaciones_respaldo"] != "" && this.validator.filtroAlfaNumerico(det["observaciones_respaldo"]) == true && det["observaciones_respaldo"] != det["observaciones"]) {
        this.validator.correctoInputRow(event);
      } else  {
        this.validator.errorInputRow(event);
      }
      this.validaActualizacionImpuesto();
    }

    validaActualizacionImpuesto(){
      var det = this.detalleImpuestosArray[0];
      if ((det["modulo_respaldo"] != "" && this.validator.filtroAlfaNumerico(det["modulo_respaldo"]) == true && det["modulo_respaldo"] != det["modulo"]) ||
        (det["nivel_aplicacion_respaldo"] != "" && this.validator.filtroAlfaNumerico(det["nivel_aplicacion_respaldo"]) == true && det["nivel_aplicacion_respaldo"] != det["nivel_aplicacion"]) ||
        (det["catalogo_sat_respaldo"] != '' && this.validator.filtroNum(det["catalogo_sat_respaldo"]) == true && det["catalogo_sat_respaldo"].length == 3 && det["catalogo_sat_respaldo"] != det["catalogo_sat"]) ||

        //(this.impuesto_clave_sat != "" && this.validator.filtroNum(this.impuesto_clave_sat) == true && this.impuesto_clave_sat.length == 3) &&
        (det["tipo_impuesto_respaldo"] != "" && this.validator.filtroAlfaNumerico(det["tipo_impuesto_respaldo"]) == true && det["tipo_impuesto_respaldo"] != det["tipo_impuesto"]) ||
        (det["calculo_respaldo"] != "" && this.validator.filtroAlfaNumerico(det["calculo_respaldo"]) == true && det["calculo_respaldo"] != det["calculo"]) ||
        (det["importe_respaldo"] != "" && det["importe_respaldo"] != det["importe"] && ((det["calculo_respaldo"] == "tasa" && this.validator.filtroPorcentaje(det["importe_respaldo"]) == true) || (det["calculo_respaldo"] == "cuota" && this.validator.filtroCosto(det["importe_respaldo"]) == true))) ||
        (det["tipo_cambio_respaldo"] != "" && det["calculo_respaldo"] == "cuota" && this.validator.filtroCosto(det["tipo_cambio_respaldo"]) == true && det["tipo_cambio_respaldo"] != det["tipo_cambio"]) ||
        (det["monedas_tkn_respaldo"] != "" && det["monedas_tkn_respaldo"] !=  det["monedas_tkn"]) ||
        (det["gl_por_pagarcobrar_respaldo"] != "" && this.validator.filtroAlfaNumerico(det["gl_por_pagarcobrar_respaldo"]) == true && det["gl_por_pagarcobrar_respaldo"] != det["gl_por_pagarcobrar"]) ||
        (det["gl_pagada_o_cobrada_respaldo"] != "" && this.validator.filtroAlfaNumerico(det["gl_pagada_o_cobrada_respaldo"]) == true && det["gl_pagada_o_cobrada_respaldo"] != det["gl_pagada_o_cobrada"]) ||
        (det["base_aplicable_respaldo"] != "" && this.validator.filtroAlfaNumerico(det["base_aplicable_respaldo"]) == true && det["base_aplicable_respaldo"] != det["base_aplicable"]) ||
        (det["desglose_respaldo"] != det["desglose"]) ||
        (det["observaciones_respaldo"] != "" && this.validator.filtroAlfaNumerico(det["observaciones_respaldo"]) == true && det["observaciones_respaldo"] != det["observaciones"])
      ) {
        det["bool_impuestos_update"] = true;
      } else  {
        det["bool_impuestos_update"] = false;
      }
    }

    actualizaImpuesto():void{
      Swal.fire({
        title: this.translate.instant("swal_attenc"),
        text: this.translate.instant("swal_insert"),
        icon: 'warning',
        confirmButtonColor: '#388E3C',
        confirmButtonText: this.translate.instant("swal_yes_insert"),
        showCancelButton: true,
        cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
      }).then((result) => {
        if (result.isConfirmed) {
          this._catImp.actualizarPermImpuestoSelected(
            this.detalleImpuestosArray[0]["token_catalogo_impuesto"]
            ,this.detalleImpuestosArray[0]["modulo_respaldo"]
            ,this.detalleImpuestosArray[0]["nivel_aplicacion_respaldo"]
            ,this.detalleImpuestosArray[0]["catalogo_sat_respaldo"]
            ,this.detalleImpuestosArray[0]["tipo_impuesto_respaldo"]
            ,this.detalleImpuestosArray[0]["calculo_respaldo"]
            ,this.detalleImpuestosArray[0]["importe_respaldo"]
            ,this.detalleImpuestosArray[0]["tipo_cambio_respaldo"]
            ,this.detalleImpuestosArray[0]["monedas_tkn_respaldo"]
            ,this.detalleImpuestosArray[0]["base_aplicable_respaldo"]
            ,this.detalleImpuestosArray[0]["desglose_respaldo"]
            ,this.detalleImpuestosArray[0]["gl_por_pagarcobrar_respaldo"]
            ,this.detalleImpuestosArray[0]["gl_pagada_o_cobrada_respaldo"]
            ,this.detalleImpuestosArray[0]["observaciones_respaldo"]).subscribe(
            response => {
              let translate_response = this.translate.instant(response.message);
              if (response.status == 'success') {
                setTimeout(function(){
                  Swal.fire({
                    position:'center',
                    icon: 'success',
                    title: translate_response,
                    showConfirmButton:false,
                    timer: 3000
                  })
                },1000);
                this.verDetalleImpuesto(this.detalleImpuestosArray[0]["token_catalogo_impuesto"]);
                this.lista_catalogo_general_impuestos();
              }
              if (response.status == 'error') {
                Swal.fire({
                  position:'top-end',
                  icon: 'warning',
                  title: translate_response,
                  showConfirmButton:false,
                  timer: 3000
                })
              }
            },
            error => {
              console.log(error);
            }
          )
        }
      });
    }

    eliminaImpuesto(token_cat_impuestos:any){
      Swal.fire({
        title: this.translate.instant("swal_attenc"),
        text: this.translate.instant("swal_delete"),
        icon: 'warning',
        confirmButtonColor: '#388E3C',
        confirmButtonText: this.translate.instant("swal_yes_delete"),
        showCancelButton: true,
        cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
      }).then((result) => {
        if (result.isConfirmed) {
          this._catImp.papeleraSaveImpuestoSelected(token_cat_impuestos).subscribe(
            response => {
              let translate_response = this.translate.instant(response.message);
              if (response.status == 'success') {
                setTimeout(function(){
                  Swal.fire({
                    position:'center',
                    icon: 'success',
                    title: translate_response,
                    showConfirmButton:false,
                    timer: 3000
                  })
                },1000);
                this.lista_catalogo_general_impuestos();
                this.catalogoGeneralImpuestosFalse();
              }
              if (response.status == 'error') {
                Swal.fire({
                  position:'top-end',
                  icon: 'warning',
                  title: translate_response,
                  showConfirmButton:false,
                  timer: 3000
                })
              }
            },
            error => {
              console.log(error);
            }
          )
        }
      });
    }

    habilitaImpuesto(token_catalogo_impuesto:any){
      Swal.fire({
        title: this.translate.instant("swal_attenc"),
        text: this.translate.instant("swal_update"),
        icon: 'warning',
        confirmButtonColor: '#388E3C',
        confirmButtonText: this.translate.instant("swal_yes_update"),
        showCancelButton: true,
        cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
      }).then((result) => {
        if (result.isConfirmed) {
          this._catImp.enableImpuestoSelected(token_catalogo_impuesto).subscribe(
            response => {
              let translate_response = this.translate.instant(response.message);
              if (response.status == 'success') {
                setTimeout(function(){
                  Swal.fire({
                    position:'center',
                    icon: 'success',
                    title: translate_response,
                    showConfirmButton:false,
                    timer: 3000
                  })
                },1000);
                this.lista_catalogo_general_impuestos();
                this.catalogoGeneralImpuestosEnabled();
              }
              if (response.status == 'error') {
                Swal.fire({
                  position:'top-end',
                  icon: 'warning',
                  title: translate_response,
                  showConfirmButton:false,
                  timer: 3000
                })
              }
            },
            error => {
              console.log(error);
            }
          )
        }
      });
    }

    deshabilitaImpuesto(token_catalogo_impuesto:any){
      Swal.fire({
        title: this.translate.instant("swal_attenc"),
        text: this.translate.instant("swal_update"),
        icon: 'warning',
        confirmButtonColor: '#388E3C',
        confirmButtonText: this.translate.instant("swal_yes_update"),
        showCancelButton: true,
        cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
      }).then((result) => {
        if (result.isConfirmed) {
          this._catImp.disableImpuestoSelected(token_catalogo_impuesto).subscribe(
            response => {
              let translate_response = this.translate.instant(response.message);
              if (response.status == 'success') {
                setTimeout(function(){
                  Swal.fire({
                    position:'center',
                    icon: 'success',
                    title: translate_response,
                    showConfirmButton:false,
                    timer: 3000
                  })
                },1000);
                this.lista_catalogo_general_impuestos();
                this.catalogoGeneralImpuestosEnabled();
              }
              if (response.status == 'error') {
                Swal.fire({
                  position:'top-end',
                  icon: 'warning',
                  title: translate_response,
                  showConfirmButton:false,
                  timer: 3000
                })
              }
            },
            error => {
              console.log(error);
            }
          )
        }
      });
    }

    restauraImpuesto(token_cat_impuestos:any){
      Swal.fire({
        title: this.translate.instant("swal_attenc"),
        text: this.translate.instant("swal_restore"),
        icon: 'warning',
        confirmButtonColor: '#388E3C',
        confirmButtonText: this.translate.instant("swal_yes_restore"),
        showCancelButton: true,
        cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
      }).then((result) => {
        if (result.isConfirmed) {
          this._catImp.restaurarImpuestoSelected(token_cat_impuestos).subscribe(
            response => {
              let translate_response = this.translate.instant(response.message);
              if (response.status == 'success') {
                setTimeout(function(){
                  Swal.fire({
                    position:'center',
                    icon: 'success',
                    title: translate_response,
                    showConfirmButton:false,
                    timer: 3000
                  })
                },1000);
                this.lista_catalogo_general_impuestos();
                this.catalogoGeneralImpuestosFalse();
              }
              if (response.status == 'error') {
                Swal.fire({
                  position:'top-end',
                  icon: 'warning',
                  title: translate_response,
                  showConfirmButton:false,
                  timer: 3000
                })
              }
            },
            error => {
              console.log(error);
            }
          )
        }
      });
    }

    eliminaPermImpuesto(token_cat_impuestos:any){
      Swal.fire({
        title: this.translate.instant("swal_attenc"),
        text: this.translate.instant("swal_delete"),
        icon: 'warning',
        confirmButtonColor: '#388E3C',
        confirmButtonText: this.translate.instant("swal_yes_delete"),
        showCancelButton: true,
        cancelButtonColor: '#D32F2F',
        cancelButtonText: this.translate.instant("swal_cancel"),
      }).then((result) => {
        if (result.isConfirmed) {
          this._catImp.eliminarPermImpuestoSelected(token_cat_impuestos).subscribe(
            response => {
              let translate_response = this.translate.instant(response.message);
              if (response.status == 'success') {
                setTimeout(function(){
                  Swal.fire({
                    position:'center',
                    icon: 'success',
                    title: translate_response,
                    showConfirmButton:false,
                    timer: 3000
                  })
                },1000);
                this.lista_catalogo_general_impuestos();
                this.catalogoGeneralImpuestosFalse();
              }
              if (response.status == 'error') {
                Swal.fire({
                  position:'top-end',
                  icon: 'warning',
                  title: translate_response,
                  showConfirmButton:false,
                  timer: 3000
                })
              }
            },
            error => {
              console.log(error);
            }
          )
        }
      });
    }
}
