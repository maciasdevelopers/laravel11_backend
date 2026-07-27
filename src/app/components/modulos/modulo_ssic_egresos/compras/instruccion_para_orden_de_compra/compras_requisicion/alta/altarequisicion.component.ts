import { Component, OnInit, ElementRef, Renderer2, ViewChild, Input } from '@angular/core';
import { Usuarios } from '../../../../../../../modelos/Usuarios';
import { RequisicionesService } from '../../../../../../../servicios/ssic/requisiciones.service';
import { UniMedServService } from '../../../../../../../servicios/uni-med-serv.service';
import { ProductosService } from '../../../../../../../servicios/ssic/productos.service';
import Swal from 'sweetalert2';
import { ValidatorServService } from '../../../../../../../servicios/validator-serv.service';
import { TranslateService } from '@ngx-translate/core';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { requisicionesModelo } from '../../../../../../../modelos/compras/requisiciones-modelo/requisicionesModelo';
import { SentinelArkManager } from '../../../../../../../servicios/sentinel-ark-manager';
import numeral from 'numeral';
import { Router } from '@angular/router';
import { SessionContextService } from '../../../../../../../servicios/session-context';
@Component({
  selector: 'app_interno_egresos_compras_requisicion_registro',
  templateUrl: './altarequisicion.component.html',
  standalone: false,
  styleUrls: [
    '../../../../../../../styles/colores.css',
    '../../../../../../../styles/datatable.css',
    '../../../../../../../styles/input_group.css',
    '../../../../../../../styles/file_input.css',
    '../../../../../../../styles/buttons.css',
    '../../../../../../../styles/modals.css',
    '../../../../../../../styles/cabecera.css',
    '../../../../../../../styles/pushpin.css',
    '../../../../../../../styles/cards.css',
    '../../../../../../../styles/clientes.css',
    '../../../../../../../styles/collapsible.css',
    '../../../../../../../styles/row.css',
    '../../../../../../../styles/tabs.css',
    '../../../../../../../styles/encabezados.css',
    '../../../../../../../styles/buscador.css',
    '../../../../../../../styles/radioButtons.css',
    '../../../../../../../styles/paginador.css',
    '../../../../../../../styles/loading.css',
    '../../../../../../../styles/navegador.css',
    '../../../../../../../styles/listas_ps.css',
    '../../../../../../../styles/landing.css',
    '../../../../../../../styles/colores.css',
    '../../../../egresos.css',
    './altarequisicion.component.css',
  ],
  providers: [RequisicionesService]
})
export class AltaRequisicionComponent implements OnInit {
  public usuario: Usuarios;
  public identidad: any;
  public requisicionesModelo: requisicionesModelo;

  arrayCompUMedida:any = [];
  arrayProductosVig:any = [];
  arrayListaCaract:any = [];

  searchReq: any;
  url_activa: string = "";
  pageReq: number = 1;
  requisicion_det_content:any = [];
  public docsRequiAnexos:any = [];
  public html_view_documento: any;
  public name_view_documento: string = "";
  public extd_view_documento: string = "";

  searchListReq: any;
  pageListReq: number = 1;

  //registro
  public validaReqTipo: string = "";
  public validaReqNecesidad: string = "";

  public validaReqCaracteristicas:any = [];
  public validaReqCaracterClave: string = "";
  public validaReqCaracterValor: string = "";
  public validaReqCaracterBoolAdd: boolean = false;
  public validaReqOtrasCaracteristicas: string = "";

  public validaReqCantidad: string = "0";
  public validaReqUnidadMedToken: string = "";
  public validaReqUnidadMedName: string = "";
  public validaReqMarca: string = "";
  requisicion_selected:any = [];

  detalle_requisicion:any = [];
  public requisicion_tkn: string = "";
  public requisicion_token_detalle: string = "";
  public validaReqBoolAdd: boolean = false;
  public vistaPartidas: boolean = true;
  public filesPartidaByList: NgxFileDropEntry[] = [];
  public filesPartidaAnexos: any[] = [];
  public filesPartidaNames:any = [];

  public filesPartidaAltaWithDocs: NgxFileDropEntry[] = [];

