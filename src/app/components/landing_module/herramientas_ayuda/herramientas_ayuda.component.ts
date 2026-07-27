import { Component, OnInit, ElementRef, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app_herramientas_ayuda',
  templateUrl: './herramientas_ayuda.component.html',
  standalone:false,
  styleUrls: [
    '../../../styles/landing.css',
    '../../../styles/parallax.css',
    '../../../styles/images.css',
    '../../../styles/cards.css',
    '../../../styles/input_group.css',
    '../../../styles/switches.css',
    '../../../styles/explain.css',
    '../../../styles/listas_ps.css',
    '../../../styles/page_landing_index.css',
    './herramientas_ayuda.component.css'
  ],
  providers:[]
})
export class HerramientasAyudaComponent implements OnInit {
  public visible_calc_ret = false;
  public visible_visor_cfdi = false;
  public visible_calc_laborales = false;
  public visible_calc_act_recargos = false;
  public visible_calc_estimado_impuestos = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  verDialogCalcRet() {this.visible_calc_ret = true;}
  verDialogVisorCFDI() {this.visible_visor_cfdi = true;}
  verDialogCalcLab() {this.visible_calc_laborales = true;}
  verDialogCalcRecargos() {this.visible_calc_act_recargos = true;}
  verDialogCalcEstImpuestos() {this.visible_calc_estimado_impuestos = true;}
}
