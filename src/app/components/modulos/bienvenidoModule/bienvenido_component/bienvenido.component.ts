import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'bienvenido-component',
  templateUrl: './bienvenido.component.html',
  standalone: false,
  styleUrls: [
    'bienvenido.component.css',
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
    '../../../../styles/loading.css',
    '../../../../styles/landing.css',
  ],
})

export class BienvenidoComponent implements OnInit {
  public porcentaje_carga: number = 0;
  mensajeCarga = 'cargando... 0%';

  @ViewChild('loadingBlue') loadingBlue: ElementRef = {} as ElementRef;
  @ViewChild('vContent') vContent: ElementRef = {} as ElementRef;
  @ViewChild('h6loadingSeccion') h6loadingSeccion: ElementRef = {} as ElementRef;
  @ViewChild('progressbarPrincipal') progressbarPrincipal: ElementRef = {} as ElementRef;

  @ViewChild('segundoMenuAreas') segundoMenuAreas: ElementRef = {} as ElementRef;
  @ViewChild('dropdown11') dropdown11: ElementRef = {} as ElementRef;

  //@ViewChild('btnAbreCatServ') btnAbreCatServ: ElementRef = {} as ElementRef;

  constructor(private cd: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.porcentaje_carga = 0;
    var intervalo = setInterval(() => {
      this.porcentaje_carga += 1;

      this.mensajeCarga = `cargando... ${this.porcentaje_carga}%`;
      this.cd.detectChanges();
      if (this.porcentaje_carga == 100) {
        clearInterval(intervalo);
        const vContent = document.getElementById("vContent");
        if (vContent) vContent.classList.remove("noneView");
        setTimeout(function () {
          $("#loadingSeccion").fadeOut("slow");
        }, 3000);
      }
    }, 30);
  }

}
