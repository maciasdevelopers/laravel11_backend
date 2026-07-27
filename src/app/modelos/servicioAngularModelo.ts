export class servicioAngularModelo{
    constructor(
        public concepto:string,
        public fechaAlta:string,
        public clasificacion:string,
        public genero:string,
        public clave_sat:string,
        public unidad_medida_clave:string,
        public unidad_medida_homologada:string,
        public proveedor:[],
        //public turnos:string
        public precio_aplicable:number,
        public moneda_codigo:string,
        public moneda_homologada:string,
        public cuenta_contable:string,
        public impuestos:any = []
    ){}
}