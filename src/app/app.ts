import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { filter, interval, Subject, Subscription, takeUntil } from 'rxjs';
import { ServLandCSSService } from './servicios/serv-land-css.service';
import { ServLandJSService } from './servicios/serv-land-js.service';
import { SentinelArkManager } from './servicios/sentinel-ark-manager';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { NotificacionesService } from './servicios/notificaciones.service';
import { MessageService } from 'primeng/api';
import { SessionContextService } from './servicios/session-context';
//import { getMessaging, getToken } from 'firebase/messaging';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App implements OnInit {
  options = {};
  public identif: any;
  public user_code_token: any;
  private limite_inactividad = 180;
  private routerEventsSub!: Subscription;
  private destroy$ = new Subject<void>();

  constructor(
    private cssService:ServLandCSSService,
    private chargeJs:ServLandJSService,
    private sentinela:SentinelArkManager,
    private router:Router,
    private translate:TranslateService,
    private afMessaging: AngularFireMessaging,
    private notifServ:NotificacionesService,
    private primeAlerts: MessageService,
    private sessionContext: SessionContextService,
    @Inject(PLATFORM_ID) private platformId: Object
  ){
    this.translate.setDefaultLang('en');
    this.translate.use(this.sessionContext.lenguaje);
    this.chargeJs.cargaArchJs(["zxcvbn"]);
    this.cssService.cargaArchCss(["fuentes"]);
    this.loadUser();
  }

  ngOnInit(): void {
    this.sessionContext.lenguaje$.pipe(takeUntil(this.destroy$)).subscribe(lang => {
      if (lang) {
        this.translate.use(lang);
      }
    });
    this.requestPermissionNotificaciones();
    this.getRamdonNotificaciones();

    if (this.validarSesion()) {
      this.configurarSesionActiva();
    } else {
      this.limpiarYSalir();
    }

    this.inicializarRuteo();
  }

  private validarSesion(): boolean {
    const userCode = localStorage.getItem('user_code');
    const lastActividad = parseInt(localStorage.getItem("last_actividad") || '0', 10);
    if (!userCode || isNaN(lastActividad)) return false;

    const currentTimestamp = Math.floor(Date.now() / 1000);
    return (lastActividad + this.limite_inactividad) >= currentTimestamp;
  }

  private configurarSesionActiva():void{
    const token_usent = localStorage.getItem('user_code');
    this.user_code_token = token_usent;
    sessionStorage.setItem('inside_session_code', token_usent ?? '');
    const moriahKey = localStorage.getItem('moriah_key');
    if (moriahKey) {
      sessionStorage.setItem('moriah_key', moriahKey);
    }
    this.sentinela.tiempo_inactivo_contador();

    if (sessionStorage.length > 0) {
      this.notificaComprasPriodicasDia();
      interval(300000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.notificaComprasPriodicasDia();
      });
    }
  }

  async requestPermissionNotificaciones() {
    try {
      // 1. Verificar el estado actual del permiso antes de intentar nada
      if (Notification.permission === 'denied') {
        console.warn('El usuario bloqueó las notificaciones.');
        return;
      }
    
      // Usamos el servicio afMessaging que ya está inyectado y vinculado a tu config
      this.afMessaging.requestToken.subscribe({
        next: (token) => {
          if (token) {
            //console.log('Token generado exitosamente:', token);
            this.notifServ.registraToken(token);
          } else {
            console.warn('No se pudo generar el token.');
          }
        },
        error: (error) => {
          console.error('Error al solicitar permiso/token:', error);
          // Aquí puedes manejar el error de 'messaging/permission-blocked'
        }
      });
  
    } catch (error:any) {
      if (error.code === 'messaging/permission-blocked') {
        console.error('Permiso bloqueado por configuración del navegador.');
        // Avisar al usuario que su sistema contable no puede enviar alertas.
      } else {
        console.error('Error inesperado:', error);
      }
    }
  }

  getRamdonNotificaciones(){
    this.afMessaging.messages.subscribe((message: any) => {
      console.log('Message received:', message.notification);
    
      const notification = message.notification;
      if (notification) {
        const notif_title = notification.title || 'SOS-México informa:';
        const notif_body = notification.body || 'Sin mensaje disponible.';
        console.log(notif_body);
        // Mostrar notificación con PrimeNG
        this.primeAlerts.add({ severity: 'info', summary: notif_title, detail:notif_body,sticky: true,key:'toastNotificacionesUser'});
      } else {
        console.warn('Mensaje sin campo "notification":', message);
      }
    });
  }

  notificaComprasPriodicasDia(){
    this.notifServ.getNotificacionesSinLeerUser().subscribe(
      (data) => {
        let notif_pendientes = data.length;
        if (notif_pendientes == 1) {
          for (let i = 0; i < notif_pendientes; i++) {
            const element = data[i];
            console.log(element);
            this.primeAlerts.add({ severity: 'info', summary: 'SOS-México informa: ', detail:element,sticky: true,key:'toastNotificacionesUser'})
          }
        } else if (notif_pendientes > 1) {
          this.primeAlerts.add({ severity: 'warn', summary: 'SOS-México informa: ', detail:`${notif_pendientes} notificaciones pendientes`,key:'toastNotificacionesUser'})
        }
      }
    );
  }

  private inicializarRuteo(): void {
    this.routerEventsSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      if (event.urlAfterRedirects === '/') {
        this.router.navigate(['/plataformas/home']);
      }
    });
  }

  loadUser(){
    this.identif = this.sentinela.getIdentifUsuario();
    this.user_code_token = this.sentinela.getTokenStorage();
  }

  limpiarYSalir(){
    this.sentinela.detener_actividad_vigilancia();
    var enrutador = this.router;
    localStorage.clear();
    sessionStorage.clear();
    this.translate.use('es');
    enrutador.navigate(['./']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.routerEventsSub) this.routerEventsSub.unsubscribe();
  }
}
