export class reemNewFaseUnoModelo {
  constructor(
    public usuario_acreedor_token: string,
    public usuario_acreedor_titular: string,
    public comisionesSelected:any,
    public tiempo_respuesta_reem_comi:number,
    public token_reembolso_main: string,
    public valor_humano_valua: boolean,
    public valor_humano_aplica: any,
    public egresos_valua: boolean,
    public egresos_aplica: any,
  ) { }
}