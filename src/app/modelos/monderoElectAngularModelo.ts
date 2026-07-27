export class monderoElectAngularModelo{
    constructor(
        public plataforma_electronica:string,
        public no_referencia:string,
        public cuenta:string,
        public clabe_inter:string,
        public titularCuenta:string,
        public cuenta_contable:string,
        public moneda:string,
        public areaEgresos:boolean,
        public areaIngresos:boolean,
        public areaValHumano:boolean,
        public opciones_adicionales:[],
        public token_responsable:string,
        public token_cuentaBanc:string,
        public token_caja:string,
    ){}
}