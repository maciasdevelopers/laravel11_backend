import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ComunicacionInternaService } from '../../../../servicios/comunicacion-interna.service';
import { TranslateService } from '@ngx-translate/core';
import { ConnectableObservable } from 'rxjs';

@Component({
  selector: 'app-compras-main',
  standalone: false,
  
  templateUrl: './compras-main.component.html',
  styleUrls: [
    '../../../../styles/listas_ps.css',
    '../../../../styles/datatable.css',
    '../../../../styles/dropdown.css',
    '../../../../styles/tabs.css',
    '../../../../styles/input_group.css',
    '../../../../styles/file_input.css',
    '../../../../styles/buttons.css',
    '../../../../styles/modals.css',
    '../../../../styles/cabecera.css',
    '../../../../styles/cards.css',
    '../../../../styles/clientes.css',
    '../../../../styles/collapsible.css',
    '../../../../styles/row.css',
    '../../../../styles/encabezados.css',
    '../../../../styles/buscador.css',
    '../../../../styles/radioButtons.css',
    '../../../../styles/paginador.css',
    '../../../../styles/landing.css',
    '../../../../styles/colores.css',
    '../../../../styles/div_explain.css',
    '../../../../styles/switches.css',
    '../../../../styles/navegador.css',
    '../egresos.css',
    './compras-main.component.css'
  ],
})
export class ComprasMainComponent implements OnInit{
  seccion_compras:string = 'registro_general_compras';
  menu_barra_superior:any = [];

  constructor(private relInterna: ComunicacionInternaService,private translate:TranslateService){}

  ngOnInit(): void {
    this.listarBarraMenu();
    this.getRespuestaRegistroBuy();
  }

  getRespuestaRegistroBuy(){
    this.relInterna.mensajeCompraRegistro$.subscribe(
      (mensaje:any) => {
        if (mensaje == "nuevo_registro") {
          this.seccion_compras = 'registro_general_compras';
        }
      }
    );
  }