  @ViewChild('btnaddRegCompra') btnaddRegCompra: ElementRef = {} as ElementRef;

  constructor(
    private sentinela: SentinelArkManager,
    private validator: ValidatorServService,
    private _prodService: ProductosService,
    private _reqService: RequisicionesService,
    private _medidasCat: UniMedServService,
    private sessionContext: SessionContextService,
    private translate: TranslateService,
    private router:Router
  ) {
    this.usuario = new Usuarios(1,"","","","","","","",1,1,"","","","");
    this.requisicionesModelo = new requisicionesModelo("", "", "", [], [], []);
    this.identidad = this.sentinela.getIdentifUsuario();
  }

  ngOnInit(): void {
    this.url_activa = this.router.url;

    this._prodService.productosCatGeneral('all_partidas','','').subscribe(
      response => {
        if (response.status == 'success') {
          this.arrayProductosVig = response.datosProducto;
        }
      },
      error => {
        console.log(error);
      }
    );

    this._reqService.listaCaracteristicas().subscribe(
      response => {
        if (response.status == 'success') {
          this.arrayListaCaract = response.requisiciones;
        }
      }, error => { console.log(error); }
    )

    this._medidasCat.getApiUniMedCatalogo().subscribe(
      response => {
        if (response.status == 'success') {
          //console.log(response.listMedidas);
          this.arrayCompUMedida = response.unidades_medida;
          console.log(this.arrayCompUMedida);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  get permiso_crear() {
    return this.sessionContext.privilegio_crear;
  }

  cerrarModal(modal: any) {
    $(modal).removeClass("open");
  }

  //registro
  validaProyName(event: any) {
    if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
      this.requisicionesModelo.proyecto = event.value;
      this.validator.correctoInputRow(event);
    } else {
      this.requisicionesModelo.proyecto = "";
      this.validator.errorInputRow(event);
    }
  }

  validaProyPrioridad(event: any) {
    if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
      this.requisicionesModelo.prioridad = event.value;
      this.validator.correctoSelectBrowser(event);
    } else {
      this.requisicionesModelo.prioridad = "";
      this.validator.errorSelectBrowser(event);
    }
  }

  validaProyJustificacion(event: any) {
    if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
      this.requisicionesModelo.justificacion = event.value;
      this.validator.correctoTextarea(event, "Justificación");
    } else {
      this.requisicionesModelo.justificacion = "";
      this.validator.errorTextarea(event, "Error en Justificación");
    }
  }

  validaProyTipoReq(event: any) {
    if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
      this.validaReqTipo = event.value;
      this.validator.correctoSelectBrowser(event);
    } else {
      this.validaReqTipo = "";
      this.validator.errorSelectBrowser(event);
    }
    this.validatePartidaReqNew();
  }

