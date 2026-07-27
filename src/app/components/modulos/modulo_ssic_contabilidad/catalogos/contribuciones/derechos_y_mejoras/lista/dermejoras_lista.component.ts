//import { Component, OnInit } from '@angular/core';
import { Component,OnInit, Input, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { global } from '../../../../../../../servicios/global_ssic'; 
import { InterfServicios } from '../../../../../../../interfaces/intef-servicios';
import { ServiciosService } from '../../../../../../../servicios/ssic/servicios.service';
import { InterfMonedas } from '../../../../../../../interfaces/interf-monedas';
import { MonedasService } from '../../../../../../../servicios/monedas.service';
import { InterfUmedida } from '../../../../../../../interfaces/interf-umedida';
import { UniMedServService } from '../../../../../../../servicios/uni-med-serv.service';
import { InterfDescuentos } from '../../../../../../../interfaces/descuentos';
import { DescuentosService } from '../../../../../../../servicios/ssic/descuentos.service';
import { IntefPromociones } from '../../../../../../../interfaces/intef-promociones';
import { PromocionesService } from '../../../../../../../servicios/ssic/promociones.service';
import { CatSatServService } from '../../../../../../../servicios/ssic/cat-sat-serv.service';
import { ImpuestosServService } from '../../../../../../../servicios/ssic/impuestos-serv.service';
import { Usuarios } from '../../../../../../../modelos/Usuarios';
import { InterfPagoForma } from '../../../../../../../interfaces/interf-pago-forma';
import { FormaPagoService } from '../../../../../../../servicios/ssic/forma-pago.service';
import { ClientesService } from '../../../../../../../servicios/ssic/clientes.service';

@Component({
  selector: 'app-interno-ingresos-catalogos',
  templateUrl: './dermejoras_lista.component.html',
  standalone:false,
  styleUrls: [
    '../../../../../../../styles/listas_ps.css',
    '../../../../../../../styles/datatable.css',
    '../../../../../../../styles/dropdown.css',
    '../../../../../../../styles/tabs.css',
    '../../../../../../../styles/input_group.css',
    '../../../../../../../styles/file_input.css',
    '../../../../../../../styles/buttons.css',
    '../../../../../../../styles/modals.css',
    '../../../../../../../styles/cabecera.css',
    '../../../../../../../styles/cards.css',
    '../../../../../../../styles/clientes.css',
    '../../../../../../../styles/collapsible.css',
    '../../../../../../../styles/row.css',
    '../../../../../../../styles/encabezados.css',
    '../../../../../../../styles/buscador.css',
    '../../../../../../../styles/radioButtons.css',
    '../../../../../../../styles/paginador.css',
    '../../../../../../../styles/landing.css',
    '../../../../contabilidad.css',
    './dermejoras_lista.component.css']
})

export class DerMejorasListaComponent implements OnInit {
  options = {};

  public usuario: Usuarios;

  public listaImpArray:any = [];
  public impuestosVigentesArray:any = [];
  public detalleImpuestosArray:any = [];
  public impuestosDeletedArray:any = [];

  @ViewChild('buscaClaveSat') buscaClaveSat: ElementRef = {} as ElementRef;

  constructor(public renderer: Renderer2,
    public _servicioServ:ServiciosService,
    public monedasServ: MonedasService,
    public _medidasServ: UniMedServService,
    public _descServ: DescuentosService,
    public _promoServ: PromocionesService,
    public _catSat: CatSatServService,
    public _fpago: FormaPagoService,
    public _catImp: ImpuestosServService,
    public _clientServ: ClientesService) {
      this.usuario = new Usuarios(1,"","","","","","","",1,1,"","","","");
    }

  ngOnInit(): void {
    //$('.tooltipped').tooltip();
    var elems = document.querySelectorAll('.tooltipped');
    //var instances = M.Tooltip.init(elems, this.options);

    //this._catImp.listaImpuestos().subscribe(
    //  response => {
    //    if (response.status == 'success') {
    //      this.listaImpArray = response.catImpuesto
    //      console.log(this.listaImpArray);
    //    }
    //  },
    //  error => {
    //    console.log(error);
    //  }
    //);
    //this._catImp.impuestosVigentes().subscribe(
    //  response => {
    //    if (response.status == 'success') {
    //      this.impuestosVigentesArray = response.catImpuesto
    //    }
    //  },
    //  error => {
    //    console.log(error);
    //  }
    //);
    //this._catImp.impuestosDeleted().subscribe(
    //  response => {
    //    if (response.status == 'success') {
    //      this.impuestosDeletedArray = response.catImpuesto
    //    }
    //  },
    //  error => {
    //    console.log(error);
    //  }
    //);

  }

  functViewImpuesto(event:any,token_impuesto:any){
    //this._catImp.getImpuestosSelected(token_impuesto).subscribe(
    //  response => {
    //    if (response.status == 'success') {
    //      console.log(response.datosImpuesto);
    //      this.detalleImpuestosArray = response.datosImpuesto;
    //    }
    //  },
    //  error => {
    //    console.log(error);
    //  }
    //)
  }

}
