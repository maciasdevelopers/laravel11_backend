import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { EmpresasServService } from '../../../servicios/ssic/empresas-serv.service';
import { ChatServService } from '../../../servicios/ssic/chat-serv.service';
import { SentinelArkManager } from '../../../servicios/sentinel-ark-manager';
import { TranslateService } from '@ngx-translate/core';
import { FnzsIndicadoresService } from '../../../servicios/ssic/fnzs-indicadores.service';
import "bootstrap";
import { SessionContextService } from '../../../servicios/session-context';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'modulo_inside_home_englobe',
  templateUrl: './dashboard.component.html',
  standalone: false,
  styleUrls: [
    './dashboard.component.css',
    '../../../styles/navegador.css',
    '../../../styles/landing.css',
    '../../../styles/datatable.css',
    '../../../styles/colores.css',
    '../../../styles/images.css',
    '../../../styles/buttons.css',
    '../../../styles/loading.css',
    '../../../styles/collection.css',
    '../../../styles/collapsible.css',
    '../../../styles/passValidate.css',
    '../../../styles/parallax.css',
    '../../../styles/tooltips.css',
    '../../../styles/modals.css',
    '../../../styles/switches.css',
    '../../../styles/div_explain.css',
    '../../../styles/cards.css',
    '../../../styles/page_landing_index.css',
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {
  accesosDirectos: any = [];

  public inpc: string = "---";
  public tasa_recargos: string = "---";
  public tipo_cmb_pdp: string = "---";
  public salario_minimo: string = "---";
  public salario_min_fronterizo: string = "---";
  public uma: string = "---";
  public udi: string = "---";
  public tiie: string = "---";

  // Variable para el binding [(ngModel)]
  busqueda_empresa: string = '';

  arrayConversacionChat: any = [];
  listEmpresasVinc: any = [];
  private destroy$ = new Subject<void>();

  constructor(private sentinela: SentinelArkManager,
    private chatServ: ChatServService,
    private indicadores_serv: FnzsIndicadoresService,
    private cd: ChangeDetectorRef,
    private sessionContext: SessionContextService,
    private empService: EmpresasServService,
    public router: Router,
    private translate: TranslateService) {
    //this.trans_late.use('es');
  }

  ngOnInit(): void {
    this.listaEmpresasVinculadasUser();

    this.empresa$.pipe(takeUntil(this.destroy$)).subscribe(empresa => {
      if (empresa) {
        this.sessionContext.loadModulosList();
        this.sessionContext.loadSettingsList();
        this.lista_indicadores();
        this.listaChats();
      }
    });

    this.sessionContext.modulos$.pipe(takeUntil(this.destroy$)).subscribe(modulos => {
      this.generarAccesosDirectos(modulos);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get empresa$() {
    return this.sessionContext.empresa$();
  }

  generarAccesosDirectos(modulos: any[]) {
    this.accesosDirectos = [];
    const shortcuts_pool = [
      { link: './plataformas/ssic/egresos/ordenes_de_compra', letrero: 'Compras', icon: 'fas fa-shopping-cart', modulo: 'ssic' },
      { link: './plataformas/ssic/finanzas/ordenes_de_pago', letrero: 'Ordenes de pago', icon: 'fas fa-money-bill-wave', modulo: 'ssic' },
      { link: './plataformas/ssic/ingresos/registro_de_ventas', letrero: 'Ventas', icon: 'fas fa-cash-register', modulo: 'ssic' },
      { link: './plataformas/ssic/inventarios/ordenes_de_recepcion', letrero: 'Inventarios', icon: 'fas fa-boxes', modulo: 'ssic' },
      { link: './plataformas/gestion_de_proyectos/catalogo_proyectos', letrero: 'Proyectos', icon: 'fas fa-project-diagram', modulo: 'gestion_proyectos' },
      { link: './plataformas/logistica/dashboard_principal', letrero: 'Logística', icon: 'fas fa-truck', modulo: 'logistica' }
    ];

    if (modulos && modulos.length > 0) {
      for (const item of shortcuts_pool) {
        const hasAccess = modulos.find(m => m.modulo_nombre === item.modulo && m.modulo_acceso && !m.modulo_mantenimiento);
        if (hasAccess && this.accesosDirectos.length < 4) {
          this.accesosDirectos.push(item);
        }
      }
    }
    this.cd.detectChanges();
  }

  lista_indicadores() {
    this.indicadores_serv.verFnzsIndicadores().subscribe(
      response => {
        if (response.status == 'success') {
          this.inpc = response.inpc;
          this.tasa_recargos = response.tasa_recargos;
          this.tipo_cmb_pdp = response.tipo_cmb_pdp;
          this.salario_minimo = response.salario_minimo;
          this.salario_min_fronterizo = response.salario_min_fronterizo;
          this.uma = response.uma;
          this.udi = response.udi;
          this.tiie = response.tiie;
          this.cd.detectChanges();
        }
      }, error => { console.log(error); }
    );
  }

  listaEmpresasVinculadasUser() {
    this.empService.listaEmpresasVinc().subscribe(
      response => {
        if (response.status == 'success') {
          this.listEmpresasVinc = response.emp_result;
          this.cd.detectChanges();
        }
      }, error => { console.log(error); }
    );
  }

get empresasFiltradas() {
  const termino = this.busqueda_empresa.toLowerCase().trim();
  if (!termino) return this.listEmpresasVinc;

  return this.listEmpresasVinc.filter((emp:any) =>
    emp.name_abrev?.toLowerCase().includes(termino) ||
    emp.company_name?.toLowerCase().includes(termino)
  );
}

  cambiarEmpresa(empresa_token: any) {
    this.sessionContext.selectEmpresaVinc(empresa_token)
      .subscribe({
        next: (context) => {
          console.log(context);
          // Guardar token nuevo
          localStorage.setItem('user_code', context.large_token_access);
          sessionStorage.setItem('inside_session_code', context.large_token_access);
          this.sessionContext.setEmpresa(context);
          // Opcional: refrescar app
          //window.location.reload();
        }
      });
  }

  loadingContext() {
    this.sessionContext.loadContext().subscribe({
      next: (context) => {
        this.sessionContext.setContext(context);
      }
    });
  }

  //chat
  listaChats() {
    this.chatServ.getChats('dGEzQVAzZnArRmY3SXpoV0lsTzRkem8xNkdtM1JFRFJOSnlEV1FKNXRreVRGdE9Tb05RVVB1R0QrelZtWkFPSStlVlNVNmpjZWEyQTQzelVpS1AzSFYwanc4cVBrZ1Q3aXZPV1M0ZTJTQW5CUmJhYUlXVHFvS2xzY1pqd1hCZ3RNRjB2c2hSTWsyalpzVDlwNDZqayswZU9mSHRDME5xWGRkbVJRVE9GM2ppQld3S242cnBLVVpJaTF0aGlkSVE5cUhnUlJOaUZYK2FhTmFRUXNjdjZWQzhEbDFhZUsxVks5MDRKMi9FOUlWNGxWVHl1ZDdSeER6N1k3MlBFbktlMCtoS25lMmNWeVlFbmQ5VG9PdVFSejJEOW9JYjVEc01lN3ZPRWRRYXFUT0E9OjoxMjM0NTY3ODEyMzQ1Njc4').subscribe(
      response => {
        if (response.status == 'success') {
          this.arrayConversacionChat = response.datosChat;
          this.cd.detectChanges();
          //console.log(this.arrayConversacionChat);
        }
      }, error => { console.log(error); }
    );
  }

  verChatIngresos(event: any) {
    //this.boolChatIngresos = true;
    //this.boolChatEgresos = false;
    //this.boolChatTesoreria = false;
    //this.boolChatVHumano = false;
    //this.boolChatContabilidad = false;
    //this.boolChatTecInfo = false;
    //this.boolChatSoporteSOS = false;
  }

  verChatEgresos(event: any) {
    //this.boolChatIngresos = false;
    //this.boolChatEgresos = true;
    //this.boolChatTesoreria = false;
    //this.boolChatVHumano = false;
    //this.boolChatContabilidad = false;
    //this.boolChatTecInfo = false;
    //this.boolChatSoporteSOS = false;
  }

  verChatTesoreria(event: any) {
    //this.boolChatIngresos = false;
    //this.boolChatEgresos = false;
    //this.boolChatTesoreria = true;
    //this.boolChatVHumano = false;
    //this.boolChatContabilidad = false;
    //this.boolChatTecInfo = false;
    //this.boolChatSoporteSOS = false;
  }

  verChatVHumano(event: any) {
    //this.boolChatIngresos = false;
    //this.boolChatEgresos = false;
    //this.boolChatTesoreria = false;
    //this.boolChatVHumano = true;
    //this.boolChatContabilidad = false;
    //this.boolChatTecInfo = false;
    //this.boolChatSoporteSOS = false;
  }

  verChatContabilidad(event: any) {
    //this.boolChatIngresos = false;
    //this.boolChatEgresos = false;
    //this.boolChatTesoreria = false;
    //this.boolChatVHumano = false;
    //this.boolChatContabilidad = true;
    //this.boolChatTecInfo = false;
    //this.boolChatSoporteSOS = false;
  }

  verChatTecInfo(event: any) {
    //this.boolChatIngresos = false;
    //this.boolChatEgresos = false;
    //this.boolChatTesoreria = false;
    //this.boolChatVHumano = false;
    //this.boolChatContabilidad = false;
    //this.boolChatTecInfo = true;
    //this.boolChatSoporteSOS = false;
  }

  verChatSoporteSOS(event: any) {
    //this.boolChatIngresos = false;
    //this.boolChatEgresos = false;
    //this.boolChatTesoreria = false;
    //this.boolChatVHumano = false;
    //this.boolChatContabilidad = false;
    //this.boolChatTecInfo = false;
    //this.boolChatSoporteSOS = true;
  }

  enviaMensaje(event: any) {
  }
}
