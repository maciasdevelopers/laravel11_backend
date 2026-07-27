export class declaracionTotalesPagarModelo {
  constructor(
    public importe_a_favor: number,
    public total_a_cargo: number,
    public total_actualizaciones: number,
    public total_recargos: number,
    public total_otros_cargos: number,
    public total_otros_abonos: number,
    public total_cantidad_a_pagar: number,
  ) { }
}