import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CargaPaginaService } from '../../../../../servicios/carga-pagina.service';
import { EmpleadosService } from '../../../../../servicios/ssic/empleados.service';
import { ProyectosService } from '../../../../../servicios/ssic/proyectos-service.service';
import { ValidatorServService } from '../../../../../servicios/validator-serv.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'proy_block_lista_plantillas',
  templateUrl: './lista-plantillas.component.html',
  standalone:false,
  styleUrls: [
    './lista-plantillas.component.css',
    '../../../../../styles/loading.css',
    '../../../../../styles/listas_ps.css',
    '../../../../../styles/datatable.css',
    '../../../../../styles/input_group.css',
    '../../../../../styles/file_input.css',
    '../../../../../styles/buttons.css',
    '../../../../../styles/modals.css',
    '../../../../../styles/cabecera.css',
    '../../../../../styles/cards.css',
    '../../../../../styles/clientes.css',
    '../../../../../styles/collapsible.css',
    '../../../../../styles/row.css',
    '../../../../../styles/tabs.css',
    '../../../../../styles/encabezados.css',
    '../../../../../styles/div_busqueda.css',
    '../../../../../styles/radioButtons.css',
    '../../../../../styles/paginador.css',
    '../../../../../styles/loading.css',
    '../../../../../styles/navegador.css',
    '../../../../../styles/listas_ps.css',
    '../../../../../styles/landing.css',
    '../../../../../styles/colores.css',
    //'~jsgantt-improved/dist/jsgantt.css'
  ]
})
export class ListaPlantillasComponent implements OnInit {
  listaPlantillas:any = [];
  constructor(
    private _persServ:EmpleadosService,
    private validator:ValidatorServService,
    private translate:TranslateService,
    private _proyServ:ProyectosService,
    private loadPageServ: CargaPaginaService) {

  }

  ngOnInit(): void {
    this.loadPageServ.comienza_contador_carga();
    this.catalogoPlantillas();
  }

  cerrarModal(modal:any){}

  catalogoPlantillas(){
    this._proyServ.catalogoPlantillas().subscribe(
      response => {
        if (response.status == 'success') {
          this.listaPlantillas = response.templates;
          console.log(this.listaPlantillas);
        }
      },
      error => {
        console.log(error);
      }
    );
  }
}
