import { ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import { Usuarios } from '../../../../../modelos/Usuarios';
import { SentinelArkManager } from '../../../../../servicios/sentinel-ark-manager';
import { TranslateService } from '@ngx-translate/core';
import Swal from "sweetalert2";
import '../../../../../../assets/js/zxcvbn.js';
import { RegimenFiscalService } from '../../../../../servicios/regimen-fiscal.service';
import { ValidatorServService } from '../../../../../servicios/validator-serv.service';
import { DireccionesService } from '../../../../../servicios/ssic/direcciones.service';
import { PaisService } from '../../../../../servicios/ssic/pais.service';
import { ProveedoresService } from '../../../../../servicios/proveedores.service';
import { CargaPaginaService } from '../../../../../servicios/carga-pagina.service';
import { SessionContextService } from '../../../../../servicios/session-context';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'out_compras_proveedor_listado',
  templateUrl: './cotizaciones_proveedores_listado.component.html',
  standalone:false,
  styleUrls: [
    './cotizaciones_proveedores_listado.component.css',
    '../../compras.css',
    '../../../../../styles/explain.css',
    '../../../../../styles/colores.css',
    '../../../../../styles/listas_ps.css',
    '../../../../../styles/datatable.css',
    '../../../../../styles/input_group.css',
    '../../../../../styles/file_input.css',
    '../../../../../styles/buttons.css',
    '../../../../../styles/modals.css',
    '../../../../../styles/cabecera.css',
    '../../../../../styles/proveedores.css',
    '../../../../../styles/collapsible.css',
    '../../../../../styles/tabs.css',
    '../../../../../styles/cards.css',
    '../../../../../styles/row.css',
    '../../../../../styles/encabezados.css',
    '../../../../../styles/buscador.css',
    '../../../../../styles/radioButtons.css',
    '../../../../../styles/paginador.css',
    '../../../../../styles/loading.css',
    '../../../../../styles/navegador.css',
    '../../../../../styles/listas_ps.css',
    '../../../../../styles/landing.css',
    '../../../../../styles/colores.css',
  ]
})
export class CotizacionesProveedoresListadoComponent implements OnInit, OnDestroy {
  public usuario: Usuarios;
  public identidad: any;
  optionTool = {"placement":"top"};

  //listas
    searchProv:any;
    pageProv: number = 1;
    proveedores_catalogo_general:any = [];
    indicador_proveedores_general:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
    rangoPeriodoProveedoresGeneral: Date[] | undefined;

    proveedores_catalogo_mx:any = [];
    indicador_proveedores_mx:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
    rangoPeriodoProveedoresMX: Date[] | undefined;
    
    proveedores_catalogo_ext:any = [];
    indicador_proveedores_ext:'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas' = 'hoy';
    rangoPeriodoProveedoresEXT: Date[] | undefined;

    proveedor_detalle:any = [];
    options = {};

  private destruir$ = new Subject<void>();

  constructor(
    private sentinela:SentinelArkManager,
    private translate:TranslateService,
    private _regimen:RegimenFiscalService,
    private validator:ValidatorServService,
    private dirServ:DireccionesService,
    private sessionContext: SessionContextService,
    public _pais:PaisService,
    private loadPageServ: CargaPaginaService,
    public proveedorServ: ProveedoresService,
    private cd: ChangeDetectorRef
  ) {
    this.identidad = this.sentinela.getIdentifUsuario();
    this.usuario = new Usuarios(1,"","","","","","","",1,1,"","","","");
  }

  ngOnInit(): void {
    this.loadPageServ.comienza_contador_carga();
    this.lista_proveedores('hoy');
    this.lista_proveedores_mx('hoy');
    this.lista_proveedores_ext('hoy');
    this.listen();
  }

  get privilegio_consulta() {
    return this.sessionContext.privilegio_consulta;
  }

  cerrarModal(modal:any){
    $(modal).removeClass("open");
  }

  listen(){
    //const messaging = getMessaging();
    //onMessage(messaging, (payload) => {this.lista_proveedores();});
  }

  //listas
    recargar_lista_proveedores() {
      this.lista_proveedores(this.indicador_proveedores_general);
    }
  
