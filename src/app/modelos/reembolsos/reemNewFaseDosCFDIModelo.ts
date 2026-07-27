export class reemNewFaseDosCFDIModelo {
  constructor(
    public resultXml:string,
    //cfdi:Comprobante
    public dataCFDI_comprobante:any,
    public dataCFDI_comprobante_TipoComprobante:string,
    public dataCFDI_comprobante_TipoCambio:string,
    public dataCFDI_comprobante_Moneda:string,
    public dataCFDI_comprobante_MoneDecimales:number,
    public dataCFDI_comprobante_Total:string,
    public dataCFDI_comprobante_formaPago:string,
    public dataCFDI_comprobante_MetodoPago:string,
    //cfdi:Comprobante//cfdi:CfdiRelacionados
    public dataCFDIRelacionados:any,
    //cfdi:Comprobante//cfdi:Emisor
    public dataCFDI_emisor_Rfc:string,
    public dataCFDI_emisor_Token:string,
    public dataCFDI_emisor_Rfc_registrado:boolean,
    public dataCFDI_emisor_new_registro:boolean,
    public dataCFDIEmisor:any,
    //cfdi:Comprobante//cfdi:Receptor
    public dataCFDI_receptor_Rfc:string,
    public dataCFDIReceptor:any,
    public dataCFDI_receptor_UsoCFDI:string,
    //cfdi:Comprobante//cfdi:Conceptos'
    public dataCFDI_conceptos:any,
    public dataCFDIBuscarConcepto:string,
    public dataCFDIBuscarRetenciones:string,
    public retencionSeleccionada: any,
    public dataCFDIBuscarTraslados:string,
    public trasladoSeleccionado:string,
    public selectvalidatexmlArticulos:boolean,
    public compra_subtotal:string,
    public compra_descuento:string,
    public compra_retenciones:string,  
    public compra_traslados:string,
    public compra_total:string,
    //impuestos //cfdi:Comprobante/cfdi:Impuestos
    public dataCFDI_impuestos_retenidos_total:number,
    public dataCFDI_impuestos_retenidos_lista:any,
    public dataCFDI_impuestos_trasladados_total:number,
    public dataCFDI_impuestos_trasladados_lista:any,
    //cfdi:Comprobante//cfdi:Complemento//t:TimbreFiscalDigital
    public dataCFDIComplemento:any,
    public dataCFDI_complemento_UUID:string,
    public dataCFDI_complemento_SelloCFD:string,
  ) { }
}