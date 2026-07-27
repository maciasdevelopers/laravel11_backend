export class establecimientoModelo{
  constructor(
    public alias:string,
    public tipo:string,
    public descripcion:string,
    public encargado:string,
    public aplica_ingresos:boolean,
    public aplica_egresos:boolean,
    public aplica_procesos_internos:boolean,
    public aplica_almacen:boolean,
    //ubicacion_decide
    public ubicacion_pais:string,
    //ubicacion_mx
    public dipomex_cod_postal_estado:string,
    public dipomex_cod_postal_municipio:string,
    public dipomex_cod_postal_cp:string,
    public dipomex_cod_postal_colonia_vinculada:string,
    //ubicacion_ext
    public ext_direccion_pais:string,
    public ext_direccion_completa:string,
    //telefonos
    public phoneAll:string,
    //cuentas contables
    public cuenta_contable:string,
    //ubicacion gps
    public latitude: number | null = null,
    public longitude: number | null = null
  ){}
}