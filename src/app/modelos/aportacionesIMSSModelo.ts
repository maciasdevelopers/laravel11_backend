export class aportacionesIMSSModelo {
  constructor(
    public fecha_contabilizacion: string,
    public fecha_presentacion: string,
    public registro_patronal: string,
    public periodo_pago_seguros_imss_anio: string,
    public periodo_pago_seguros_imss_mes: string,
    public pago_rcv_infonavit_inicio: string,
    public pago_rcv_infonavit_fin: string,
    public folio_sua: string,
    public clave_recepcion_archivo_pago: string,
    public propuesta_fecha_limite_pago: string,
    public linea_captura_sipare: string,
    public propuesta_s_m_g_d_f: string,
    public propuesta_fecha_salario_minimo_pago: string,
    public propuesta_valor_uma: string,
    public propuesta_num_de_cotizantes: string,
    public propuesta_num_dias_a_cotizar: string,
    public propuesta_num_de_acreditados: string,
    public observaciones: string,
  ) { }
}