  listarBarraMenu() {
    this.translate.get(['ssic_menu_ger','ssic_menu_ing','ssic_menu_egr','ssic_menu_inven','ssic_menu_prod','ssic_menu_fnzs','fnzs_ind_eco','ssic_menu_vhn','ssic_menu_con','ssic_menu_tec','comi_list','comi_soli','prov',
      'prov_cat','prov_reg','comi','comi_list','comi_soli','prov','prov_cat','prov_reg','comi','comi_list','comi_soli','reem','reem_list','reem_soli','comi','comi_list','comi_soli','proy_list','proy_list','proy_new',
      'cal_act_proy','gantt_diagram']).subscribe(translations => {
      this.menu_barra_superior = [
        //Ordenes de compra
        {label: 'Ordenes de compra',icon: 'pi pi-list',
          items: [
            [
              {
                label: 'Seguimiento de compras',
                items: [
                  {label: 'Registro general de compras realizadas',icon: 'pi pi-list',command: (event:any) => this.onMenuItemClick('registro_general_compras')},
                  {label: 'Compras por autorizar',icon: 'pi pi-list',command: (event:any) => this.onMenuItemClick('compras_por_autorizar')},
                  {label: 'Compras autorizadas',icon: 'pi pi-list',command: (event:any) => this.onMenuItemClick('compras_autorizadas')},
                  {label: 'Compras pagadas',icon: 'pi pi-list',command: (event:any) => this.onMenuItemClick('compras_pagadas')},
                  {label: 'Compras sin factura recibida',icon: 'pi pi-list',command: (event:any) => this.onMenuItemClick('compras_sin_factura_recibida')},
                  {label: 'Prorrateo antes de recepci&oacute;n',icon: 'pi pi-list',command: (event:any) => this.onMenuItemClick('compras_prorrateo_antes_de_recepcion')},
                  {label: 'Compras programadas',icon: 'pi pi-list',command: (event:any) => this.onMenuItemClick('compras_programadas')},
                  {label: 'Solicitudes de descuento',icon: 'pi pi-list',command: (event:any) => this.onMenuItemClick('solicitudes_de_descuento')},
                  {label: 'Solicitudes de devoluci&oacute;n',icon: 'pi pi-reply',command: (event:any) => this.onMenuItemClick('solicitudes_de_devolucion')},
                  {label: 'Notas de cr&eacute;dito',icon: 'pi pi-list',command: (event:any) => this.onMenuItemClick('notas_de_credito')},
                  {label: 'Notas de d&eacute;bito',icon: 'pi pi-list',command: (event:any) => this.onMenuItemClick('notas_de_debito')},
                  {label: 'Anticipos a proveedor',icon: 'pi pi-list',command: (event:any) => this.onMenuItemClick('anticipos_a_proveedor')},
                  {label: 'Carga de CFDI de Traslado',icon: 'pi pi-list',command: (event:any) => this.onMenuItemClick('carga_cfdis_traslado')}
                ]
              },
              {
                label: 'Nuevo registro',
                items: [
                  {label: 'Compra manual', icon: 'pi pi-plus',command: (event:any) => this.onMenuItemClick('compras_registro_directo')},
                  {label: 'Compra base CFDI', icon: 'pi pi-file',command: (event:any) => this.onMenuItemClick('compras_registro_cfdi')},
                  {label: 'Compra base previa instrucci&oacute;n', icon: 'pi pi-file',command: (event:any) => this.onMenuItemClick('compras_registro_instruccion')},
                  {label: 'Solicitar descuento', icon: 'pi pi-percentage',command: (event:any) => this.onMenuItemClick('app_interno_egresos_compras_descuentos')},
                ]
              },
            ]
          ]
        },
        //Instrucci&oacute;n para la orden de compra
        {
          label: 'Instrucci&oacute;n para la orden de compra',
          icon: 'pi pi-shopping-cart',
          items: [
            [
              {
                label: 'Requisici&oacute;n',
                items: [
                  {label: 'Cat&aacute;logo de requisiciones',icon: 'pi pi-list',command: (event:any) => this.onMenuItemClick('app_interno_egresos_compras_requisicion_lista')},//app_interno_egresos_compras_requisicion_lista
                  {label: 'Alta de requisici&oacute;n', icon: 'pi pi-box',command: (event:any) => this.onMenuItemClick('app_interno_egresos_compras_requisicion_registro')},//app_interno_egresos_compras_requisicion_registro
                ]
              },
              {
                label: 'Cotizaci&oacute;n',
                items: [
                  { label: 'Cat&aacute;logo de cotizaciones', icon: 'pi pi-plus',command: (event:any) => this.onMenuItemClick('app_interno_egresos_compras_cotizacion_lista')},//app_interno_egresos_compras_cotizacion_lista
                  { label: 'Alta de cotizaci&oacute;n', icon: 'pi pi-file',command: (event:any) => this.onMenuItemClick('app_interno_egresos_compras_cotizacion_registro')},//app_interno_egresos_compras_cotizacion_registro
                ]
              },
              {
                label: 'Instrucci&oacute;n para la orden de compra',
                items: [
                  { label: 'Cotizaciones autorizadas', icon: 'pi pi-plus',command: (event:any) => this.onMenuItemClick('app_interno_egresos_compras_instruccion')},//app_interno_egresos_compras_instruccion
                  { label: 'Cotizaciones con contacto a proveedor realizado', icon: 'pi pi-file',command: (event:any) => this.onMenuItemClick('app_interno_egresos_compras_instr_prvc')},//app_interno_egresos_compras_instr_prvc
                ]
              },
            ]
          ]
        },
        //Reembolsos
        {
          label: translations['reem'],
          icon: 'pi pi-shopping-cart',
          command: (event:any) => this.onMenuItemClick('app_compras_egr_reembolsos')
        },
        //excel
        {
          label: "descargar",
          icon: 'pi pi-file-excel',
          command: (event:any) => this.onMenuItemClick('app_compras_excel_descargar')
        }
      ];
    });

  }

  onMenuItemClick(opcion: string) {
    //$('#modalComprasProrrateos').modal('show');
    this.seccion_compras = opcion;
    console.log(opcion);
  }

  menuSeleccionado(seccion:any) {
    this.seccion_compras = seccion;
  }
}
