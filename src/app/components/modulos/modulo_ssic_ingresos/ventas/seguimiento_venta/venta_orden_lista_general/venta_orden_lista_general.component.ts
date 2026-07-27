import { Component, OnInit, ViewChild, ElementRef, Renderer2} from '@angular/core';
import { global } from "../../../../../../servicios/global_ssic"; 
import { InterfMonedas } from '../../../../../../interfaces/interf-monedas';
import { MonedasService } from '../../../../../../servicios/monedas.service';
import { VentasServService } from '../../../../../../servicios/ssic/ventas-serv.service';
import { Usuarios } from '../../../../../../modelos/Usuarios';
import { UbicacionServService } from '../../../../../../servicios/ssic/ubicacion-serv.service';
import { CajaServService } from '../../../../../../servicios/ssic/caja-serv.service'; 
import { ValidatorServService } from '../../../../../../servicios/validator-serv.service'; 
import { ClientesService } from '../../../../../../servicios/ssic/clientes.service';
import { BancosServService } from '../../../../../../servicios/ssic/bancos-serv.service';
import numeral from 'numeral';
import Swal from 'sweetalert2';

@Component({
  selector: 'app_interno_ingresos_orden_de_venta_lista_general',
  templateUrl: './venta_orden_lista_general.component.html',
  standalone:false,
  styleUrls: [
    '../../../../../../styles/datatable.css',
    '../../../../../../styles/input_group.css',
    '../../../../../../styles/buttons.css',
    '../../../../../../styles/modals.css',
    '../../../../../../styles/clientes.css',
    '../../../../../../styles/collapsible.css',
    '../../../../../../styles/row.css',
    '../../../../../../styles/encabezados.css',
    '../../../../../../styles/div_busqueda.css',
    '../../../../../../styles/radioButtons.css',
    '../../../../../../styles/switches.css',
    '../../../../../../styles/loading.css',
    '../../../../../../styles/listas_ps.css',
    '../../../../../../styles/landing.css',
    '../../../../../../styles/colores.css',
    '../../../../../../styles/ubicaciones.css',
    '../../../ingresos.css',
    './venta_orden_lista_general.component.css'
  ],
})
export class ListaGeneralVentasIngresosComponent implements OnInit {

  constructor(private renderer:Renderer2,
    public monedasServ:MonedasService,
    public _ventServ: VentasServService,
    public ubicaServ: UbicacionServService,
    public _cajServ: CajaServService,
    public bancos:BancosServService,
    public validator:ValidatorServService,
    public _clientServ: ClientesService
  ) {
  }

  ngOnInit(): void {

  }
}