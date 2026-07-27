import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TeciConfigService } from '../../shared/services/teci-config.service';

@Injectable({
  providedIn: 'root'
})
export class TeciUsuariosService {
  private apiUrl: string;

  constructor(
    private http: HttpClient,
    private config: TeciConfigService
  ) {
    this.apiUrl = this.config.buildUrl('usuarios');
  }

  // Catálogo de usuarios
  getCatalogoUsuarios(): Observable<any> {
    return this.http.get(this.config.buildUrl('usuarios/catalogo'));
  }

  getDesgloseUsuario(usuarioToken: string): Observable<any> {
    return this.http.get(this.config.buildUrl(`usuarios/desglose/${usuarioToken}`));
  }

  // Gestión de acceso a módulos
  updateAccesoSsic(empresaToken: string, usuarioToken: string, acceso: any): Observable<any> {
    return this.http.post(
      this.config.buildUrl('usuarios/acceso/ssic'),
      this.config.buildPostBody({ empresa_token: empresaToken, acceso })
    );
  }

  updateAccesoDescargaXml(empresaToken: string, usuarioToken: string, acceso: any): Observable<any> {
    return this.http.post(
      this.config.buildUrl('usuarios/acceso/descarga-xml'),
      this.config.buildPostBody({ empresa_token: empresaToken, acceso })
    );
  }

  updateAccesoLogistica(empresaToken: string, usuarioToken: string, acceso: any): Observable<any> {
    return this.http.post(
      this.config.buildUrl('usuarios/acceso/logistica'),
      this.config.buildPostBody({ empresa_token: empresaToken, acceso })
    );
  }

  updateAccesoCompras(empresaToken: string, usuarioToken: string, acceso: any): Observable<any> {
    return this.http.post(
      this.config.buildUrl('usuarios/acceso/compras'),
      this.config.buildPostBody({ empresa_token: empresaToken, acceso })
    );
  }

  updateAccesoProyectos(empresaToken: string, usuarioToken: string, acceso: any): Observable<any> {
    return this.http.post(
      this.config.buildUrl('usuarios/acceso/proyectos'),
      this.config.buildPostBody({ empresa_token: empresaToken, acceso })
    );
  }

  updateAccesoTerceros(empresaToken: string, usuarioToken: string, acceso: any): Observable<any> {
    return this.http.post(
      this.config.buildUrl('usuarios/acceso/terceros'),
      this.config.buildPostBody({ empresa_token: empresaToken, acceso })
    );
  }

  // Permisos de ingresos
  updateIngresosPermAcceso(empresaToken: string, usuarioToken: string, acceso: any): Observable<any> {
    return this.http.post(
      this.config.buildUrl('usuarios/permisos/ingresos/acceso'),
      this.config.buildPostBody({ empresa_token: empresaToken, acceso })
    );
  }

  updateIngresosPermJerarquia(empresaToken: string, usuarioToken: string, jerarquia: any): Observable<any> {
    return this.http.post(
      this.config.buildUrl('usuarios/permisos/ingresos/jerarquia'),
      this.config.buildPostBody({ empresa_token: empresaToken, jerarquia })
    );
  }

  updateIngresosPermCrear(empresaToken: string, usuarioToken: string, permiso: any): Observable<any> {
    return this.http.post(
      this.config.buildUrl('usuarios/permisos/ingresos/crear'),
      this.config.buildPostBody({ empresa_token: empresaToken, permiso })
    );
  }

  updateIngresosPermEditar(empresaToken: string, usuarioToken: string, permiso: any): Observable<any> {
    return this.http.post(
      this.config.buildUrl('usuarios/permisos/ingresos/editar'),
      this.config.buildPostBody({ empresa_token: empresaToken, permiso })
    );
  }

  updateIngresosPermConsultar(empresaToken: string, usuarioToken: string, permiso: any): Observable<any> {
    return this.http.post(
      this.config.buildUrl('usuarios/permisos/ingresos/consultar'),
      this.config.buildPostBody({ empresa_token: empresaToken, permiso })
    );
  }

  updateIngresosPermEliminar(empresaToken: string, usuarioToken: string, permiso: any): Observable<any> {
    return this.http.post(
      this.config.buildUrl('usuarios/permisos/ingresos/eliminar'),
      this.config.buildPostBody({ empresa_token: empresaToken, permiso })
    );
  }

  // Permisos de TecInfo
  updateTecInfoPermAcceso(empresaToken: string, usuarioToken: string, acceso: any): Observable<any> {
    return this.http.post(
      this.config.buildUrl('usuarios/permisos/tecinfo/acceso'),
      this.config.buildPostBody({ empresa_token: empresaToken, acceso })
    );
  }

  updateTecInfoPermJerarquia(empresaToken: string, usuarioToken: string, jerarquia: any): Observable<any> {
    return this.http.post(
      this.config.buildUrl('usuarios/permisos/tecinfo/jerarquia'),
      this.config.buildPostBody({ empresa_token: empresaToken, jerarquia })
    );
  }

  updateTecInfoPermCrear(empresaToken: string, usuarioToken: string, permiso: any): Observable<any> {
    return this.http.post(
      this.config.buildUrl('usuarios/permisos/tecinfo/crear'),
      this.config.buildPostBody({ empresa_token: empresaToken, permiso })
    );
  }

  updateTecInfoPermEditar(empresaToken: string, usuarioToken: string, permiso: any): Observable<any> {
    return this.http.post(
      this.config.buildUrl('usuarios/permisos/tecinfo/editar'),
      this.config.buildPostBody({ empresa_token: empresaToken, permiso })
    );
  }

  updateTecInfoPermConsultar(empresaToken: string, usuarioToken: string, permiso: any): Observable<any> {
    return this.http.post(
      this.config.buildUrl('usuarios/permisos/tecinfo/consultar'),
      this.config.buildPostBody({ empresa_token: empresaToken, permiso })
    );
  }

  updateTecInfoPermEliminar(empresaToken: string, usuarioToken: string, permiso: any): Observable<any> {
    return this.http.post(
      this.config.buildUrl('usuarios/permisos/tecinfo/eliminar'),
      this.config.buildPostBody({ empresa_token: empresaToken, permiso })
    );
  }

  updateTecInfoPermVerDocs(empresaToken: string, usuarioToken: string, permiso: any): Observable<any> {
    return this.http.post(
      this.config.buildUrl('usuarios/permisos/tecinfo/ver-docs'),
      this.config.buildPostBody({ empresa_token: empresaToken, permiso })
    );
  }

  // Generación de credenciales
  generarCredenciales(usuarioToken: string): Observable<any> {
    return this.http.post(
      this.config.buildUrl('usuarios/credenciales/generar'),
      this.config.buildPostBody({ usuario_token: usuarioToken })
    );
  }

  revocarCredenciales(usuarioToken: string): Observable<any> {
    return this.http.post(
      this.config.buildUrl('usuarios/credenciales/revocar'),
      this.config.buildPostBody({ usuario_token: usuarioToken })
    );
  }
}
