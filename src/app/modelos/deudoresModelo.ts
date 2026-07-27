export class deudoresModelo{
    constructor(
        public tipoDeudor:string,
        public subtipoDeudor:string,
        public rfc:string,
        public taxID:string,
        public nombre:string,
        public nombre_comercial:string,
        public correo_electronico:string,
        public habilita_reembolsos:boolean,
        public cuenta_contable:string,
        public regimen_fiscal:string,
        public trabajador_vinculado:string,
        public proveedor_vinculado:string,
        public acreedor_vinculado:string
    ){}
}