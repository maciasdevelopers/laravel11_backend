import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core'; 
import { ProveedoresService } from '../../../../../servicios/proveedores.service';
import { ProductosService } from '../../../../../servicios/ssic/productos.service';
import { ServiciosService } from '../../../../../servicios/ssic/servicios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registros_para_autorizar',
  templateUrl: './registros_para_autorizar.component.html',
  standalone:false,
  styleUrls: [
    '../../../../../styles/explain.css',
    '../../../../../styles/input_group.css',
    '../../../../../styles/file_input.css',
    '../../../../../styles/loading.css',
    '../../../../../styles/navegador.css',
    '../../../../../styles/listas_ps.css',
    '../../../../../styles/datatable.css',
    '../../../../../styles/dropdown.css',
    '../../../../../styles/tabs.css',
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
    '../../contabilidad.css',
    './registros_para_autorizar.component.css',
  ]
})
export class RegistrosParaAutorizarComponent implements OnInit {
  public isProductosCollapsed:boolean = false;
  public isServiciosCollapsed:boolean = true;
  public isProveedoresCollapsed:boolean = true;
  public isClientesCollapsed:boolean = true;

  listaProductos:any = [];
  public view_lista_productos:boolean = false;

  public view_lista_servicios:boolean = false;
  listaServicios:any = [];

  public view_lista_proveedores:boolean = false;
  listaProveedores:any = [];

  public view_lista_clientes:boolean = false;
  listaClientes:any = [];
  constructor(
    private translate:TranslateService,
    private _prodService: ProductosService,
    private _provServ: ProveedoresService,
    private _servicioServ:ServiciosService
  ) { }

  ngOnInit(): void {
    this.lista_NotAuthorizadosProductos();
    this.lista_NotAuthorizadosServicios();
    this.lista_NotAuthorizadosProveedores();
    this.lista_NotAuthorizadosClientes();
  }

//productos
  lista_NotAuthorizadosProductos(){
    this.view_lista_productos = false;
    this._prodService.catalogoProductosNotAutorizados().subscribe(
      response => {
        console.log(response.status);
        this.view_lista_productos = true;
        if (response.status == 'success') {
          this.listaProductos = response.listado;
        }
      },
      error => {
        console.log(error);
      }
    );
  }
  
  autorizarProducto(token_cat_productos:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this._prodService.productoAutorizar(token_cat_productos).subscribe(
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
              this.lista_NotAuthorizadosProductos();
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
      } else {

      }
    });
  }

//servicios
  lista_NotAuthorizadosServicios(){
    this.view_lista_servicios = false;
    this._servicioServ.inventariosServiciosNotAutorizados().subscribe(
      response => {
        console.log(response.status);
        this.view_lista_servicios = true;
        if (response.status == 'success') {
          this.listaServicios = response.listado;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  autorizarServicio(token_cat_servicios:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this._servicioServ.servicioAutorizar(token_cat_servicios).subscribe(
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
              this.lista_NotAuthorizadosServicios();
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
      } else {

      }
    });
  }

//proveedores
  lista_NotAuthorizadosProveedores(){
    this.view_lista_proveedores = false;
    this._provServ.catalogo_prov_no_autorizados().subscribe(
      response => {
        this.view_lista_proveedores = true;
          if (response.status == 'success') {
            console.log(response);
            this.listaProveedores = response.listado;
          }
      },
      error => {
        console.log(error);
      }
    );
  }

  validarProveedor(token_proveedor:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this._provServ.validarProveedor(token_proveedor).subscribe(
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
              this.lista_NotAuthorizadosProveedores();
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
      } else {

      }
    });
  }

//proveedores
  lista_NotAuthorizadosClientes(){
    this.view_lista_clientes = false;
    this._provServ.catalogo_prov_no_autorizados().subscribe(
      response => {
        this.view_lista_clientes = true;
          if (response.status == 'success') {
            console.log(response);
            this.listaClientes = response.listado;
          }
      },
      error => {
        console.log(error);
      }
    );
  }

  validarCliente(token_cliente:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_update"),
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_update"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this._provServ.validarProveedor(token_cliente).subscribe(
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
              this.lista_NotAuthorizadosClientes();
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
      } else {

      }
    });
  }
}