    lista_proveedores(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas') {
      this.indicador_proveedores_general = filtro;
      let periodo_inicio = '';
      let periodo_fin = '';
  
      if (filtro == 'otras_fechas') {
        var prov_gral_otras_fechas = document.getElementById("prov_gral_otras_fechas");
        if (this.rangoPeriodoProveedoresGeneral && this.rangoPeriodoProveedoresGeneral.length === 2) {
          const dateInicio = this.rangoPeriodoProveedoresGeneral[0];
          const dateFin = this.rangoPeriodoProveedoresGeneral[1];
          if (dateInicio && dateFin) {
            const validacionInicio = this.validator.filtroFecha(dateInicio.toISOString().split('T')[0]);
            const validacionFin = this.validator.filtroFecha(dateFin.toISOString().split('T')[0]);
            if (validacionInicio && validacionFin) {
              periodo_inicio = dateInicio.toISOString().split('T')[0];
              periodo_fin = dateFin.toISOString().split('T')[0];
              this.validator.correctoInputRow(prov_gral_otras_fechas);
            } else {
              this.validator.errorInputRow(prov_gral_otras_fechas);
              return;
            }
          } else {
            this.validator.errorInputRow(prov_gral_otras_fechas);
            return;
          }
        } else {
          this.validator.errorInputRow(prov_gral_otras_fechas);
          return;
        }
      }
  
      this.proveedorServ.catalogoProveedoresGeneral(filtro,periodo_inicio,periodo_fin).pipe(takeUntil(this.destruir$)).subscribe({
        next: (response) => this.procesarRespuestaGralProv(response),
        error: (err) => this.manejarErrorGralProv(err)
      });
    }
    
    private procesarRespuestaGralProv(response: any) {
      if (response.status === 'success') {
        response.proveedores.sort((a: any, b: any) => a.nombre.localeCompare(b.nombre));
        this.proveedores_catalogo_general = response.proveedores;
        this.cd.detectChanges();
      } else {
        this.proveedores_catalogo_general = [];
      }
    }
  
    private manejarErrorGralProv(error: any) {
      console.error('Error al cargar la lista de proveedores:', error);
      this.proveedores_catalogo_general = [];
    }
    
    recargar_proveedores_mx() {
      this.lista_proveedores_mx(this.indicador_proveedores_mx);
    }
  
    lista_proveedores_mx(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas') {
      this.indicador_proveedores_mx = filtro;
      let periodo_inicio = '';
      let periodo_fin = '';
  
      if (filtro == 'otras_fechas') {
        var mx_prov_otras_fechas = document.getElementById("mx_prov_otras_fechas");
        if (this.rangoPeriodoProveedoresMX && this.rangoPeriodoProveedoresMX.length === 2) {
          const dateInicio = this.rangoPeriodoProveedoresMX[0];
          const dateFin = this.rangoPeriodoProveedoresMX[1];
          if (dateInicio && dateFin) {
            const validacionInicio = this.validator.filtroFecha(dateInicio.toISOString().split('T')[0]);
            const validacionFin = this.validator.filtroFecha(dateFin.toISOString().split('T')[0]);
            if (validacionInicio && validacionFin) {
              periodo_inicio = dateInicio.toISOString().split('T')[0];
              periodo_fin = dateFin.toISOString().split('T')[0];
              this.validator.correctoInputRow(mx_prov_otras_fechas);
            } else {
              this.validator.errorInputRow(mx_prov_otras_fechas);
              return;
            }
          } else {
            this.validator.errorInputRow(mx_prov_otras_fechas);
            return;
          }
        } else {
          this.validator.errorInputRow(mx_prov_otras_fechas);
          return;
        }
      }
  
      this.proveedorServ.catalogoProveedoresMX(filtro,periodo_inicio,periodo_fin).pipe(takeUntil(this.destruir$)).subscribe({
        next: (response) => this.procesarRespuestaMXPRVList(response),
        error: (err) => this.manejarErrorMXPRVList(err)
      });
    }
    
    private procesarRespuestaMXPRVList(response: any) {
      if (response.status === 'success') {
        response.proveedores.sort((a: any, b: any) => a.nombre.localeCompare(b.nombre));
        this.proveedores_catalogo_mx = response.proveedores;
        this.cd.detectChanges();
      } else {
        this.proveedores_catalogo_mx = [];
      }
    }
  
