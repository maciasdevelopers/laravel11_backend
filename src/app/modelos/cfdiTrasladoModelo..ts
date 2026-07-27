export class cfdiTrasladoModelo {
  constructor(
    //cfdi:Comprobante
    public dataCFDI_comprobante_obj: any,
    public dataCFDI_comprobante_TipoComprobante: string,
    public dataCFDI_comprobante_TipoCambio: string,
    public dataCFDI_comprobante_Moneda: string,
    public dataCFDI_comprobante_MoneDecimales: number,
    public dataCFDI_comprobante_Total: string,
    public dataCFDI_comprobante_formaPago: string,
    public dataCFDI_comprobante_MetodoPago: string,
  
    //dataCFDIRelacionados
    public dataCFDIRelacionados_obj: any,
  
    //cfdi:Comprobante//cfdi:Emisor
    public dataCFDIEmisor_obj: any,
    public dataEmisor: any,
    public dataCFDI_emisor_Rfc: string,
    public dataCFDI_emisor_token: string,
    public dataCFDI_emisor_Rfc_registrado: boolean,
    public dataCFDI_emisor_new_registro: boolean,
  
    public aplica_anticipo_a_proveedor: string,
    public proveedorAnticipoTotal: number,
    public proveedorAnticipoTotalFormat: string,
    public proveedorAnticipoaplicado: number,
    public proveedorAnticipoRestanteFormat: string,
    public prov_seleccionado_acepta_credito: boolean,
  
    //cfdi:Comprobante//cfdi:Receptor
    public dataCFDIReceptor_obj: any,
    public dataCFDI_receptor_Rfc: string,
    public dataCFDI_receptor_UsoCFDI: string,
    //cfdi:Comprobante//cfdi:Conceptos'
    public dataCFDI_conceptos: any,
    public dataCFDIBuscarConcepto: any,
    public selectvalidatexmlArticulos: boolean,
    public compra_subtotal: string,
    public compra_descuento: string,
    public compra_retenciones: string,
    public compra_traslados: string,
    public compra_total: string,
    //impuestos //cfdi:Comprobante/cfdi:Impuestos
    public dataCFDI_impuestos_retenidos_total: number,
    public dataCFDI_impuestos_retenidos_lista: any,
    public dataCFDI_impuestos_trasladados_total: number,
    public dataCFDI_impuestos_trasladados_lista: any,
    //cfdi:Comprobante//cfdi:Complemento//t:TimbreFiscalDigital
    //dataCFDIComplemento
    public dataCFDIComplemento_obj: any,
    public dataCFDIComplemento_carta_porte_obj: any,
    public dataCFDI_complemento_UUID: string,
    public dataCFDI_complemento_SelloCFD: string,
  ) { }
}