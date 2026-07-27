export class dispositivosAngularModelo{
    constructor(
        public tipo_dispositivo:string,
        public alias_dispositivo:string,
        public serie:string,
        public vigencia:string,
        public token_caja:string,
        public token_cuentaBanc:string,
        public token_monElect:string,
        public token_responsable:string
    ){}
}