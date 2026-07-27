export class soliCfdiAngularModelo{
    constructor(
        public client_tkn_soli:string,
        public rfc_soli:string,
        public emp_soli:string,
        public email_referencia:string,
        public fact_pagada:boolean,
        public tentativa_pago:string,
        public mes_de_venta:string,
        public importe_venta:string,
        public listXmlSoli:any,
    ){}
}
