import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TeciConfigService } from '../../shared/services/teci-config.service';

@Injectable({
  providedIn: 'root'
})
export class TeciEmpresasService {
  private apiUrl: string;

  constructor(
    private http: HttpClient,
    private config: TeciConfigService
  ) {
    this.apiUrl = this.config.buildUrl('empresas');
  }

  // Catálogo de empresas
  listaEmpresasAll(): Observable<any> {
    return this.http.get(this.config.buildUrl('empresas/all'))
      .pipe(catchError(this.handlerError));
  }

  listaEmpresasEliminadas(): Observable<any> {
    return this.http.get(this.config.buildUrl('empresas/eliminadas'))
      .pipe(catchError(this.handlerError));
  }

  empresaDetalleInfo(empresaToken: string): Observable<any> {
    return this.http.post(
      this.config.buildUrl('empresas/detalle'),
      this.config.buildPostBody({ empresa_token: empresaToken })
    ).pipe(catchError(this.handlerError));
  }

  // Verificación de existencia
  verificaExistsAllEmpresas(
    tipoEmp: any,
    subtipoEmp: any,
    rfcGenerico: any,
    empRfc: any,
    idTax: any,
    nombre: any
  ): Observable<any> {
    return this.http.post(
      this.config.buildUrl('empresas/verificar-existencia'),
      this.config.buildPostBody({
        tipoEmp,
        subtipoEmp,
        rfc_generico: rfcGenerico,
        emp_rfc: empRfc,
        id_tax: idTax,
        nombre
      })
    ).pipe(catchError(this.handlerError));
  }

  // Registro de empresas
  empresaRegistrar(datosEmpresa: any): Observable<any> {
    return this.http.post(
      this.config.buildUrl('empresas/registrar'),
      this.config.buildPostBody({
        rfc_generico: datosEmpresa.rfcGenerico,
        emp_rfc: datosEmpresa.empRfc,
        id_tax: datosEmpresa.idTax,
        tipoEmp: datosEmpresa.tipoEmp,
        subtipoEmp: datosEmpresa.subtipoEmp,
        razon_social: datosEmpresa.razonSocial,
        abrev: datosEmpresa.abrev,
        comercial_nombre: datosEmpresa.comercialNombre,
        curp: datosEmpresa.curp,
        paistoken: datosEmpresa.paisToken,
        sitio_web: datosEmpresa.sitioWeb,
        tknRegimenFiscal: datosEmpresa.regimenFiscal
      })
    ).pipe(catchError(this.handlerError));
  }

  // Vinculación empresa-usuario
  vincularEmpresaUsuario(empresaToken: string, usuarioToken: string): Observable<any> {
    return this.http.post(
      this.config.buildUrl('empresas/vincular-usuario'),
      this.config.buildPostBody({
        empresa_token: empresaToken,
        usuario_token: usuarioToken
      })
    ).pipe(catchError(this.handlerError));
  }

  // Catálogo de empresas vinculadas
  listaEmpresasVinculadas(): Observable<any> {
    return this.http.post(
      this.config.buildUrl('empresas/vinculadas'),
      this.config.buildPostBody({})
    ).pipe(catchError(this.handlerError));
  }

  selectEmpresaVinculada(empresaToken: string): Observable<any> {
    return this.http.post(
      this.config.buildUrl('empresas/seleccionar-vinculada'),
      this.config.buildPostBody({ empresa_token: empresaToken })
    ).pipe(catchError(this.handlerError));
  }

  // Validación de RFC
  validarRfcNacional(rfc: string, subtipoEmp: string): boolean {
    if (subtipoEmp === 'empresaFisica') {
      // RFC Física: 13 caracteres
      const cdna1 = rfc.substring(0, 4);
      const cdna2 = rfc.substring(4, 10);
      const cdna3 = rfc.substring(10, 13);
      return (
        /^[a-zA-Z]+$/.test(cdna1) &&
        /^[0-9]+$/.test(cdna2) &&
        /^[a-zA-Z0-9]+$/.test(cdna3) &&
        rfc.length === 13
      );
    } else if (subtipoEmp === 'empresaMoral') {
      // RFC Moral: 12 caracteres
      const cdna1 = rfc.substring(0, 3);
      const cdna2 = rfc.substring(3, 9);
      const cdna3 = rfc.substring(9, 12);
      return (
        /^[a-zA-Z]+$/.test(cdna1) &&
        /^[0-9]+$/.test(cdna2) &&
        /^[a-zA-Z0-9]+$/.test(cdna3) &&
        rfc.length === 12
      );
    }
    return false;
  }

  validarRfcExtranjero(rfc: string): boolean {
    return rfc.length >= 9 && rfc.length <= 40;
  }

  validarTaxId(taxId: string): boolean {
    return taxId.length >= 9 && taxId.length <= 40;
  }

  // Validación de nombre
  validarNombreEmpresa(nombre: string): boolean {
    return nombre !== '' && nombre.length >= 4;
  }

  // Manejo de errores
  private handlerError(error: { error: { message: string; }; status: any; message: any; }) {
    let errorMessage = 'Ocurrió un error inesperado. Intente más tarde.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = error.error?.message || errorMessage;
    }
    return throwError(errorMessage);
  }
}

// Importar throwError
import { throwError } from 'rxjs';
