export class acreedoresModelo{
    constructor(
        public tipoAcree:string,
        public subtipoAcree:string,
        public rfc:string,
        public taxID:string,
        public nombre:string,
        public nombre_comercial:string,
        public correo_electronico:string,
        public habilita_reembolsos:boolean,
        public cuenta_contable:string,
        public regimen_fiscal:string,
        public regimen_fiscal_desc:string,
        public trabajador_vinculado:string,
        public proveedor_vinculado:string,
        public deudor_vinculado:string
    ){}
}