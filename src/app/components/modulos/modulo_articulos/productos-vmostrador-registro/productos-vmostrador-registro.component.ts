import { Component, OnInit } from '@angular/core';
import { ValidatorServService } from '../../../../servicios/validator-serv.service';
import { productoAngularModelo } from '../../../../modelos/productoAngularModelo';
import { UniMedServService } from '../../../../servicios/uni-med-serv.service';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { ProductosService } from '../../../../servicios/ssic/productos.service';
import { ComunicacionInternaService } from '../../../../servicios/comunicacion-interna.service';
import { MonedasService } from '../../../../servicios/monedas.service';

@Component({
  selector: 'app-productos-vmostrador-registro',
  standalone: false,
  
  templateUrl: './productos-vmostrador-registro.component.html',
  styleUrl: './productos-vmostrador-registro.component.css'
})
export class ProductosVmostradorRegistroComponent implements OnInit{
    public modelProd: productoAngularModelo;
    unidadMedidaCatalogoApi:any = [];
    catalogoMonedasApi:any = [];
    public new_clave_registro: string = "";
    public new_clave_valor: string = "";
    listaClaveProd:any = [];
    public progressBarRegistro:boolean = false;
  constructor(
    private validator:ValidatorServService,
    private _medidasCat:UniMedServService,
    private translate:TranslateService,
    private _prodService: ProductosService,
    private _monedasServ: MonedasService,
    private relInterna:ComunicacionInternaService
  ){
    this.modelProd = new productoAngularModelo('','','','','','','','','',0,0,'','','','','','','',false,false,false,'',0,'','','','',[]);
  }

  ngOnInit(): void {
    this.catalogoUnidadDeMedidaApi();
    this.monedasCatalogoApi();
  }

  catalogoUnidadDeMedidaApi(){
    this._medidasCat.inventUnidadesMedidaEnabledCatalogo().subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response.listaUMedida);
          this.unidadMedidaCatalogoApi = response.listaUMedida;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  monedasCatalogoApi(){
    this._monedasServ.getApiMonedasCatalogo().subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response.monedas);
          this.catalogoMonedasApi = response.monedas;
          /*
            "number": 784,
            "code": "AED",
            "decimales": "2",
            "langEN": "United Arab Emirates dirham",
            "langIT": "Dirham degli Emirati Arabi Uniti",
            "symbol_decimal": "1583;46;1573",
            "symbol_hex": "062F;002E;0625"
          */
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  keyupProdConcepto(event:any){
    const validacion = event.value != "" && this.validator.filtroAlfaNumerico(event.value);
    this.modelProd.concepto = validacion ? event.value : '';
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupPrecioAplicableProd(event:any){
    const validacion = event.value != "" && this.validator.filtroNum(event.value) == true;
    this.modelProd.precio_aplicable = validacion ? event.value : 0;
    validacion ? this.validator.correctoInputRow(event) : this.validator.errorInputRow(event);
  }

  keyupUnidadMedidaSalidaApiProd(simbolo: any) {
    var unidadDeMedidaDeSalida = document.getElementById("unidadDeMedidaDeSalida");
    const medUni = this.unidadMedidaCatalogoApi.find((row: any) => row.simbolo === simbolo);//Unidad
    const validacion = simbolo != '' && typeof medUni !== 'undefined'; 
    this.modelProd.unidad_salida_clave = validacion && medUni ? medUni.nombre : "";
    validacion ? this.validator.correctoSelectBrowser(unidadDeMedidaDeSalida) : this.validator.errorSelectBrowser(unidadDeMedidaDeSalida);
  }

  keyupValidateMonedaApi(code:any){
    var monedasProducto = document.getElementById("monedasProducto");
    const mnd = this.catalogoMonedasApi.find((row: any) => row.code === code);
    const validacion = code != '' && this.validator.filtroAlfaNumerico(code) && typeof mnd !== 'undefined';
    this.modelProd.moneda_codigo = validacion ? mnd.code : '';
    validacion ? this.validator.correctoSelectBrowser(monedasProducto) : this.validator.errorSelectBrowser(monedasProducto);
  }

  keyupListaClaveInternaClaveNew(objetoTextClave:any){
    const validacion = objetoTextClave.value != '' && this.validator.filtroAlfaNumerico(objetoTextClave.value) == true;
    this.new_clave_registro = validacion ? objetoTextClave.value : '';
    validacion ? this.validator.correctoInputRow(objetoTextClave) : this.validator.errorInputRow(objetoTextClave);
  }

  keyupListaClaveInternaValorNew(objetoTextClave:any){
    const validacion = objetoTextClave.value != '' && this.validator.filtroAlfaNumerico(objetoTextClave.value) == true;
    this.new_clave_valor = validacion ? objetoTextClave.value : '';
    validacion ? this.validator.correctoInputRow(objetoTextClave) : this.validator.errorInputRow(objetoTextClave);
  }

  agregaClave(){
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
        var clave_nw = document.getElementById("claveNewAlta");
        var clave_Inter = document.getElementById("claveInterna");
        this.listaClaveProd.push({
          "clave_name":this.new_clave_registro,
          "valor_name":this.new_clave_valor
        });
        this.new_clave_registro = "";
        this.new_clave_valor = "";
        this.validator.limpiaInputRow(clave_nw);
        this.validator.limpiaInputRow(clave_Inter);
      }
    });
  }
  
  eliminaClave(position:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_delete"),
      icon: 'warning',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_delete"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this.listaClaveProd.splice(position,1);
      }
    });
  }

  get validaRegistroProd():boolean{
    return (this.modelProd.concepto != '' && this.modelProd.precio_aplicable == 0 && this.modelProd.unidad_salida_clave == '' && this.modelProd.moneda_codigo == '' && this.listaClaveProd.length == 0);
  }

  registraProducto(form:{reset:() => void;}):void{
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
        this._prodService.registraNewProductoMostrador(
          this.modelProd.concepto,
          this.modelProd.precio_aplicable,
          this.modelProd.unidad_salida_clave,
          this.modelProd.unidad_salida_homologada,
          this.modelProd.moneda_codigo,
          this.modelProd.moneda_homologada,
          this.listaClaveProd,
          this.modelProd.impuestos
        ).subscribe(
          response => {
            let translate_response = this.translate.instant(response.message);
            if (response.status == 'success') {
              this.progressBarRegistro = false;
              form.reset();
              setTimeout(() => {
                Swal.fire({
                  position:'center',
                  icon: 'success',
                  title: translate_response,
                  showConfirmButton:false,
                  timer: 3000
                });
                this.relInterna.mensajeRegistroProdVentasMostrador("producto registrado");
              },3000);
            }
            if (response.status == 'error') {
              this.progressBarRegistro = false;
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
        );
      }
    });
  }
}
