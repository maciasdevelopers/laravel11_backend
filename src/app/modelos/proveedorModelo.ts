import { NgxFileDropEntry } from "ngx-file-drop";

export class proveedorModelo{
  constructor(
    public tipoProv:string,
    public subtipoProv:string,
    public rfc_generico:string,
    public rfc:string,
    public rfc_back:string,
    public id_tax:string,
    public id_tax_back:string,
    public name_prov:string,
    public name_prov_back:string,

		public habilitado_para_reembolsos:boolean,
		public email_para_reembolsos:string,
    public comercial_nombre:string,
    public curp:string,
    public sitio_web:string,
    public paistoken:string,
    public tknRegimenFiscal:string,
    public cuenta_contable:string,
		//contacto
		public decideinfocontacto:boolean, 
		public listaContactoPersonal:any[],
		//informacion fiscal
		public tiene_docs_fiscales:boolean,
		public noCargaDocsFiscalesRazon:string, 
		public docSituacionFiscal:any,
		public htmlSituacionFiscal:any,
		public typoSituacionFiscal:any,
		
		public docCumplimientoObFiscales:any,
		public htmlCumplimientoObFiscales:any,
		public typoCumplimientoObFiscales:any,

		public docContratos:any,
		public htmlContratos:any,
		public typoContratos:any,

		//credito
		public decideaceptcredito:boolean, 
		public token_monedaOrden:string,
		public decimales_monedaOrden:number,
		public limite_credito:string,
		public dias_pago_credito:number,
		public comienzacomputo_credito:string,
	//forma de pago
		public decideformapago:boolean,
		public docEstadoCuenta:any,
		public htmlEstadoCuenta:any,
		public typoEstadoCuenta:any,
		public tknFormaPagoProv:string,
		public tipoReferenciaPago:string,
		public clabeInterbancariaBanco:string,
		public clabeInterbancariaPlaza:string,
		public clabeInterbancariaCuenta:string,
		public clabeInterbancariaControl:string,
		public clabeInterbancariaPago:string,
	//recibe_factura
		public receptFactura:boolean,
		public classRecibeArtPago:boolean,

	//ubicacion
		public cod_postal:string,
		//dipomex
		public dipomex_cod_postal_estado:string,
		public dipomex_cod_postal_municipio:string,
		public dipomex_cod_postal_cp:string,
		public dipomex_cod_postal_colonias:any[],
		public dipomex_cod_postal_colonia_vinculada:string,
		public new_cod_postal_estado_name:string,
		public new_cod_postal_estado_abrev:string,
		public new_cod_postal_municipio:string,
		public new_cod_postal_cp:string,
		public new_cod_postal_colonia_vinculada:string,
		public listnewdireccionNac:any[],
		public newdireccionNac_nuevo_registro:any[],
  ){}
}