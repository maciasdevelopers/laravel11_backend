export class direccionesDipoModelo{
  constructor(
      public dipomex_cod_postal_estado:string = "",
      public dipomex_cod_postal_municipio:string = "",
      public dipomex_cod_postal_cp:string = "",
      public dipomex_cod_postal_colonias:any = [],
      public dipomex_cod_postal_colonia_vinculada:string = "",
  ){}
}
