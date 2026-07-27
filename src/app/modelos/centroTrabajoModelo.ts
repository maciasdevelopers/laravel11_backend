export class centroTrabajoModelo {
  constructor(
    public centrotrab_fecha_contabilizacion: string,
    public centrotrab_clave_registro_patronal_imss: string,
    public riesgo_division_label: string,
    public riesgo_division: string,
    public riesgo_grupo_label: string,
    public riesgo_grupo: string,
    public riesgo_fraccion_label: string,
    public riesgo_fraccion: string,
    public riesgo_clave: string,
    public centrotrab_descripcion: string,
    public centrotrab_ubicacion: string,
    public centrotrab_baja: boolean,
    public centrotrab_causa_baja: string,
    public centrotrab_fecha_baja:string,
    public latitude: number | null = null,
    public longitude: number | null = null
  ) { }
}