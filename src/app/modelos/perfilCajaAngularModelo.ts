export class perfilCajaAngularModelo{
    constructor(
        public alias_caja:string,
        public moneda:string,
        public serv_egresos:boolean,
        public serv_ingresos:boolean,
        public serv_propias:boolean
    ){}
}