    private manejarErrorMXPRVList(error: any) {
      console.error('Error al cargar la lista de proveedores:', error);
      this.proveedores_catalogo_mx = [];
    }
    
    recargar_lista_proveedores_ext() {
      this.lista_proveedores_ext(this.indicador_proveedores_ext);
    }
  
    lista_proveedores_ext(filtro: 'hoy'|'esta_semana'|'este_mes'|'mes_anterior'|'otras_fechas'|'all_partidas') {
      this.indicador_proveedores_ext = filtro;
      let periodo_inicio = '';
      let periodo_fin = '';
  
      if (filtro == 'otras_fechas') {
        var ext_prv_otras_fechas = document.getElementById("ext_prv_otras_fechas");
        if (this.rangoPeriodoProveedoresEXT && this.rangoPeriodoProveedoresEXT.length === 2) {
          const dateInicio = this.rangoPeriodoProveedoresEXT[0];
          const dateFin = this.rangoPeriodoProveedoresEXT[1];
          if (dateInicio && dateFin) {            
            const validacionInicio = this.validator.filtroFecha(dateInicio.toISOString().split('T')[0]);
            const validacionFin = this.validator.filtroFecha(dateFin.toISOString().split('T')[0]);
            if (validacionInicio && validacionFin) {
              periodo_inicio = dateInicio.toISOString().split('T')[0];
              periodo_fin = dateFin.toISOString().split('T')[0];
              this.validator.correctoInputRow(ext_prv_otras_fechas);
            } else {
              this.validator.errorInputRow(ext_prv_otras_fechas);
              return;
            }
          } else {
            this.validator.errorInputRow(ext_prv_otras_fechas);
            return;
          }
        } else {
          this.validator.errorInputRow(ext_prv_otras_fechas);
          return;
        }
      }
  
      this.proveedorServ.catalogoProveedoresExtranjeros(filtro,periodo_inicio,periodo_fin).pipe(takeUntil(this.destruir$)).subscribe({
        next: (response) => this.procesarRespuestaEXTPRVList(response),
        error: (err) => this.manejarErrorEXTPRVList(err)
      });
    }
    
    private procesarRespuestaEXTPRVList(response: any) {
      if (response.status === 'success') {
        response.proveedores.sort((a: any, b: any) => a.nombre.localeCompare(b.nombre));
        this.proveedores_catalogo_ext = response.proveedores;
        this.cd.detectChanges();
      } else {
        this.proveedores_catalogo_ext = [];
      }
    }
  
    private manejarErrorEXTPRVList(error: any) {
      console.error('Error al cargar la lista de proveedores:', error);
      this.proveedores_catalogo_ext = [];
    }

    ver_prov_info(token_proveedor:any){
      this.proveedorServ.verDetalleProveedor(token_proveedor).subscribe(
        response => {
          if (response.status == "success") {
            console.log(response);
            this.proveedor_detalle = response.proveedor;
          }
          if (response.status == "error") {
            let translate_response = this.translate.instant(response.message);
            Swal.fire({
              position:"top-end",
              icon: "warning",
              title: translate_response,
              showConfirmButton:false,
              timer: 3000
            })
          }
        }, error => {console.log(error);}
      );
    }

    viewDocumentoLink(event:any){
      window.open(event, '_blank');
    }

    solicita_auth_prov(token_proveedor:any){
      console.log(token_proveedor);
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
          this.proveedorServ.solicitarValidateProveedor(token_proveedor).subscribe(
            response => {
              let translate_response = this.translate.instant(response.message);
              if (response.status == "success") {
                setTimeout(function(){
                  Swal.fire({
                    position:"center",
                    icon: "success",
                    title: translate_response,
                    showConfirmButton:false,
                    timer: 3000
                  })
                },1000);
              }
              if (response.status == "error") {
                Swal.fire({
                  position:"top-end",
                  icon: "warning",
                  title: translate_response,
                  showConfirmButton:false,
                  timer: 3000
                })
              }
            }, error => {console.log(error);}
          );
        }
      })
    }

  ngOnDestroy() {
    this.destruir$.next();
    this.destruir$.complete();
  }
}