  validaProyNecesidadReq(event: any) {
    if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
      this.validaReqNecesidad = event.value;
      this.validator.correctoInputRow(event);
    } else {
      this.validaReqNecesidad = "";
      this.validator.errorInputRow(event);
    }
    this.validatePartidaReqNew();
  }

  validaProyNecesidadCaractReqClave(event: any) {
    if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
      this.validaReqCaracterClave = event.value;
      this.validator.correctoSelectBrowser(event);
      //writeCaractValorReq
      var writeCaractValorReq: any = document.getElementById("writeCaractValorReqNew");
      writeCaractValorReq.type = event.value == "Precio" ? "number" : "text";
    } else {
      this.validaReqCaracterClave = "";
      this.validator.errorSelectBrowser(event);
    }
    this.validateCaractPartida();
  }

  validaProyNecesidadCaractReqValor(event: any) {
    if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
      this.validaReqCaracterValor = event.value;
      this.validator.correctoInputRow(event);
    } else {
      this.validaReqCaracterValor = "";
      this.validator.errorInputRow(event);
    }
    this.validateCaractPartida();
  }

  validateCaractPartida() {
    var selectCaractClaveReq: any = document.getElementById("selectCaractClaveReq");
    var writeCaractValorReq: any = document.getElementById("writeCaractValorReqNew");
    if ((this.validaReqCaracterClave != "" && this.validator.filtroAlfaNumerico(this.validaReqCaracterClave) == true) &&
      (this.validaReqCaracterValor != "" && this.validator.filtroAlfaNumerico(this.validaReqCaracterValor) == true)) {
      this.validaReqCaracterBoolAdd = true;
    } else {
      this.validaReqCaracterBoolAdd = false;
      if (this.validaReqCaracterClave == "" || this.validator.filtroAlfaNumerico(this.validaReqCaracterClave) == false) {
        this.validator.errorSelectBrowser(selectCaractClaveReq);
      }

      if (this.validaReqCaracterValor == "" || this.validator.filtroAlfaNumerico(this.validaReqCaracterValor) == false) {
        this.validator.errorInputRow(writeCaractValorReq);
      }
    }
  }

  addCaractPartida() {
    var selectCaractClaveReq: any = document.getElementById("selectCaractClaveReq");
    var writeCaractValorReq: any = document.getElementById("writeCaractValorReqNew");
    if ((this.validaReqCaracterClave != "" && this.validator.filtroAlfaNumerico(this.validaReqCaracterClave) == true) &&
      (this.validaReqCaracterValor != "" && this.validator.filtroAlfaNumerico(this.validaReqCaracterValor) == true)) {
      var id_caract = this.validaReqCaracteristicas.length + 1;
      var valorFront = "";

      if (this.validaReqCaracterClave == "Precio") { valorFront = numeral(this.validaReqCaracterValor).format('$0,0.00'); }
      if (this.validaReqCaracterClave == "Color") { valorFront = this.validaReqCaracterValor; }
      if (this.validaReqCaracterClave == "Tamaño") { valorFront = this.validaReqCaracterValor; }
      if (this.validaReqCaracterClave == "Talla") { valorFront = this.validaReqCaracterValor; }
      if (this.validaReqCaracterClave == "Material") { valorFront = this.validaReqCaracterValor; }
      if (this.validaReqCaracterClave == "Tipo") { valorFront = this.validaReqCaracterValor; }
      if (this.validaReqCaracterClave == "Forma") { valorFront = this.validaReqCaracterValor; }
      if (this.validaReqCaracterClave == "Peso (Kg)") { valorFront = this.validaReqCaracterValor; }
      if (this.validaReqCaracterClave == "Altura (Mts)") { valorFront = this.validaReqCaracterValor; }
      if (this.validaReqCaracterClave == "Textura") { valorFront = this.validaReqCaracterValor; }

      this.validaReqCaracteristicas.push({ "clave": this.validaReqCaracterClave, "valorFront": valorFront, "valorBack": this.validaReqCaracterValor });
      this.validaReqCaracterClave = "";
      this.validator.limpiaSelect(selectCaractClaveReq);
      this.validaReqCaracterValor = "";
      this.validator.limpiaInputRow(writeCaractValorReq);
      writeCaractValorReq.type = "text";
    } else {
      if (this.validaReqCaracterClave == "" || this.validator.filtroAlfaNumerico(this.validaReqCaracterClave) == false) {
        this.validator.errorSelectBrowser(selectCaractClaveReq);
      }

      if (this.validaReqCaracterValor == "" || this.validator.filtroAlfaNumerico(this.validaReqCaracterValor) == false) {
        this.validator.errorInputRow(writeCaractValorReq);
      }
    }
  }

  deleteCaractPartida(posicion: any) {
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
        for (let i = 0; i < this.validaReqCaracteristicas.length; i++) {
          const carRow = this.validaReqCaracteristicas[i];
          if (carRow["id_caract"] == posicion) {
            this.validaReqCaracteristicas.splice(i, 1);
          }
        }
      }
    });
  }

  validaProyNecesidadCaractOtrasValor(event: any) {
    if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
      this.validaReqOtrasCaracteristicas = event.value;
      this.validator.correctoTextarea(event, "Otras características");
    } else {
      this.validaReqOtrasCaracteristicas = "";
      this.validator.errorTextarea(event, "Error en otras características");
    }
  }

  validaProyCantidadReq(event: any) {
    if (event.value != "" && this.validator.filtroNum(event.value) == true) {
      this.validaReqCantidad = event.value;
      this.validator.correctoInputRow(event);
    } else {
      this.validaReqCantidad = "0";
      this.validator.errorInputRow(event);
    }
    this.validatePartidaReqNew();
  }

  validaProyUnidadMedidaReq(event: any) {
    let med = this.arrayCompUMedida.find((row:any) => row.nombre === event.value);
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value) && typeof med !== 'undefined';
    this.validaReqUnidadMedName = validacion ? med.nombre : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
    validacion ? this.validatePartidaReqNew() : null;
    //this.validaReqUnidadMedToken = row["token_unidad_medida"];row["unidad_medida"] + " clave " + row["sat_clave"] + " representa " + row["representa"];
  }

  validaProyMarcaReq(event: any) {
    if (event.value != "" && this.validator.filtroAlfaNumerico(event.value)) {
      this.validaReqMarca = event.value;
      this.validator.correctoInputRow(event);
    } else {
      this.validaReqMarca = "";
      this.validator.errorInputRow(event);
    }
    this.validatePartidaReqNew();
  }

  validatePartidaReqNew() {
    var selectTipoReq: any = document.getElementById("selectTipoReq");
    var req_necesidad: any = document.getElementById("req_necesidad");
    var req_cantidad: any = document.getElementById("req_cantidad");
    var req_uMedida: any = document.getElementById("req_uMedida");
    var req_marca: any = document.getElementById("req_marca");
    var req_otras_caract: any = document.getElementById("req_otras_caract");

    const valida_ReqTipo = this.validaReqTipo != "" && this.validator.filtroAlfaNumerico(this.validaReqTipo) == true; 
    const valida_ReqNecesidad = this.validaReqNecesidad != "" && this.validator.filtroAlfaNumerico(this.validaReqNecesidad) == true;
    const valida_ReqCantidad = this.validaReqCantidad != "" && this.validaReqCantidad != "0" && this.validator.filtroNum(this.validaReqCantidad) == true;
    const valida_ReqUnidadMed = this.validaReqUnidadMedName != "" && this.validator.filtroAlfaNumerico(this.validaReqUnidadMedName) == true; //this.validaReqUnidadMedToken != "" 

    if (valida_ReqTipo && valida_ReqNecesidad && valida_ReqCantidad && valida_ReqUnidadMed) {
      const valida_marca = this.validaReqMarca == "" || (this.validaReqMarca != "" && this.validator.filtroAlfaNumerico(this.validaReqMarca) == true);
      const valida_caracteristicas = this.validaReqOtrasCaracteristicas == "" || (this.validaReqOtrasCaracteristicas != "" && this.validator.filtroAlfaNumerico(this.validaReqOtrasCaracteristicas) == true);

      this.validaReqBoolAdd = valida_marca && valida_caracteristicas ? true : false;
      if (!valida_marca) {
        this.validator.errorInputRow(req_marca);
      }
      if (!valida_caracteristicas) {
        this.validator.errorTextarea(req_otras_caract, "Error en otras características");
      }
    } else {
      this.validaReqBoolAdd = false;
      if (!valida_ReqTipo) {
        this.validator.errorSelectBrowser(selectTipoReq);
      }

      if (!valida_ReqNecesidad) {
        this.validator.errorInputRow(req_necesidad);
      }

      if (!valida_ReqCantidad) {
        this.validator.errorInputRow(req_cantidad);
      }

      if (!valida_ReqUnidadMed) {
        this.validator.errorInputRow(req_uMedida);
      }
    }
  }

  addPartidaReqNew() {
    this.vistaPartidas = false;
    var selectTipoReq: any = document.getElementById("selectTipoReq");
    var req_necesidad: any = document.getElementById("req_necesidad");
    var req_otras_caract: any = document.getElementById("req_otras_caract");
    var req_cantidad: any = document.getElementById("req_cantidad");
    var req_uMedida: any = document.getElementById("req_uMedida");
    var req_marca: any = document.getElementById("req_marca");

    const valida_ReqTipo = this.validaReqTipo != "" && this.validator.filtroAlfaNumerico(this.validaReqTipo) == true; 
    const valida_ReqNecesidad = this.validaReqNecesidad != "" && this.validator.filtroAlfaNumerico(this.validaReqNecesidad) == true;
    const valida_ReqCantidad = this.validaReqCantidad != "" && this.validaReqCantidad != "0" && this.validator.filtroNum(this.validaReqCantidad) == true;
    const valida_ReqUnidadMed = this.validaReqUnidadMedName != "" && this.validator.filtroAlfaNumerico(this.validaReqUnidadMedName) == true; //this.validaReqUnidadMedToken != "" 

    if (valida_ReqTipo && valida_ReqNecesidad && valida_ReqCantidad && valida_ReqUnidadMed) {
      switch (this.validaReqTipo) {
        case "Merc":
          var requi_tipo_front = "Mercancia";
          break;
        case "Gast":
          var requi_tipo_front = "Gastos";
          break;
        case "Acti":
          var requi_tipo_front = "Activos";
          break;
        case "Mixt":
          var requi_tipo_front = "Mixto";
          break;  
        default:
          var requi_tipo_front = "";
          break;
      }

      var requi_necesidad_caracteristicas:any = [];

      for (let i = 0; i < this.validaReqCaracteristicas.length; i++) {
        const row = this.validaReqCaracteristicas[i];
        requi_necesidad_caracteristicas.push({ "clave": row["clave"], "valorFront": row["valorFront"], "valorBack": row["valorBack"] });
      }

      console.log(requi_necesidad_caracteristicas);
      var requi_marca_front = "";
      if (this.validaReqMarca != "" && this.validator.filtroAlfaNumerico(this.validaReqMarca) == true) {
        requi_marca_front = this.validaReqMarca;
      } else {
        requi_marca_front = "no hay marca referida";
      }

      var index_inicial = this.requisicionesModelo.lista_articulos.length;
      this.requisicionesModelo.lista_articulos.push({
        "index_lista_req": index_inicial + 1,
        "requi_tipo_front": requi_tipo_front,
        "requi_tipo_back": this.validaReqTipo,
        "requi_necesidad": this.validaReqNecesidad,
        "requi_necesidad_caracteristicas": requi_necesidad_caracteristicas,
        "requi_necesidad_otras_caracteristicas": this.validaReqOtrasCaracteristicas,
        "requi_cantidad": this.validaReqCantidad,
        "requi_uni_med_front": this.validaReqUnidadMedName,
        "requi_uni_med_back": this.validaReqUnidadMedToken,
        "requi_marca_front": requi_marca_front,
        "requi_marca_back": this.validaReqMarca,
        "filesPartidaBool": false,
        "archivosPartida": [],
      });

      var index_final = this.requisicionesModelo.lista_articulos.length;
      console.log("index_inicial " + index_inicial + " index_final " + index_final);

      console.log(this.requisicionesModelo.lista_articulos);
      this.validaReqTipo = "";
      this.validator.limpiaSelect(selectTipoReq);
      this.validaReqNecesidad = "";
      this.validator.limpiaInputRow(req_necesidad);
      this.validaReqCaracteristicas.length = 0;
      this.validaReqOtrasCaracteristicas = "";
      this.validator.limpiaTextareaWithLabel(req_otras_caract);
      this.validaReqCantidad = "0";
      this.validator.limpiaInputRow(req_cantidad);
      this.validaReqUnidadMedName = "";
      this.validaReqUnidadMedToken = "";
      this.validator.limpiaInputRow(req_uMedida);
      this.validaReqMarca = "";
      this.validator.limpiaInputRow(req_marca);
      this.vistaPartidas = true;
    } else {
      this.validaReqBoolAdd = false;
      if (!valida_ReqTipo) {
        this.validator.errorSelectBrowser(selectTipoReq);
      }

      if (!valida_ReqNecesidad) {
        this.validator.errorInputRow(req_necesidad);
      }

      if (!valida_ReqCantidad) {
        this.validator.errorInputRow(req_cantidad);
      }

      if (!valida_ReqUnidadMed) {
        this.validator.errorInputRow(req_uMedida);
      }
    }
  }

  seleccionaPartidaReq(index_lista_req: any) {
    console.log(index_lista_req);
    this.requisicion_selected = [];
    for (let i = 0; i < this.requisicionesModelo.lista_articulos.length; i++) {
      const row = this.requisicionesModelo.lista_articulos[i];
      console.log(row["index_lista_req"]);
      if (row["index_lista_req"] == index_lista_req) {
        this.requisicion_selected.push(row);
        console.log(this.requisicion_selected);
        this.partidaForReq();
      }
    }
  }

  partidaForReq() {
    for (let i = 0; i < this.requisicion_selected.length; i++) {
      const row = this.requisicion_selected[i];
    }
  }

  deletePartidaReqNew(posicion: any) {
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
        this.requisicionesModelo.lista_articulos.splice(posicion, 1);
      }
    });
  }

  limpiaRequisicionList() {
    this.validator.limpiaInput(document.getElementById("reqProyecto"));
    this.validator.limpiaSelect(document.getElementById("selectPrioridadReq"));
    this.requisicionesModelo.proyecto = "";
    this.requisicionesModelo.prioridad = "";
    this.requisicionesModelo.lista_articulos = [];
    $("#listaPartidasReqNew").removeClass("disabledContentWhite");
  }

  registraRequisicionList() {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea eliminar el archivo seleccionado?",
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_delete"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          this._reqService.registraRequisicionByListModulo(this.requisicionesModelo.proyecto, this.requisicionesModelo.prioridad, this.requisicionesModelo.justificacion, this.requisicionesModelo.lista_articulos).subscribe(
            response => {
              let translate_response = this.translate.instant(response.message);
              if (response.status == 'success') {
                this.requisicion_tkn = response.requisicion_identificador;
                this.requisicion_detalle(response.requisicion_identificador);
                //this.limpiaRequisicionList();
                setTimeout(function () {
                  Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: translate_response,
                    showConfirmButton: false,
                    timer: 3000
                  })
                }, 3000);
                window.open(response.pdflink, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
              }
              if (response.status == 'error') {
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
      }
    );
  }

  requisicion_detalle(token_requisicion: any) {
    this._reqService.detalleRequisicion(token_requisicion).subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response);
          this.detalle_requisicion = response.desglose_true;
          console.log(this.detalle_requisicion);
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

  selectDataCargarDocs(token_detalle_requisicion: any) {
    this.requisicion_token_detalle = token_detalle_requisicion;
  }

  public droppedPartida(files: NgxFileDropEntry[]) {
    this.filesPartidaByList = files;
    this.filesPartidaAnexos = [];
    this.filesPartidaNames = [];
    for (let i = 0; i < files.length; i++) {
      const droppedFile = files[i]
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          console.log(droppedFile.fileEntry, file);
          //this.filesPartidaAnexos.push(file,droppedFile.relativePath);
          var nameFile = file.name;
          if (file.size <= 2000000 && this.validator.filtroTipoArchivo(file.type) == true) {
            this.filesPartidaNames.push({ "typoElement": this.validator.devuelveTipoArchivo(file.type), "nameFile": nameFile });
            this.filesPartidaAnexos.push(file);
          } else {
            let mensajeError = '';
            if (file.size > 2000000) {
              mensajeError = 'El archivo ' + nameFile + ' excede el tamaño permitido (2MB)';
            }
            if (this.validator.filtroTipoArchivo(file.type) == false) {
              mensajeError = 'El archivo ' + nameFile + ' debe ser en formato pdf, xml, png o jpg';
            }
            Swal.fire({
              position: 'top-end',
              icon: 'warning',
              title: mensajeError,
              showConfirmButton: false,
              timer: 3000
            })
            this.filesPartidaByList.splice(i, 1);
            this.filesPartidaAnexos.splice(i, 1);
            this.filesPartidaNames.splice(i, 1);
            return;
          }
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  public fileOverPartida(event: any) {
    console.log(event);
  }

  public fileLeavePartida(event: any) {
    console.log(event);
  }

  deleteAnexosPartida(posicion: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea eliminar el archivo Seleccionedo?",
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_delete"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          this.filesPartidaByList.splice(posicion, 1);
          this.filesPartidaAnexos.splice(posicion, 1);
          this.filesPartidaNames.splice(posicion, 1);
          console.log(this.filesPartidaAnexos.length);
        }
      }
    );
  }

  viewDocumento(event: any) {
    window.open(event.value, '_blank');
  }

  terminar_registro() {
    this.detalle_requisicion = [];
    this.limpiaRequisicionList();
  }

  loadDocsRequisicionPartida(requisicion: any, partida: any) {
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
        if (this.filesPartidaAnexos.length > 0) {
          this._reqService.requisicion_load_docs(this.filesPartidaAnexos, this.filesPartidaNames, requisicion, partida).subscribe(
            response => {
              let translate_response = this.translate.instant(response.message);
              if (response.status == 'success') {
                setTimeout(function () {
                  Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: translate_response,
                    showConfirmButton: false,
                    timer: 3000
                  })
                }, 1000);
                this.requisicion_detalle(requisicion);
              }
              if (response.status == 'error') {
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
              //console.log(error);
            }
          )
        }
      }
    })
  }

  //registro con solo documentos

  public dropped(files: NgxFileDropEntry[]) {
    this.filesPartidaAltaWithDocs = files;
    for (let i = 0; i < files.length; i++) {
      const droppedFile = files[i]
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          console.log(droppedFile.fileEntry, file);
          //this.informesModelo.informe_evidencias_files.push(file,droppedFile.relativePath);
          this.requisicionesModelo.requisicion_documento.push(file);
          var typoElement = file.type;
          var nameFile = file.name;
          console.log(typoElement + " " + nameFile)

          //typoElement != 'application/msword' &&
          //typoElement != 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' &&
          //typoElement != 'application/vnd.openxmlformats-officedocument.wordprocessingml.template' &&
          //typoElement != 'application/vnd.ms-word.document.macroEnabled.12' &&
          //typoElement != 'application/vnd.ms-word.template.macroEnabled.12' &&
          //typoElement != 'application/vnd.ms-excel' &&
          //typoElement != 'application/vnd.ms-excel' &&
          //typoElement != 'application/vnd.ms-excel' &&
          //typoElement != 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' &&
          //typoElement != 'application/vnd.openxmlformats-officedocument.spreadsheetml.template' &&
          //typoElement != 'application/vnd.ms-excel.sheet.macroEnabled.12' &&
          //typoElement != 'application/vnd.ms-excel.template.macroEnabled.12' &&
          //typoElement != 'application/vnd.ms-excel.addin.macroEnabled.12' &&
          //typoElement != 'application/vnd.ms-excel.sheet.binary.macroEnabled.12' &&
          //typoElement != 'application/vnd.ms-powerpoint' &&
          //typoElement != 'application/vnd.openxmlformats-officedocument.presentationml.presentation' &&
          //typoElement != 'application/vnd.openxmlformats-officedocument.presentationml.template' &&
          //typoElement != 'application/vnd.openxmlformats-officedocument.presentationml.slideshow' &&
          //typoElement != 'application/vnd.ms-powerpoint.addin.macroEnabled.12' &&
          //typoElement != 'application/vnd.ms-powerpoint.presentation.macroEnabled.12' &&
          //typoElement != 'application/vnd.ms-powerpoint.template.macroEnabled.12' &&
          //typoElement != 'application/vnd.ms-powerpoint.slideshow.macroEnabled.12' &&
          //typoElement != 'application/vnd.ms-access' &&

          if (file.size > 2000000 || (
            typoElement != 'application/msword' &&
            typoElement != 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' &&
            typoElement != 'application/vnd.openxmlformats-officedocument.wordprocessingml.template' &&
            typoElement != 'application/vnd.ms-word.document.macroEnabled.12' &&
            typoElement != 'application/vnd.ms-word.template.macroEnabled.12' &&
            typoElement != 'application/vnd.ms-excel' &&
            typoElement != 'application/vnd.ms-excel' &&
            typoElement != 'application/vnd.ms-excel' &&
            typoElement != 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' &&
            typoElement != 'application/vnd.openxmlformats-officedocument.spreadsheetml.template' &&
            typoElement != 'application/vnd.ms-excel.sheet.macroEnabled.12' &&
            typoElement != 'application/vnd.ms-excel.template.macroEnabled.12' &&
            typoElement != 'application/vnd.ms-excel.addin.macroEnabled.12' &&
            typoElement != 'application/vnd.ms-excel.sheet.binary.macroEnabled.12' &&
            typoElement != 'application/vnd.ms-powerpoint' &&
            typoElement != 'application/vnd.openxmlformats-officedocument.presentationml.presentation' &&
            typoElement != 'application/vnd.openxmlformats-officedocument.presentationml.template' &&
            typoElement != 'application/vnd.openxmlformats-officedocument.presentationml.slideshow' &&
            typoElement != 'application/vnd.ms-powerpoint.addin.macroEnabled.12' &&
            typoElement != 'application/vnd.ms-powerpoint.presentation.macroEnabled.12' &&
            typoElement != 'application/vnd.ms-powerpoint.template.macroEnabled.12' &&
            typoElement != 'application/vnd.ms-powerpoint.slideshow.macroEnabled.12' &&
            typoElement != 'application/vnd.ms-access' &&
            typoElement != 'application/pdf' && typoElement != 'image/jpeg' && typoElement != 'image/jpg' && typoElement != 'image/png')) {
            let mensajeError = '';
            if (file.size > 2000000) {
              mensajeError = 'El archivo ' + nameFile + ' excede el tamaño permitido (2MB)';
            }
            if (typoElement != 'application/msword' &&
              typoElement != 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' &&
              typoElement != 'application/vnd.openxmlformats-officedocument.wordprocessingml.template' &&
              typoElement != 'application/vnd.ms-word.document.macroEnabled.12' &&
              typoElement != 'application/vnd.ms-word.template.macroEnabled.12' &&
              typoElement != 'application/vnd.ms-excel' &&
              typoElement != 'application/vnd.ms-excel' &&
              typoElement != 'application/vnd.ms-excel' &&
              typoElement != 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' &&
              typoElement != 'application/vnd.openxmlformats-officedocument.spreadsheetml.template' &&
              typoElement != 'application/vnd.ms-excel.sheet.macroEnabled.12' &&
              typoElement != 'application/vnd.ms-excel.template.macroEnabled.12' &&
              typoElement != 'application/vnd.ms-excel.addin.macroEnabled.12' &&
              typoElement != 'application/vnd.ms-excel.sheet.binary.macroEnabled.12' &&
              typoElement != 'application/vnd.ms-powerpoint' &&
              typoElement != 'application/vnd.openxmlformats-officedocument.presentationml.presentation' &&
              typoElement != 'application/vnd.openxmlformats-officedocument.presentationml.template' &&
              typoElement != 'application/vnd.openxmlformats-officedocument.presentationml.slideshow' &&
              typoElement != 'application/vnd.ms-powerpoint.addin.macroEnabled.12' &&
              typoElement != 'application/vnd.ms-powerpoint.presentation.macroEnabled.12' &&
              typoElement != 'application/vnd.ms-powerpoint.template.macroEnabled.12' &&
              typoElement != 'application/vnd.ms-powerpoint.slideshow.macroEnabled.12' &&
              typoElement != 'application/vnd.ms-access' &&
              typoElement != 'application/pdf' && typoElement != 'image/jpeg' && typoElement != 'image/jpg' && typoElement != 'image/png') {
              mensajeError = 'El archivo ' + nameFile + ' debe ser en formato pdf, jpg, png o paqueteria office';
            }
            Swal.fire({
              position: 'top-end',
              icon: 'warning',
              title: mensajeError,
              showConfirmButton: false,
              timer: 3000
            })
            this.requisicionesModelo.requisicion_documento.splice(i, 1);
            this.filesPartidaAltaWithDocs.splice(i, 1);
            return;
          }

        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  public fileOver(event: any) {
    console.log(event);
  }

  public fileLeave(event: any) {
    console.log(event);
  }

  deleteEvidencias(posicion: any) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea eliminar el archivo seleccionado?",
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_delete"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          this.requisicionesModelo.requisicion_documento.splice(posicion, 1);
          this.filesPartidaAltaWithDocs.splice(posicion, 1);
          console.log(this.requisicionesModelo.requisicion_documento.length);
        }
      }
    );
  }

  registraRequisicionByDocs() {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea eliminar el archivo seleccionado?",
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_delete"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
        }
      }
    );
  }
}
