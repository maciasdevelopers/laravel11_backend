import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { LogisticaService } from '../../../../../servicios/ssic/logistica-service';
import { Subscription } from 'rxjs';
import { TreeNode } from 'primeng/api';

interface Hito {
  clave: string;
  valor: string;
}

@Component({
  selector: 'logistica_monitor_rutas',
  standalone: false,
  templateUrl: './logistica-monitor-component.html',
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
    '../../../../../styles/div_explain.css',
    '../../../../../styles/explain.css',
    '../../../../../styles/switches.css',
    '../../../../../styles/navegador.css',
    '../../egresos.css',
    './logistica-monitor-component.css'
  ]
})
export class LogisticaMonitorComponent implements OnInit, OnDestroy{
  //Subscription
  private subs: Subscription = new Subscription();
  public logistica_seguimiento_token:string = "";
  caminoRecorrido: any = [];
  caminoRecorridoTree: TreeNode[] = [];
  verLateralUnidad: boolean = false;
  unidadSeleccionada: any = [];
  verLateralTransbordo: boolean = false;
  transbordoSeleccionado: any = [];

  constructor(
    private logisticaService: LogisticaService,
  ) {

  }

  @Input() set seguimiento_token(value: string) {
    if (value) {
      this.logistica_seguimiento_token = value;
      this.verfInfoCompra();
    }
  }

  ngOnInit(): void {
    // Al arrancar, inicializamos el formulario con el primer camión obligatorio
    //this.anadirTransporte();
  }

  verfInfoCompra() {
    this.subs.add(
      this.logisticaService.monitorRutasLogistica(this.logistica_seguimiento_token).subscribe({
        next: (res: any) => {
          if (res.status === 'success') {
            this.caminoRecorrido = res.camino_recorrido;
            
            this.caminoRecorridoTree = res.camino_recorrido.map((nodo: any) => {
            
            // 1. Ramas Finales (Unidades Salientes / Derecha)
            const ramasSalientes = (nodo.unidades_salientes_adelante || []).map((u: any) => ({
              label: u.folio_seguimiento_timeline,
              type: 'saliente',
              data: u
            }));

            // 2. Ramas Iniciales (Unidades Entrantes / Izquierda)
            // Para simular que entran al Hub, el Hub será el padre de las unidades en la jerarquía del componente,
            // pero visualmente fluirá de izquierda a derecha de forma excelente.
            const ramasEntrantes = (nodo.unidades_entrantes_atras || []).map((u: any) => ({
              label: u.folio_seguimiento_timeline,
              type: 'entrante',
              expanded: true,
              data: u,
              // Enganchamos las salidas después de la llegada
              children: ramasSalientes 
            }));

            // 3. Nodo Raíz Central (El Punto de Transbordo / Hub)
            return {
              label: nodo.folio_seguimiento_timeline,
              type: 'entrante',
              expanded: true,
              data: nodo,
              children: ramasEntrantes
            };
          });
          }
        }
      })
    );
  }

  verDetalleUnidad(nodo:any){
    this.verLateralUnidad = true;
    this.unidadSeleccionada = nodo;
  }

  verDetalleTransbordo(nodo:any){
    this.verLateralTransbordo = true;
    this.transbordoSeleccionado = nodo;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
