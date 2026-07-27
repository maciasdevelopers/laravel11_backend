export class activoFijoAngularModelo{
    constructor(
        public categoria:string,
        public categoriaCuentaContable:string,
        //depreciacionContable
        public depreciacionContableTipo:string,
        public depreciacionContablePeriodo:string,
        public depreciacionContableImporte:string,
        public depreciacionContableCuentaUno:string,
        public depreciacionContableCuentaDos:string,
        //depreciacionFiscal
        public depreciacionFiscalTipo:string,
        public depreciacionFiscalPeriodo:string,
        public depreciacionFiscalImporte:string,
        public depreciacionFiscalCuentaUno:string,
        public depreciacionFiscalCuentaDos:string,
        public observaciones:string,
    ){}
}