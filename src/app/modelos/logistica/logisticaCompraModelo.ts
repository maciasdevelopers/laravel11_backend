export class logisticaCompraModelo{
  constructor(
    public compra_relacionada_token:string,
    public estado_alcanzado:string,
    public fecha_real_salida:string,
    public tentativaLlegadaLugarDestino:string,
    public observaciones:string,
    public transportes:any,
    //public tipoLugarDestino:string,
    //public descripcionLugarDestino:string
  ){}
}
