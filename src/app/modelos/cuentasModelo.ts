export class cuentasModelo {
	constructor(
		public token_banco: string,
		public clave_banco: string,
		public contrato: string,
		public cuenta: string,
		public clabe_inter: string,
		public vigencia: string,
		public titularCuenta: string,
		public sucursal: string,
		public moneda_code: string,
		public moneda_decimales: string,
		public cuenta_contable: string,
		public areaEgresos: boolean,
		public areaIngresos: boolean,
		public areaValHumano: boolean,
		public opciones_adicionales: any
	) { }
}