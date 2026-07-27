import { Component, OnInit, ViewChild, ElementRef, Renderer2, Input } from '@angular/core';
import { MonedasService } from '../../../../../servicios/monedas.service';
import { VentasServService } from '../../../../../servicios/ssic/ventas-serv.service';
import { Usuarios } from '../../../../../modelos/Usuarios';
import { DomSanitizer } from '@angular/platform-browser';
import { UbicacionServService } from '../../../../../servicios/ssic/ubicacion-serv.service';
import { CajaServService } from '../../../../../servicios/ssic/caja-serv.service';
import { ValidatorServService } from '../../../../../servicios/validator-serv.service';
import { ClientesService } from '../../../../../servicios/ssic/clientes.service';
import { BancosServService } from '../../../../../servicios/ssic/bancos-serv.service';
import { MonederoElectService } from '../../../../../servicios/ssic/monedero-elect.service';
import { TranslateService } from '@ngx-translate/core';
//import * as JSpdf from 'jspdf';

@Component({
  selector: 'app-ventas-main',
  standalone: false,
  templateUrl: './ventas-main.component.html',
  styleUrls: [
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
    '../../../../../styles/div_explain.css',
    './ventas-main.component.css'],
})
export class VentasMainComponent implements OnInit {
  public usuario: Usuarios;
  seccion_ventas:string = 'app_interno_egresos_ventas_lista';
  menu_barra_superior:any = [];

  constructor(
    private renderer:Renderer2,
    private sanitizer:DomSanitizer,
    private monedasServ:MonedasService,
    private _ventServ: VentasServService,
    private ubicaServ: UbicacionServService,
    private _cajServ: CajaServService,
    private bancos:BancosServService,
    private monedero:MonederoElectService,
    private validator:ValidatorServService,
    private translate:TranslateService,
    public _clientServ: ClientesService) {
    this.usuario = new Usuarios(1,"","","","","","","",1,1,"","","","");
  }
  ngOnInit(): void {
    this.listarBarraMenu();
  }
  listarBarraMenu() {
    this.menu_barra_superior = [
      {label: 'Ordenes de venta',icon: 'pi pi-list',
        items: [
          [
            {
              label: 'Seguimiento de ventas',
              items: [
                {label: 'Ventas registradas',icon: 'pi pi-list',command: (event:any) => this.onMenuItemClick('app_interno_egresos_ventas_lista')},
                {label: 'Entrega de productos al cliente', icon: 'pi pi-box',command: (event:any) => this.onMenuItemClick('app_interno_egresos_ventas_productos_entrega')},
                {label: 'Devengación de servicios al cliente', icon: 'pi pi-box',command: (event:any) => this.onMenuItemClick('app_interno_egresos_ventas_servicios_devengacion')},
                {label: 'Devoluciones sobre ventas', icon: 'pi pi-reply',command: (event:any) => this.onMenuItemClick('app_interno_egresos_ventas_devoluciones')},
              ]
            },
            {
              label: 'Nuevo registro',
              items: [
                { label: 'Venta directa', icon: 'pi pi-plus',command: (event:any) => this.onMenuItemClick('ventas_registro_directo')},
                { label: 'Nueva nota de mostrador', icon: 'pi pi-file',command: (event:any) => this.onMenuItemClick('ventas_registro_mostrador')},
              ]
            },
          ]
        ]
      },
      {
        label: 'Seguimiento con clientes',
        icon: 'pi pi-shopping-cart',
        items: [
          [
            {
              label: 'Anticipos',
              items: [
                {label: 'Anticipos registrados',icon: 'pi pi-list',command: (event:any) => this.onMenuItemClick('ventas_lista')},
                {label: 'Registrar nuevo anticipo', icon: 'pi pi-box',command: (event:any) => this.onMenuItemClick('ventas_registra')}
              ]
            },
            {
              label: 'Notas de crédito',
              items: [
                { label: 'venta directa', icon: 'pi pi-plus',command: (event:any) => this.onMenuItemClick('ventas_registro_directo')},
                { label: 'venta por CFDI', icon: 'pi pi-file',command: (event:any) => this.onMenuItemClick('ventas_registro_cfdi')}
              ]
            },
            {
              label: 'Solicitud para emisión de CFDI (Fiscal MX)',
              items: [
                { label: 'venta directa', icon: 'pi pi-plus',command: (event:any) => this.onMenuItemClick('ventas_registro_directo')},
                { label: 'venta por CFDI', icon: 'pi pi-file',command: (event:any) => this.onMenuItemClick('ventas_registro_cfdi')}
              ]
            },
            {
              label: 'Facturación (Fiscal MX)',
              items: [
                { label: 'venta directa', icon: 'pi pi-plus',command: (event:any) => this.onMenuItemClick('ventas_registro_directo')},
                { label: 'venta por CFDI', icon: 'pi pi-file',command: (event:any) => this.onMenuItemClick('ventas_registro_cfdi')}
              ]
            },
            {
              label: 'Notas de crédito (Fiscal MX)',
              items: [
                { label: 'venta directa', icon: 'pi pi-plus',command: (event:any) => this.onMenuItemClick('ventas_registro_directo')},
                { label: 'venta por CFDI', icon: 'pi pi-file',command: (event:any) => this.onMenuItemClick('ventas_registro_cfdi')}
              ]
            },
            {
              label: 'Notas de debito (Fiscal MX)',
              items: [
                { label: 'venta directa', icon: 'pi pi-plus',command: (event:any) => this.onMenuItemClick('ventas_registro_directo')},
                { label: 'venta por CFDI', icon: 'pi pi-file',command: (event:any) => this.onMenuItemClick('ventas_registro_cfdi')}
              ]
            },
          ]
        ]
      }
    ];
  }

