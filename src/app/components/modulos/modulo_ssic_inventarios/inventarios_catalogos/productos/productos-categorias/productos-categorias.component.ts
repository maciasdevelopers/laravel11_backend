import { Component, OnInit } from '@angular/core';
import { ClasificacionService } from '../../../../../../servicios/ssic/clasificacion.service';
import { TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { MessageService, TreeNode } from 'primeng/api';
import { ValidatorServService } from '../../../../../../servicios/validator-serv.service';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-productos-categorias',
  standalone: false,
  
  templateUrl: './productos-categorias.component.html',
  styleUrl: './productos-categorias.component.css'
})
export class ProductosCategoriasComponent implements OnInit {
  clasificacion: string = '';
  subclasificacion: string = '';
  listaCategoriasProductos:TreeNode[] = [];

  constructor(
    private _clasifServ:ClasificacionService, 
    private validator:ValidatorServService,
    private translate:TranslateService,
    private messageService: MessageService){
  }

  ngOnInit(): void {
    this.listarClasificacionProductos();
  }

  new_clasificacion(event:any) {
    var validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value);
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  new_subclasificacion(event:any) {
    var validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value);
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  agregarRegistro() {
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
          this._clasifServ.saveClassifProd(this.clasificacion,this.subclasificacion).subscribe(
            response => {
              let translate_response = this.translate.instant(response.message);
              if (response.status == 'success') {
                Swal.fire({
                  position:'center',
                  icon: 'success',
                  title: translate_response,
                  showConfirmButton:false,
                  timer: 3000
                })
                //this.validator.limpiaInputRow(document.getElementById("txt_new_serie"));
                this.clasificacion = "";
                this.subclasificacion = "";
                this.listarClasificacionProductos();
                //this.formAddProducto.resetForm();
              }
              if (response.status == 'error') {
                Swal.fire({
                  position:'top-end',
                  icon: 'warning',
                  title: translate_response,
                  showConfirmButton:false,
                  timer: 3000
                })
              }
            },
            error => {
              console.log(error);
            }
          )
        }
      });
  }

  listarClasificacionProductos(){
    this._clasifServ.getClassifProd().subscribe(
      response => {
        if (response.status == 'success') {
          this.listaCategoriasProductos = response.categorias;
          console.log(this.listaCategoriasProductos);
        }
      },
      error => {
        console.log(error);
      }
    );
  }
}
