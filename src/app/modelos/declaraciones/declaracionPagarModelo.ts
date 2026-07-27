export class declaracionPagarModelo {
  constructor(
    public concepto_de_pago_token: string,
    public concepto_de_pago_name: string,
    public importe_a_favor: number,
    public a_cargo: number,
    public actualizaciones: number,
    public recargos: number,
    public otros_cargos: number,
    public otros_abonos: number,
    public cantidad_a_cargo: number,
  ) { }
}