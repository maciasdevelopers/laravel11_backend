import { Component, OnInit } from '@angular/core';
import { CFDIService } from '../../../../../servicios/xml/cfdi.service';

@Component({
  selector: 'app-cat-soli-fact',
  templateUrl: './cat-soli-fact.component.html',
  standalone:false,
  styleUrls: [
    '../../../../../styles/listas_ps.css',
    '../../../../../styles/datatable.css',
    '../../../../../styles/input_group.css',
    '../../../../../styles/buttons.css',
    '../../../../../styles/modals.css',
    '../../../../../styles/clientes.css',
    '../../../../../styles/collapsible.css',
    '../../../../../styles/row.css',
    '../../../../../styles/encabezados.css',
    '../../../../../styles/div_busqueda.css',
    '../../../../../styles/radioButtons.css',
    '../../../../../styles/paginador.css',
    '../../ingresos.css',
    './cat-soli-fact.component.css'
  ]
})
export class CatSoliFactComponent implements OnInit {
  listSoliFact:any = [];

  searchCFDI:any;
  arrayProyectos:any = [];
  pageCFDI:number = 1;

  constructor(
    private cfdiServ:CFDIService
  ) {

  }

  ngOnInit(): void {
    
    this.listaXmlSoliDone();
  }

  listaXmlSoliDone(){
    this.cfdiServ.list_soli_facturacion().subscribe(
      response => {
        if (response.status == 'success') {
          //console.log(response);
          this.listSoliFact = response.listSoliCFDI;
          console.log(this.listSoliFact);
        }
      },
      error => {
        console.log(error);
      }
    );
  }


}
