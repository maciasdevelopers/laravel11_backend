export class cajaAngularModelo{
    constructor(
        public descripcion:string,
        public establecimiento_alias:string,
        public establecimiento_token:string,
        public vendedor:string,
        public moneda:string,
        public moneda_code:string,
        public cuenta_contable:string,
        public servegresos:boolean,
        public servingresos:boolean,
        public servpropias:boolean,
        public capt_cliente:boolean,
        public capt_precio_x_articulo:boolean,
        public capt_primero_cantidad:boolean,

        public folio_corte:string,
    ){}
}