  onMenuItemClick(opcion: string) {
    this.seccion_ventas = opcion;
    //$('#modalventasProrrateos').modal('show');
    /*switch (opcion) {
      //Ordenes de venta
      case 'app_interno_egresos_ventas_lista':
        this.seccion_ventas = 'app_interno_egresos_ventas_lista';
        break;
      case 'app_interno_egresos_ventas_productos_entrega':
        this.seccion_ventas = 'app_interno_egresos_ventas_productos_entrega';
        break;
      case 'app_interno_egresos_ventas_servicios_devengacion':
        this.seccion_ventas = 'app_interno_egresos_ventas_servicios_devengacion';
        break;
      case 'app_interno_egresos_ventas_devoluciones':
        this.seccion_ventas = 'app_interno_egresos_ventas_devoluciones';
        break;

      case 'ventas_registro_directo':
        this.seccion_ventas = 'ventas_registro_directo';
        break;
      case 'ventas_registro_mostrador':
        this.seccion_ventas = 'ventas_registro_mostrador';
        break;
      
      //Seguimiento con clientes
      case 'app_interno_egresos_ventas_devengacion_servicios':
        this.seccion_ventas = 'app_interno_egresos_ventas_devengacion_servicios';
        break;
      case 'app_interno_egresos_ventas_descuentos':
        this.seccion_ventas = 'app_interno_egresos_ventas_descuentos';
        break;

      case 'app-devolucionproductosproveedor':
        this.seccion_ventas = 'app-devolucionproductosproveedor';
        break;
      case 'app_interno_egresos_ventas_requisicion_lista':
        this.seccion_ventas = 'app_interno_egresos_ventas_requisicion_lista';
        break;

      case 'app_interno_egresos_ventas_requisicion_registro':
        this.seccion_ventas = 'app_interno_egresos_ventas_requisicion_registro';
        break;
      case 'app_interno_egresos_ventas_cotizacion_lista':
        this.seccion_ventas = 'app_interno_egresos_ventas_cotizacion_lista';
        break;

      case 'app_interno_egresos_ventas_cotizacion_registro':
        this.seccion_ventas = 'app_interno_egresos_ventas_cotizacion_registro';
        break;
      case 'app_interno_egresos_ventas_instruccion':
        this.seccion_ventas = 'app_interno_egresos_ventas_instruccion';
        break;

      case 'app_interno_egresos_ventas_cotizacion_registro':
        this.seccion_ventas = 'app_interno_egresos_ventas_cotizacion_registro';
        break;
      case 'app_interno_egresos_ventas_instruccion':
        this.seccion_ventas = 'app_interno_egresos_ventas_instruccion';
        break;

      case 'app_interno_egresos_ventas_cotizacion_registro':
        this.seccion_ventas = 'app_interno_egresos_ventas_cotizacion_registro';
        break;
      case 'app_interno_egresos_ventas_instruccion':
        this.seccion_ventas = 'app_interno_egresos_ventas_instruccion';
        break;
      //Seguimiento con proveedores
      default:
        this.seccion_ventas = '';
        break;
    }*/
  }

  menuSeleccionado(seccion:any) {
    this.seccion_ventas = seccion;
  }
}
