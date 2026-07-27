import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LogisticaService } from '../../../../../servicios/ssic/logistica-service';
import { ValidatorServService } from '../../../../../servicios/validator-serv.service';
import { ComprasServService } from '../../../../../servicios/ssic/compras-serv.service';
import { TranslateService } from '@ngx-translate/core';
import { ComunicacionInternaService } from '../../../../../servicios/comunicacion-interna.service';
import { MessageService } from 'primeng/api';
import Swal from 'sweetalert2';
import { NgxFileDropEntry } from 'ngx-file-drop';

@Component({
  selector: 'logistica_registra_llegada_fecha',
  standalone: false,
  templateUrl: './logistica-registra-llegada-fecha-component.html',
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
    './logistica-registra-llegada-fecha-component.css'
  ]
})
export class LogisticaRegistraLlegadaFechaComponent implements OnInit, OnDestroy{
  public logistica_seguimiento_token:string = "";
  listado_unidades: any = [];
  public anexosTransitoFiles: NgxFileDropEntry[] = [];
  public anexosTransitoDocs: any[] = [];
  public anexosTransitoNames: any = [];
  
  private subs: Subscription = new Subscription();

  constructor(
    private logisticaService: LogisticaService,
    private validator: ValidatorServService,
    private _comprServ: ComprasServService,
    private translate: TranslateService,
    private relInterna: ComunicacionInternaService,
    private cd: ChangeDetectorRef,
    private primeAlerts: MessageService,
  ) {
  }

  ngOnInit(): void {
  }

  @Input() set seguimiento_token(value: string) {
    if (value) {
      this.logistica_seguimiento_token = value;
      this.verfInfoCompra();
    }
  }

  verfInfoCompra() {
    this.subs.add(
      this.logisticaService.logisticaCompraArribosSinFechaRegistrada(this.logistica_seguimiento_token).subscribe(response => {
        if (response.status === 'success') {
          this.listado_unidades = response.unidadesRegistradas;
          this.cd.detectChanges();
        }
      })
    );
  }

  select_fecha_real_llegada(event:any,vUnidad:any): void {
    const validacion = event.value != "" && this.validator.filtroFecha(event.value);
    vUnidad.new_fecha_real_arribo = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  observaciones_llegada(event:any,vUnidad:any): void {
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value);
    vUnidad.new_observaciones_arribo = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  public droppedTransito(files: NgxFileDropEntry[]) {
    // 1. Limpiamos estados para recibir el nuevo set de archivos
    this.anexosTransitoFiles = files;
    this.anexosTransitoNames = [];
    this.anexosTransitoDocs = [];

    for (let i = 0; i < files.length; i++) {
      const droppedFile = files[i];

      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;

        fileEntry.file((file: File) => {
          const typoElement = file.type;
          const nameFile = file.name;
          const sizeFile = file.size;

          // 2. Validación de tipos y tamaño (2MB)
          const allowedTypes = ['application/pdf', 'text/xml', 'image/jpeg', 'image/jpg', 'image/png'];
          const isAllowedType = allowedTypes.includes(typoElement);
          const isAllowedSize = sizeFile <= 2000000;

          if (isAllowedType && isAllowedSize) {
            // 3. Inserción directa y limpia
            // Ya no necesitamos el ciclo for (j...) porque limpiamos al inicio
            this.anexosTransitoNames.push({ "typoElement": typoElement, "nameFile": nameFile });
            this.anexosTransitoDocs.push(file);

            console.log(`Archivo aceptado: ${nameFile}`);
          } else {
            // 4. Manejo de errores específico
            let mensajeError = '';
            if (!isAllowedSize) {
              mensajeError = `El archivo ${nameFile} excede el tamaño permitido (2MB)`;
            } else if (!isAllowedType) {
              mensajeError = `El archivo ${nameFile} tiene un formato no permitido (PDF, XML, JPG, PNG)`;
            }

            Swal.fire({
              position: 'top-end',
              icon: 'warning',
              title: mensajeError,
              showConfirmButton: false,
              timer: 3000
            });

            // Opcional: Remover de la lista de visualización si falló la validación técnica
            const index = this.anexosTransitoFiles.findIndex(f => f.relativePath === droppedFile.relativePath);
            if (index > -1) this.anexosTransitoFiles.splice(index, 1);
          }
        });
      }
    }
  }

  public fileOverTransito(event: any) {
    console.log(event);
  }

  public fileLeaveTransito(event: any) {
    console.log(event);
  }

  deleteAnexosTransito(posicion: number) {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: "¿Desea eliminar el archivo seleccionado?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_delete"), // Asegúrate de tener esta llave en tu i18n
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        // Eliminamos de los 3 arreglos usando el mismo índice
        this.anexosTransitoFiles.splice(posicion, 1);
        this.anexosTransitoNames.splice(posicion, 1);
        this.anexosTransitoDocs.splice(posicion, 1);

        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Archivo eliminado correctamente',
          showConfirmButton: false,
          timer: 1500
        });
      }
    });
  }

  public registrarUnidadLlegada(vUnidad:any): void {
    if (vUnidad.new_fecha_real_arribo == '' || vUnidad.new_observaciones_arribo == '') {
      this.primeAlerts.add({ 
        severity: 'warn', 
        summary: 'Campos Incompletos', 
        detail: 'Por favor complete todos los campos requeridos.' 
      });
      return;
    }

    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_insert"),
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_insert"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this.logisticaService.logisticaCompraRegistrarLlegada(
          this.logistica_seguimiento_token,
          vUnidad.token_seguimiento_unidad,
          vUnidad.new_fecha_real_arribo,
          vUnidad.new_observaciones_arribo,
          this.anexosTransitoDocs
        ).subscribe({
          next: (response) => {    
            let translate_response = this.translate.instant(response.message);        
            if (response.status === 'success') {
              this.primeAlerts.add({ severity: 'success', summary: 'SOS-México informa:', detail: translate_response });
              this.verfInfoCompra();
              this.relInterna.mensajeLogisticaSeguimiento("seguimiento_logistico",this.logistica_seguimiento_token);
            } else {
              this.primeAlerts.add({ severity: 'error', summary: 'SOS-México informa:', detail: translate_response });
            }
          },
          error: (error) => {
            this.primeAlerts.add({
              severity: 'error', 
              summary: 'Fallo en Servidor', 
              detail: error.error?.message || 'Ocurrió un problema al procesar la transacción.'
            });
          }
        });
      }
    })
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
