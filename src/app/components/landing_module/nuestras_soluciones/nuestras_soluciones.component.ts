import { Component, OnInit, ElementRef, Renderer2, ViewChild  } from '@angular/core';
import { ServSolucionesService} from './serv-soluciones.service';
import { InterfSoluciones } from './interf-soluciones';

@Component({
  	selector: 'app_nuestras_soluciones',
  	templateUrl: './nuestras_soluciones.component.html',
    standalone:false,
  	styleUrls: [
      '../../../styles/landing.css',
      '../../../styles/parallax.css',
      '../../../styles/images.css',
      '../../../styles/modals.css',
      '../../../styles/cards.css',
      '../../../styles/page_landing_index.css',
      './nuestras_soluciones.component.css'
    ]
})
export class NuestrasSolucionesComponent implements OnInit {

	//arraYSolucionesLnd: InterfSoluciones = [];
	arraysolucioneslnd: InterfSoluciones[] = [];
  expan_adm_ded = false;
  expan_con_ded = false;
  expan_fis_ded = false;
  expan_leg_ded = false;
  expan_cex_ded = false;
  expan_cor_ded = false;
  expan_aud_ded = false;
  expan_dhd_ded = false;

  	constructor(
      private renderer:Renderer2,
      public ServSolucionesService: ServSolucionesService,
    ) { }

  	ngOnInit(): void {
		  this.ServSolucionesService.traeTodosServLanding().subscribe(
		  	response => {
		  		if (response.status == 'success') {
		  			this.arraysolucioneslnd = response.datosServicio;
            //var element:any = document.getElementById('img_header_soluciones');
            //element.style.removeProperty("inset");
		  		}
		  	},
		  	error => {
		  		console.log(error);
		  	}
		  )
  	}


    
    abreRegistroSsic(){
      /*var news = document.getElementById("news"):
      var soluciones = document.getElementById("soluciones"):
      var registrossic = document.getElementById("registrossic"):
      var portalterceros = document.getElementById("portalterceros"):
      var helptools = document.getElementById("helptools"):

      news.style.display = "none";
      soluciones.style.display = "none";
      registrossic.style.display = "block";
      portalterceros.style.display = "none";
      helptools.style.display = "none";*/
    }

}
