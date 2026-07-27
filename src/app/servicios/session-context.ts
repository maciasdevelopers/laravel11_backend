import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { global } from './global_ssic';
import { EmpresaContext } from '../modelos/empresa/empresa-context.model';

@Injectable({
  providedIn: 'root'
})
export class SessionContextService {
  public url: string;
  private empresaSubject = new BehaviorSubject<any>(null);
  private modulosSubject = new BehaviorSubject<any[]>([]);
  private jerarquiaSubject = new BehaviorSubject<any>(null);
  private lenguajeSubject = new BehaviorSubject<any>(localStorage.getItem('system_lenguaje') || 'es');
  private privilegio_crearSubject = new BehaviorSubject<any>(null);
  private privilegio_editarSubject = new BehaviorSubject<any>(null);
  private privilegio_consultaSubject = new BehaviorSubject<any>(null);
  private privilegio_eliminaSubject = new BehaviorSubject<any>(null);
  private privilegio_ver_docsSubject = new BehaviorSubject<any>(null);

  public lenguaje$ = this.lenguajeSubject.asObservable();

  constructor(private http: HttpClient) {
    this.url = global.urlApi;
  }

  empresa$(): Observable<any> {
    return this.empresaSubject.asObservable();
  }

  selectEmpresaVinc(empresa_token: string) {
    const url_completa = this.url + 'select_empresa_vinculada';
    return this.http.post<any>(url_completa, { empresa_token: empresa_token });
  }

  setEmpresa(empresa: EmpresaContext): void {
    console.log(empresa);
    this.empresaSubject.next(empresa);
  }

  get empresa_data(): any {
    return this.empresaSubject.value;
  }

  setContextEmp(context: any): void {
    this.empresaSubject.next(context.empresa ?? null);
  }

  modulos$ = this.modulosSubject.asObservable();

  loadModulosList():void {
    const url_completa = this.url + 'modulos_de_acceso';
    this.http.get<any>(url_completa).subscribe(res => {
      this.modulosSubject.next(res.listadoModulos);
    });
  }

  setModulos(modulos:any): void {
    console.log(modulos);
    this.modulosSubject.next(modulos);
  }

  get modulos_data() {
    return this.modulosSubject.value;
  }

  loadSettingsList():void {
    const url_completa = this.url + 'settings_de_usuario';
    this.http.get<any>(url_completa).subscribe(res => {
      console.log(res);
      this.jerarquiaSubject.next(res.main_jerarquia);
      this.lenguajeSubject.next(res.lenguaje);
      this.privilegio_crearSubject.next(res.main_privilegio_crear);
      this.privilegio_editarSubject.next(res.main_privilegio_editar);
      this.privilegio_consultaSubject.next(res.main_privilegio_consulta);
      this.privilegio_eliminaSubject.next(res.main_privilegio_elimina);
      this.privilegio_ver_docsSubject.next(res.main_privilegio_ver_docs);
    });
  }

  get jerarquia(): any {
    return this.jerarquiaSubject.value;
  }

  get lenguaje(): any {
    return this.lenguajeSubject.value;
  }

  setLenguaje(lang: string): void {
    if (lang) {
      localStorage.setItem('system_lenguaje', lang);
      this.lenguajeSubject.next(lang);
    }
  }

  get privilegio_crear(): any {
    return this.privilegio_crearSubject.value;
  }

  get privilegio_editar(): any {
    return this.privilegio_editarSubject.value;
  }
      
  get privilegio_consulta(): any {
    return this.privilegio_consultaSubject.value;
  }

  get privilegio_elimina(): any {
    return this.privilegio_eliminaSubject.value;
  }

  get privilegio_ver_docs(): any {
    return this.privilegio_ver_docsSubject.value;
  }

  get user_inside(): any {
    return this.privilegio_ver_docsSubject.value;
  }

  loadContext(): Observable<any> {
    return this.http.get<any>('/api/session/context');
  }

  setContext(context: any): void {
    this.empresaSubject.next(context.empresa ?? null);
    this.modulosSubject.next(context.modulos ?? []);
    this.jerarquiaSubject.next(context.permisos ?? null);
    this.lenguajeSubject.next(context.permisos ?? null);
    this.privilegio_crearSubject.next(context.permisos ?? null);
    this.privilegio_editarSubject.next(context.permisos ?? null);
    this.privilegio_consultaSubject.next(context.permisos ?? null);
    this.privilegio_eliminaSubject.next(context.permisos ?? null);
    this.privilegio_ver_docsSubject.next(context.permisos ?? null);
  }

  recuperarSession(): Observable<any>{
    const esProbableQueTengaSesion = localStorage.getItem('session_active');

    // Si no hay bandera, retornamos 'null' inmediatamente sin tocar el backend.
    // Esto evita el error 401 en consola para usuarios nuevos/invitados.
    if (!esProbableQueTengaSesion) {
      //console.log('No hay bandera de sesión, saltando recuperación.');
      return of(null);
    }

    const url_completa = this.url + 'usuario_recupera_user_empresa';
    return this.http.post<any>(url_completa,{withCredentials:true})
    .pipe(
      tap((data) => {
        if (data.status === 'success') {
          console.log('Sesión recuperada:', data);
          this.modulosSubject.next(data.listadoModulos);
          this.jerarquiaSubject.next(data.main_jerarquia);
          this.lenguajeSubject.next(data.lenguaje);
          this.privilegio_crearSubject.next(data.main_privilegio_crear);
          this.privilegio_editarSubject.next(data.main_privilegio_editar);
          this.privilegio_consultaSubject.next(data.main_privilegio_consulta);
          this.privilegio_eliminaSubject.next(data.main_privilegio_elimina);
          this.privilegio_ver_docsSubject.next(data.main_privilegio_ver_docs);
          if (data.empresa_token) {
            this.setEmpresa(data);
          }
        }
      }),
      catchError((err) => {
        // Si falla (401/403), no rompemos la app, solo iniciamos sin sesión (null)
        console.warn('Sesión no activa o expirada');
        return of(null);
      })
    );
  }

  clear(): void {
    this.empresaSubject.next(null);
    this.modulosSubject.next([]);
    this.jerarquiaSubject.next(null);
    this.lenguajeSubject.next(null);
    this.privilegio_crearSubject.next(null);
    this.privilegio_editarSubject.next(null);
    this.privilegio_consultaSubject.next(null);
    this.privilegio_eliminaSubject.next(null);
    this.privilegio_ver_docsSubject.next(null);
  }
}
