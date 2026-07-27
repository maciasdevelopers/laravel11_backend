export class prorrateoModelo{
  constructor(
    public tipo_art_prorrateo:string,
    public precio_unitario:number,
    public totalDetCompFormat:string,
    public numero_articulos_prorratea:number,
    public cant_art_prorrateo:number,
    public porcentaje_juega:string,
    public result_porcentaje_juega:string,
    public total_prorrateo:string,
    public desv_art_prorrateo:string,
    public token_prorrateo:string,
    public token_detalle_prorrt:string,
    public token_art_detbuy_prorrateo:string,
    public total_detalle:string,
    public totalCompra:number
  ){}
}