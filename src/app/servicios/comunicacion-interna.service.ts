import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComunicacionInternaService {
  private respuestaLoginUser = new Subject<string>();
  mensajeLoginUser$ = this.respuestaLoginUser.asObservable();

  private respuestaRegistroProductoInventarios = new Subject<string>();
  mensajeProdInvent$ = this.respuestaRegistroProductoInventarios.asObservable();

  private respuestaRegistroProductoVMostrador = new Subject<string>();
  mensajeProdVMostrador$ = this.respuestaRegistroProductoVMostrador.asObservable();

  private respuestaVerProdToken = new Subject<string>();
  token_cat_productos$ = this.respuestaVerProdToken.asObservable();
  private respuestaVerGeneralesProd = new Subject<string>();
  mensajeVerGeneralesProd$ = this.respuestaVerGeneralesProd.asObservable();

  private respuestaVerAlmacenamientoProd = new Subject<string>();
  mensajeVerAlmacenamientoProd$ = this.respuestaVerAlmacenamientoProd.asObservable();

  private respuestaVerKardexProd = new Subject<string>();
  mensajeVerKardexProd$ = this.respuestaVerKardexProd.asObservable();

  private respuestaMoveToPepelera = new Subject<string>();
  mensajeMoveToPepelera$ = this.respuestaMoveToPepelera.asObservable();

  private respuestaRestaurarProd = new Subject<string>();
  mensajeRestaurarProd$ = this.respuestaRestaurarProd.asObservable();

  private respuestaDeleteProd = new Subject<string>();
  mensajeDeleteProd$ = this.respuestaDeleteProd.asObservable();

  //sector inventarios
  //servicios
  private respuestaInsertServCompras = new Subject<string>();
  mensajeInsertServCompras$ = this.respuestaInsertServCompras.asObservable();
  private respuestaVerServCompras = new Subject<string>();
  mensajeVerServCompras$ = this.respuestaVerServCompras.asObservable();
  private respuestaVerServComprasToken = new Subject<string>();
  token_cat_servicios_compras$ = this.respuestaVerServComprasToken.asObservable();

  private respuestaInsertServVentas = new Subject<string>();
  mensajeInsertServVentas$ = this.respuestaInsertServVentas.asObservable();
  private respuestaVerServVentas = new Subject<string>();
  mensajeVerServVentas$ = this.respuestaVerServVentas.asObservable();
  private respuestaVerServVentasToken = new Subject<string>();
  token_cat_servicios_ventas$ = this.respuestaVerServVentasToken.asObservable();

  private respuestaInsertServMostrador = new Subject<string>();
  mensajeInsertServMostrador$ = this.respuestaInsertServMostrador.asObservable();
  private respuestaVerServMostrador = new Subject<string>();
  mensajeVerServMostrador$ = this.respuestaVerServMostrador.asObservable();
  private respuestaVerServMostradorToken = new Subject<string>();
  token_cat_servicios_mostrador$ = this.respuestaVerServMostradorToken.asObservable();
  private respuestaInsertEstablecimiento = new Subject<string>();
  mensajeInsertEstablecimiento$ = this.respuestaInsertEstablecimiento.asObservable();

  //sector finanzas
  //ordenes de dispersión de nómina
  private respuestaOrdDisperSeccionModule = new Subject<string>();
  mensajeOrdDisperSeccionModule$ = this.respuestaOrdDisperSeccionModule.asObservable();
  //solicitudes de cancelación
  private respuestaFNZSSoliCancelacion = new Subject<string>();
  mensajeFNZSSoliCancelacion$ = this.respuestaFNZSSoliCancelacion.asObservable();
  //ordenes de pago
  private respuestaOrdPagoSeccionModule = new Subject<string>();
  mensajeOrdPagoSeccionModule$ = this.respuestaOrdPagoSeccionModule.asObservable();

  private respuestaOrdAuthChange = new Subject<string>();
  mensajeOrdAuthChange$ = this.respuestaOrdAuthChange.asObservable();

  private respuestaPagoRealizado = new Subject<string>();
  mensajePagoRealizado$ = this.respuestaPagoRealizado.asObservable();

  //cajas
  private respuestaInsertCAJA = new Subject<string>();
  mensajeInsertCAJA$ = this.respuestaInsertCAJA.asObservable();

  //cuentas bancarias
  private respuestaInsertCUENTA = new Subject<string>();
  mensajeInsertCUENTA$ = this.respuestaInsertCUENTA.asObservable();

  //dispositivos
  private respuestaInsertDEVICE = new Subject<string>();
  mensajeInsertDEVICE$ = this.respuestaInsertDEVICE.asObservable();

  //monederos electronicos
  private respuestaInsertMONEDERO = new Subject<string>();
  mensajeInsertMONEDERO$ = this.respuestaInsertMONEDERO.asObservable();
  //acreedores
  private respuestaInsertAcreedor = new Subject<string>();
  mensajeInsertAcreedor$ = this.respuestaInsertAcreedor.asObservable();
  private respuestaListaAcreedores = new Subject<string>();
  mensajeListaAcreedores$ = this.respuestaListaAcreedores.asObservable();
  private respuestaAcreedorMovRegistrado = new Subject<string>();
  mensajeAcreedorMovRegistrado$ = this.respuestaAcreedorMovRegistrado.asObservable();
  //deudores
  private respuestaInsertDeudor = new Subject<string>();
  mensajeInsertDeudores$ = this.respuestaInsertDeudor.asObservable();
  private respuestaListaDeudores = new Subject<string>();
  mensajeListaDeudores$ = this.respuestaListaDeudores.asObservable();
  private respuestaDeudorMovRegistrado = new Subject<string>();
  mensajeDeudorMovRegistrado$ = this.respuestaDeudorMovRegistrado.asObservable();
  //ordenes de pago 
  //deudores
  private recargaAnticiposDeudorInsert = new Subject<string>();
  mensajeAnticipoDeudorRecarga$ = this.recargaAnticiposDeudorInsert.asObservable();
  
  private respuestaAnticipoDeudorInsert = new Subject<string>();
  mensajeAnticipoDeudorInsert$ = this.respuestaAnticipoDeudorInsert.asObservable();

  //sector egresos
  private respuestaSoliCancelEEGR = new Subject<string>();
  mensajeSoliCancelEEGR$ = this.respuestaSoliCancelEEGR.asObservable();
  //logistica
  private respuestaLogisticaRegistro = new Subject<string>();
  mensajeLogisticaRegistro$ = this.respuestaLogisticaRegistro.asObservable();
  private respuestaLogisticaSeguimiento = new Subject<string>();
  mensajeLogisticaSeguimiento$ = this.respuestaLogisticaSeguimiento.asObservable();
  private respuestaLogisticaTokenSeguimiento = new Subject<string>();
  logisticaSeguimientoToken$ = this.respuestaLogisticaTokenSeguimiento.asObservable();
  //proveedores egresos
  private respuestaRegistroProveedorEgresos = new Subject<string>();
  mensajeProveedorEgresos$ = this.respuestaRegistroProveedorEgresos.asObservable();
  //registro de compra
  private respuestaRegistroCompraEgresos = new Subject<string>();
  mensajeCompraRegistro$ = this.respuestaRegistroCompraEgresos.asObservable();
  private respuestaCompraExcelDescarga = new Subject<string>();
  mensajeCompraExcelDescarga$ = this.respuestaCompraExcelDescarga.asObservable();
  //pagar orden de compra
  private respuestaPagarCompraEgresos = new Subject<string>();
  mensajeCompraPagar$ = this.respuestaPagarCompraEgresos.asObservable();
  private respuestaPagarCompraToken = new Subject<string>();
  token_compras$ = this.respuestaPagarCompraToken.asObservable();
  private respuestaPagarCompraOrdenPagoToken = new Subject<string>();
  tokenOrdenPago$ = this.respuestaPagarCompraOrdenPagoToken.asObservable();
  private respuestaPagoRealizadoCompra = new Subject<string>();
  mensajePagoRealizadoCompra$ = this.respuestaPagoRealizadoCompra.asObservable();
  //desglose de compra
  private respuestaComprasDesglose = new Subject<string>();
  mensajeComprasDesglose$ = this.respuestaComprasDesglose.asObservable();
  private respuestaCompraToken = new Subject<string>();
  tokenCompraExtraido$ = this.respuestaCompraToken.asObservable();
  //recepcion de compra
  private respuestaComprasRecepcion = new Subject<string>();
  mensajeComprasRecepcion$ = this.respuestaComprasRecepcion.asObservable();
  //prorrateos de compra
  private respuestaComprasProrrateos = new Subject<string>();
  mensajeComprasProrrateos$ = this.respuestaComprasProrrateos.asObservable();
  //Reembolsos
  private respuestaComiReemSeccionModule = new Subject<string>();
  mensajeComiReemSeccionModule$ = this.respuestaComiReemSeccionModule.asObservable();
  private respuestaComprasDesgloseReembolso = new Subject<string>();
  mensajeComprasDesgloseReembolso$ = this.respuestaComprasDesgloseReembolso.asObservable();
  private respuestaComprasTokenReembolso = new Subject<string>();
  mensajeComprasTokenReembolso$ = this.respuestaComprasTokenReembolso.asObservable();
  private respuestaEgresosReembolsoLGeneral = new Subject<string>();
  mensajeEgresosReembolsoLGeneral$ = this.respuestaEgresosReembolsoLGeneral.asObservable();
  private respuestaEgresosReembolsoAutorizado = new Subject<string>();
  mensajeEgresosReembolsoAutorizado$ = this.respuestaEgresosReembolsoAutorizado.asObservable();

  private respuestaEgresosComisionLGeneral = new Subject<string>();
  mensajeEgresosComisionLGeneral$ = this.respuestaEgresosComisionLGeneral.asObservable();
  private respuestaEgresosComisionNoConcluida = new Subject<string>();
  mensajeEgresosComisionNoConcluida$ = this.respuestaEgresosComisionNoConcluida.asObservable();
  private respuestaEgresosComisionConcluida = new Subject<string>();
  mensajeEgresosComisionConcluida$ = this.respuestaEgresosComisionConcluida.asObservable();
  private respuestaEgresosComisionDeshabilitada = new Subject<string>();
  mensajeEgresosComisionDeshabilitada$ = this.respuestaEgresosComisionDeshabilitada.asObservable();
  //valor humano
  private respuestaSoliCancelVHUM = new Subject<string>();
  mensajeSoliCancelVHUM$ = this.respuestaSoliCancelVHUM.asObservable();
  private respuestaVHTrabajoCentroRegistro = new Subject<string>();
  mensajeVHTrabajoCentroRegistro$ = this.respuestaVHTrabajoCentroRegistro.asObservable();
  private respuestaVHTrabajadorRegistro = new Subject<string>();
  mensajeVHTrabajadorRegistro$ = this.respuestaVHTrabajadorRegistro.asObservable();
  private respuestaVHNominaRegistro = new Subject<string>();
  mensajeVHNominaRegistro$ = this.respuestaVHNominaRegistro.asObservable();
  private respuestaVHAsimiladosRegistro = new Subject<string>();
  mensajeVHAsimiladosRegistro$ = this.respuestaVHAsimiladosRegistro.asObservable();
  private respuestaVHNominaImpuestoRegistro = new Subject<string>();
  mensajeVHNominaImpuestoRegistro$ = this.respuestaVHNominaImpuestoRegistro.asObservable();
  private respuestaVHAportaSEGSocialIMSS = new Subject<string>();
  mensajeVHAportaSEGSocialIMSS$ = this.respuestaVHAportaSEGSocialIMSS.asObservable();
  //contabilidad
  private respuestaContDeclaracionesRegistro = new Subject<string>();
  mensajeContDeclaracionesRegistro$ = this.respuestaContDeclaracionesRegistro.asObservable();
  
  private respuestaPublicacionRegistro = new Subject<string>();
  mensajePublicacionRegistro$ = this.respuestaPublicacionRegistro.asObservable();

  constructor() { }

  mensajeLoginUser(mensaje: any) {
    this.respuestaLoginUser.next(mensaje);
    //private respuestaLoginUser = new Subject<string>();
    //mensajeLoginUser$ = this.respuestaLoginUser.asObservable();
  }

  mensajeRegistroProdInvent(mensaje: any) {
    this.respuestaRegistroProductoInventarios.next(mensaje);
  }

  mensajeRegistroProdVentasMostrador(mensaje: any) {
    this.respuestaRegistroProductoVMostrador.next(mensaje);
  }

  mensajeVerGeneralesProd(mensaje: any, cat_productos: any) {
    this.respuestaVerGeneralesProd.next(mensaje);
    this.respuestaVerProdToken.next(cat_productos);
  }

  mensajeVerAlmacenamientoProd(mensaje: any, cat_productos: any) {
    this.respuestaVerAlmacenamientoProd.next(mensaje);
    this.respuestaVerProdToken.next(cat_productos);
  }

  mensajeVerKardexProd(mensaje: any, cat_productos: any) {
    this.respuestaVerKardexProd.next(mensaje);
    this.respuestaVerProdToken.next(cat_productos);
  }

  mensajeMoviendoProdToPapalera(mensaje: any) {
    this.respuestaMoveToPepelera.next(mensaje);
  }

  mensajeRestaurandoProd(mensaje: any) {
    this.respuestaRestaurarProd.next(mensaje);
  }

  mensajeProdEliminando(mensaje: any) {
    this.respuestaDeleteProd.next(mensaje);
  }

  //sector inventarios
  //servicios
  mensajeInsertServCompras(mensaje: any) {
    this.respuestaInsertServCompras.next(mensaje);
  }

  mensajeVerServCompras(mensaje: any, cat_servicios: any) {
    this.respuestaVerServCompras.next(mensaje);
    this.respuestaVerServComprasToken.next(cat_servicios);
  }

  mensajeInsertServVentas(mensaje: any) {
    this.respuestaInsertServCompras.next(mensaje);
  }

  mensajeVerServVentas(mensaje: any, cat_servicios: any) {
    this.respuestaVerServVentas.next(mensaje);
    this.respuestaVerServVentasToken.next(cat_servicios);
  }

  mensajeInsertServMostrador(mensaje: any) {
    this.respuestaInsertServCompras.next(mensaje);
  }

  mensajeVerServMostrador(mensaje: any, cat_servicios: any) {
    this.respuestaVerServMostrador.next(mensaje);
    this.respuestaVerServMostradorToken.next(cat_servicios);
  }

  mensajeInsertEstablecimiento(mensaje: any) {
    this.respuestaInsertEstablecimiento.next(mensaje);
    //private respuestaInsertEstablecimiento = new Subject<string>();
    //mensajeInsertEstablecimiento$ = this.respuestaInsertEstablecimiento.asObservable();
  }


  //sector finanzas
  //ordenes de dispersión de nómina
    mensajeOrdDisperSeccionModule(mensaje: any) {
      this.respuestaOrdDisperSeccionModule.next(mensaje);
    }

  //ordenes de pago
    mensajeFNZSSoliCancelacion(mensaje: any) {
      this.respuestaFNZSSoliCancelacion.next(mensaje);
    }
    
  //ordenes de pago
    mensajeOrdPagoSeccionModule(mensaje: any) {
      this.respuestaOrdPagoSeccionModule.next(mensaje);
    }

    mensajeOrdAuthChange(mensaje: any) {
      this.respuestaOrdAuthChange.next(mensaje);
    }

    mensajePagoRealizado(mensaje: any) {
      this.respuestaPagoRealizado.next(mensaje);
    }
  //cajas
  mensajeCAJAInsert(mensaje: any) {
    this.respuestaInsertCAJA.next(mensaje);
  }

  //cuentas bancarias
  mensajeCuentaInsert(mensaje: any) {
    this.respuestaInsertCUENTA.next(mensaje);
  }

  //dispositivos
  mensajeDEVICEInsert(mensaje: any) {
    this.respuestaInsertDEVICE.next(mensaje);
  }

  //monederos electronicos
  mensajeMONEDEROInsert(mensaje: any) {
    this.respuestaInsertMONEDERO.next(mensaje);
  }

  //acreedores
  mensajeAcreedorInsert(mensaje: any) {
    this.respuestaInsertAcreedor.next(mensaje);
  }
  mensajeAcreedoresListas(mensaje: any) {
    this.respuestaListaAcreedores.next(mensaje);
  }
  mensajeAcreedorMovimientoRegistrado(mensaje: any) {
    this.respuestaAcreedorMovRegistrado.next(mensaje);
  }

  //monederos electronicos
  mensajeDeudorInsert(mensaje: any) {
    this.respuestaInsertDeudor.next(mensaje);
  }
  mensajeDeudoresLista(mensaje: any) {
    this.respuestaListaDeudores.next(mensaje);
  }
  mensajeDeudorMovimientoRegistrado(mensaje: any) {
    this.respuestaDeudorMovRegistrado.next(mensaje);
  }
  //ordenes de pago
  //deudores
  mensajeAnticipoDeudorRecarga(mensaje: any) {
    this.recargaAnticiposDeudorInsert.next(mensaje);
  }
  //private recargaAnticiposDeudorInsert = new Subject<string>();
  //mensajeAnticipoDeudorRecarga$ = this.recargaAnticiposDeudorInsert.asObservable();
  mensajeAnticipoDeudorInsert(mensaje: any) {
    this.respuestaAnticipoDeudorInsert.next(mensaje);
  }
  //private respuestaAnticipoDeudorInsert = new Subject<string>();
  //mensajeAnticipoDeudorInsert$ = this.respuestaAnticipoDeudorInsert.asObservable();

  //sector egresos
  mensajeSoliCancelEEGR(mensaje: any) {
    this.respuestaSoliCancelEEGR.next(mensaje);
  }

  mensajeLogisticaRegistro(mensaje: any) {
    this.respuestaLogisticaRegistro.next(mensaje);
    //private respuestaLogisticaRegistro = new Subject<string>();
    //mensajeLogisticaRegistro$ = this.respuestaLogisticaRegistro.asObservable();
  }
  mensajeLogisticaSeguimiento(mensaje: any,logistica_seguimiento_token:string) {
    this.respuestaLogisticaSeguimiento.next(mensaje);
    this.respuestaLogisticaTokenSeguimiento.next(logistica_seguimiento_token);
    //logisticaSeguimientoToken$ = this.respuestaLogisticaTokenSeguimiento.asObservable();
    //private respuestaLogisticaRegistro = new Subject<string>();
    //mensajeLogisticaRegistro$ = this.respuestaLogisticaRegistro.asObservable();
  }

  //mensajeComprasPagarRegistro(mensaje: any, token_compras: any, token_proveedor: any, token_ordenPago: any) {
  //  this.respuestaPagarCompraEgresos.next(mensaje);
  //  this.respuestaPagarCompraToken.next(JSON.stringify({ token_compras: token_compras, token_proveedor: token_proveedor, token_ordenPago: token_ordenPago }));
  //  this.respuestaPagarCompraOrdenPagoToken.next(token_ordenPago);
  //}
  //recepcion de compra
  mensajeProveedorRegistro(mensaje: any) {
    this.respuestaRegistroProveedorEgresos.next(mensaje);
  }
  //registro de compra
  mensajeComprasRegistro(mensaje: any) {
    this.respuestaRegistroCompraEgresos.next(mensaje);
  }
  mensajeComprasDescargaExcel(mensaje: any) {
    this.respuestaCompraExcelDescarga.next(mensaje);
  }
  mensajeComprasPagarRegistro(mensaje: any, token_compras: any, token_proveedor: any, token_ordenPago: any) {
    this.respuestaPagarCompraEgresos.next(mensaje);
    this.respuestaPagarCompraToken.next(JSON.stringify({ token_compras: token_compras, token_proveedor: token_proveedor, token_ordenPago: token_ordenPago }));
    this.respuestaPagarCompraOrdenPagoToken.next(token_ordenPago);
  }
  mensajeComprasPagoRegistrado(mensaje: any) {
    this.respuestaPagoRealizadoCompra.next(mensaje);
  }

  //desglose de compra
  mensajeComprasDesglose(mensaje: any, token_compras: any) {
    this.respuestaComprasDesglose.next(mensaje);
    this.respuestaCompraToken.next(token_compras);
  }

  //recepcion de compra
  mensajeComprasRecepcion(mensaje: any) {
    this.respuestaComprasRecepcion.next(mensaje);
  }

  //prorrateos de compra
  mensajeComprasProrrateos(mensaje: any) {
    this.respuestaComprasProrrateos.next(mensaje);
  }

  //Reembolsos
  mensajeComiReemSeccionModule(mensaje: any) {
    this.respuestaComiReemSeccionModule.next(mensaje);
  }

  mensajeComprasReembolsosDesglose(mensaje: any, token_reem: any) {
    console.log(mensaje + " " + token_reem);
    this.respuestaComprasDesgloseReembolso.next(mensaje);
    this.respuestaComprasTokenReembolso.next(token_reem);
  }

  mensajeEgresosReembolsosListaGeneral(mensaje: any) {
    this.respuestaEgresosReembolsoLGeneral.next(mensaje);
  }

  mensajeEgresosReembolsosAutorizados(mensaje: any) {
    this.respuestaEgresosReembolsoAutorizado.next(mensaje);
  }

  mensajeEgresosComisionLGeneral(mensaje: any) {
    this.respuestaEgresosComisionLGeneral.next(mensaje);
  }

  mensajeEgresosComisionNoConcluida(mensaje: any) {
    this.respuestaEgresosComisionNoConcluida.next(mensaje);
  }

  mensajeEgresosComisionConcluida(mensaje: any) {
    this.respuestaEgresosComisionConcluida.next(mensaje);
  }

  mensajeEgresosComisionDeshabilitada(mensaje: any) {
    this.respuestaEgresosComisionDeshabilitada.next(mensaje);
  }

  //valor humano
  mensajeSoliCancelVHUM(mensaje: any) {
    this.respuestaSoliCancelVHUM.next(mensaje);
  }

  mensajeTrabajoCentroRegistro(mensaje: any) {
    this.respuestaVHTrabajoCentroRegistro.next(mensaje);
    //private respuestaVHTrabajoCentroRegistro = new Subject<string>();
    //mensajeVHTrabajoCentroRegistro$ = this.respuestaVHTrabajoCentroRegistro.asObservable();
  }

  mensajeTrabajadorRegistro(mensaje: any) {
    this.respuestaVHTrabajadorRegistro.next(mensaje);
    //private respuestaVHTrabajadorRegistro = new Subject<string>();
    //mensajeVHTrabajadorRegistro$ = this.respuestaVHTrabajadorRegistro.asObservable();
  }

  mensajeNominaRegistro(mensaje: any) {
    this.respuestaVHNominaRegistro.next(mensaje);
    //private respuestaVHNominaRegistro = new Subject<string>();
    //mensajeVHNominaRegistro$ = this.respuestaVHNominaRegistro.asObservable();
  }

  mensajeAsimiladosRegistro(mensaje: any) {
    this.respuestaVHAsimiladosRegistro.next(mensaje);
    //private respuestaVHAsimiladosRegistro = new Subject<string>();
    //mensajeVHAsimiladosRegistro$ = this.respuestaVHAsimiladosRegistro.asObservable();
  }

  mensajeNominaImpuestoRegistro(mensaje: any) {
    this.respuestaVHNominaImpuestoRegistro.next(mensaje);
    //private respuestaVHNominaImpuestoRegistro = new Subject<string>();
    //mensajeVHNominaImpuestoRegistro$ = this.respuestaVHNominaImpuestoRegistro.asObservable();
  }

  mensajeVHAportaSEGSocialIMSS(mensaje: any) {
    this.respuestaVHAportaSEGSocialIMSS.next(mensaje);
    //private respuestaVHAportaSEGSocialIMSS = new Subject<string>();
    //mensajeVHAportaSEGSocialIMSS$ = this.respuestaVHAportaSEGSocialIMSS.asObservable();
  }

  //contabilidad
  mensajeDeclaracionesRegistro(mensaje: any) {
    this.respuestaContDeclaracionesRegistro.next(mensaje);
    //private respuestaContDeclaracionesRegistro = new Subject<string>();
    //mensajeContDeclaracionesRegistro$ = this.respuestaContDeclaracionesRegistro.asObservable();
  }

  //contabilidad
  mensajePublicacionRegistro(mensaje: any) {
    this.respuestaPublicacionRegistro.next(mensaje);
    //private respuestaContDeclaracionesRegistro = new Subject<string>();
    //mensajeContDeclaracionesRegistro$ = this.respuestaContDeclaracionesRegistro.asObservable();
  }
}
