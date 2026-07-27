import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TeciConfigService } from '../../shared/services/teci-config.service';

@Injectable({
  providedIn: 'root'
})
export class TeciSoporteService {
  private apiUrl: string;

  constructor(
    private http: HttpClient,
    private config: TeciConfigService
  ) {
    this.apiUrl = this.config.buildUrl('soporte');
  }

  // Solicitudes de registro
  getSolicitudesRegistroVigentes(): Observable<any> {
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    const json = JSON.stringify({
      user_token: sessionStorage.getItem('inside_session_code')
    });
    const parametros = 'json=' + json;
    return this.http.post(`${this.apiUrl}/solicitudes-vigentes`, parametros, { headers })
      .pipe(catchError(this.handlerError));
  }

  getSolicitudesRegistroCanceladas(): Observable<any> {
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    const json = JSON.stringify({
      user_token: sessionStorage.getItem('inside_session_code')
    });
    const parametros = 'json=' + json;
    return this.http.post(`${this.apiUrl}/solicitudes-canceladas`, parametros, { headers })
      .pipe(catchError(this.handlerError));
  }

  getSolicitudesRegistroEliminadas(): Observable<any> {
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    const json = JSON.stringify({
      user_token: sessionStorage.getItem('inside_session_code')
    });
    const parametros = 'json=' + json;
    return this.http.post(`${this.apiUrl}/solicitudes-eliminadas`, parametros, { headers })
      .pipe(catchError(this.handlerError));
  }

  // Catálogos auxiliares
  getCatalogoAreasEmpresa(): Observable<any> {
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    const json = JSON.stringify({
      user_token: sessionStorage.getItem('inside_session_code')
    });
    const parametros = 'json=' + json;
    return this.http.post(`${this.apiUrl}/catalogo-areas`, parametros, { headers })
      .pipe(catchError(this.handlerError));
  }

  getListaPaises(): Observable<any> {
    return this.http.get(`${this.apiUrl}/paises`)
      .pipe(catchError(this.handlerError));
  }

  getRegimenFiscalAll(): Observable<any> {
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    const json = JSON.stringify({
      user_token: sessionStorage.getItem('inside_session_code')
    });
    const parametros = 'json=' + json;
    return this.http.post(`${this.apiUrl}/regimen-fiscal-all`, parametros, { headers })
      .pipe(catchError(this.handlerError));
  }

  getRegimenFiscalPF(): Observable<any> {
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    const json = JSON.stringify({
      user_token: sessionStorage.getItem('inside_session_code')
    });
    const parametros = 'json=' + json;
    return this.http.post(`${this.apiUrl}/regimen-fiscal-pf`, parametros, { headers })
      .pipe(catchError(this.handlerError));
  }

  getRegimenFiscalPM(): Observable<any> {
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    const json = JSON.stringify({
      user_token: sessionStorage.getItem('inside_session_code')
    });
    const parametros = 'json=' + json;
    return this.http.post(`${this.apiUrl}/regimen-fiscal-pm`, parametros, { headers })
      .pipe(catchError(this.handlerError));
  }

  // Validaciones
  validarRfcNacional(rfc: string, subtipoEmp: string): boolean {
    if (subtipoEmp === 'empresaFisica') {
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

  validarNombreEmpresa(nombre: string): boolean {
    return nombre !== '' && nombre.length >= 4;
  }

  validarCurp(curp: string, clasificacionEmp: string): boolean {
    if (clasificacionEmp === 'nacional') {
      return /^[a-zA-Z0-9]+$/.test(curp) && curp.length === 18;
    } else {
      return curp === '' || (curp.length >= 9 && curp.length <= 40);
    }
  }

  validarCodigoPostal(codigoPostal: string): boolean {
    return /^[a-zA-Z0-9]+$/.test(codigoPostal);
  }

  validarUrl(url: string): boolean {
    try {
      new URL('https://' + url);
      return true;
    } catch {
      return false;
    }
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