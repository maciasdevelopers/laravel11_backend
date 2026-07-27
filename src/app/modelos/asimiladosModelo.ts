export class asimiladosModelo{
  constructor(
    public periodo_inicio:string,
    public periodo_fin:string,
    public fecha_pago:string,
    public moneda_code:string,
    public moneda_decimales:number,
    public dias_pagados:string,
    public total_percepciones:number,
    public percepciones_window:boolean,
    public percepciones_servicio_token:string,
    public total_deducciones:number,
    public deducciones_window:boolean,
    public deducciones_impuesto_token:string
  ){}
}

