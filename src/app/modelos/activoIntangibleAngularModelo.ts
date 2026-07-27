export class activoIntangibleAngularModelo{
    constructor(
        public categoria:string,
        public categoriaCuentaContable:string,
        //depreciacionContable
        public amortizacionContablePeriodo:string,
        public amortizacionContableTiempoEjecucion:string,
        public amortizacionContableCuentaUno:string,
        public amortizacionContableCuentaDos:string,
        //depreciacionFiscal
        public amortizacionFiscalPeriodo:string,
        public amortizacionFiscalTiempoEjecucion:string,
        public amortizacionFiscalCuentaUno:string,
        public amortizacionFiscalCuentaDos:string,
        public observaciones:string,
    ){}
}