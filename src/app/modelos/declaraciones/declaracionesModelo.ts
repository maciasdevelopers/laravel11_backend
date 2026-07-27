export class declaracionesModelo {
  constructor(
    public fecha_contabilizacion: string,
    public tipo_declaracion: string,
    public periodicidad: string,
    public ejercicio: string,
    public periodo_inicio: string,
    public periodo_fin: string,
    public fecha_presentacion: string,
    public medio_presentacion: string,
    public fecha_vencimiento: string,
    public version: string,
    public numero_operacion: string,
    public linea_de_captura: string,
    public moneda: string,
    public moneda_decimales: number,
    public declaraciones_lista_registrada: any,
    public declaraciones_lista_pagar: any,
    public observaciones: string,
    public anexos_registrados: any,
  ) { }
}