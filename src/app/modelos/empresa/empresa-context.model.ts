// models/empresa-context.model.ts
export interface EmpresaContext {
  emp_token: string;

  company_name_short: string;
  company_name_large: string;

  regimen_fiscal_token: string;
  regimen_fiscal_descripcion: string;

  habilita_centros_de_trabajo: boolean;

  zona_horaria: string;
  zona_horaria_utc: string;
  codigo_pais: string;

  rfc_generico: string;
  rfc_emp: string;
  tax_id_emp: string;

  logotypo: string;

  conf_ingresos: boolean;
  conf_egresos: boolean;
  conf_finanzas: boolean;
  conf_valor_humano: boolean;
  conf_contabilidad: boolean;
  conf_tec_info: boolean;

  jerarquia: string;

  settings_privilegio_crear: boolean;
  settings_privilegio_editar: boolean;
  settings_privilegio_consulta: boolean;
  settings_privilegio_elimina: boolean;
  settings_privilegio_ver_docs: boolean;

  e_moneda_code: string;
  e_moneda_decimales: number;

  acreedor: any;
  habilita_reembolsos: boolean;
}
