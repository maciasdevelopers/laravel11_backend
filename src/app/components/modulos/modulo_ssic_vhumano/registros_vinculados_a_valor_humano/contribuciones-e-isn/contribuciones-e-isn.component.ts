import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-contribuciones-e-isn',
  standalone: false,
  
  templateUrl: './contribuciones-e-isn.component.html',
  styleUrls: [
    '../../../../../styles/loading.css',
    '../../../../../styles/listas_ps.css',
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
    '../../../../../styles/explain.css',
    '../../../../../styles/switches.css',
    '../../../../../styles/navegador.css',
    '../../vhumano.css',
    './contribuciones-e-isn.component.css']
})
export class ContribucionesEIsnComponent implements OnInit{
//ISN (Impuestos sobre la nómina)
  public modal_registro_declaracion_isn:boolean = false;

//DASS (Aportaciones de Seguridad Social)
	public modal_registro_aportacion_seguridad_social:boolean = false;

  constructor(
    private translate:TranslateService
  ) {
  }

  ngOnInit(): void {}

  verRegistroDeclaracionIsn(){
    this.modal_registro_declaracion_isn = true;
  }

  verRegistroAportacionSeguridadSocial(){
    this.modal_registro_aportacion_seguridad_social = true;
  }
}
