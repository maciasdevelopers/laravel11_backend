import { Component, OnInit, ElementRef, Renderer2, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ServLandCSSService } from '../../servicios/serv-land-css.service.js'; 
import { ImagesServiceService } from '../../servicios/ssic/images-service.service';
import { PublicacionesService } from '../../servicios/ssic/publicaciones.service.js';
import { VisitasService } from '../../servicios/ssic/visitas.service';
import { TranslateService } from '@ngx-translate/core';
import { FnzsIndicadoresService } from '../../servicios/ssic/fnzs-indicadores.service';
import { ComunicacionInternaService } from '../../servicios/comunicacion-interna.service.js';
import { SessionContextService } from '../../servicios/session-context';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './index_component.component.html',
  standalone:false,
  styleUrls: [
    '../../styles/navegador.css',
    '../../styles/landing.css',
    '../../styles/input_group.css',
    '../../styles/login.css',
    '../../styles/images.css',
    '../../styles/buttons.css',
    '../../styles/loading.css',
    '../../styles/collection.css',
    '../../styles/collapsible.css',
    '../../styles/passValidate.css',
    '../../styles/parallax.css',
    '../../styles/modals.css',
    '../../styles/cards.css',
    '../../styles/page_landing_index.css',
    './index_component.component.css',
  ]
})
export class RaizComponent implements OnInit{
  public view_login_window:boolean = false;
  public header_login_window:string = '';
  public isCollapsedNavegador:boolean = true;
  message:any = null;
  public token_firebase_web:string;
  options = {};

  public fondoLoginSistemas:string;

  public status: string = "";
  public module_working_token: any;
	public settings_crear_token: any;
	public settings_editar_token: any;
	public settings_consultar_token: any;
	public settings_eliminar_token: any;
	public settings_verdocs_token: any;
	public user_code_token: any;
	public user_info_token: any;
	public system_language_token: any;
	public type_process_module_token: any;
  public enlace_link_token: any;

  public mayusLogin:boolean = false;
  public numberLogin:boolean = false;
  public symbolLogin:boolean = false;

  public visitasTotal:number = 0;

  public viewInicio:boolean = false;
  public identif: any;
  dataimglogo:any = [];

  public inpc:string = "---";
  public tasa_recargos:string = "---";
  public tipo_cmb_pdp:string = "---";
  public salario_minimo:string = "---";
  public salario_min_fronterizo:string = "---";
  public uma:string = "---";
  public udi:string = "---";
  public tiie:string = "---";

  public boolPublicaciones:boolean = false;
  publicaciones_lista:any = [];
  public view_publicacion_window:boolean = false;
  publicacion_completa_desglose:any = [];
  public publicacion_encabezado:string = '';
  arrayDetallePublicaciones:any = [];
  //login
  //public show_pass_reset:boolean = false;
  //public visor_pass_active:boolean = false;
  //public porcentaje_barra:number = 0; 

  constructor(private cssService:ServLandCSSService,
    public indicadores_serv:FnzsIndicadoresService,
    public publicacionServ:PublicacionesService,
    public vis_serv:VisitasService,
    private translate:TranslateService,
    private sessionContext:SessionContextService,
    public imgService: ImagesServiceService,
    private cd: ChangeDetectorRef,
    private relInterna:ComunicacionInternaService) {
    this.token_firebase_web = "";
    this.cssService.cargaArchCss(["fuentes"]);
    this.fondoLoginSistemas = "background-image: url('../assets/images/modals/modal_login.png')!important;";
    this.header_login_window = "access_ssic";
  }

  ngOnInit(): void {
    this.lista_indicadores();
    this.lista_publicaciones_min();
    this.getRespuestaLoginUser();
    this.visitas_page();
    $(".indicator").addClass("noneView");
    var porcentajeCarga = 0;
    var intervalo = setInterval(() => {
      porcentajeCarga = porcentajeCarga +1;
      var porcentDiv = porcentajeCarga+'%';
      $(".h6loadingSeccion").html('cargando... '+porcentDiv);
      if (porcentajeCarga == 100) {
        clearInterval(intervalo);
        $("#iContent").removeClass("noneView");
        setTimeout(() => {
          $("#loadingSeccion").fadeOut("slow");
        },3000);
      }
    },30);
    //this.getTokenDeviceFire();
  }

  getRespuestaLoginUser(){
    this.relInterna.mensajeLoginUser$.subscribe(
      (mensaje:any) => {
        this.header_login_window = mensaje;
      }
    );
  }
  
  lista_indicadores(){
    this.inpc = "---";
    this.tasa_recargos = "---";
    this.tipo_cmb_pdp = "---";
    this.salario_minimo = "---";
    this.salario_min_fronterizo = "---";
    this.uma = "---";
    this.udi = "---";
    this.tiie = "---";

    forkJoin({
      serv_inpc_banxico: this.indicadores_serv.indicadores_inpc_banxico(),
      indicadores_list: this.indicadores_serv.verHomeIndicadores(),
      serv_sal_min_gral_banxico:this.indicadores_serv.indicadores_sal_min_gral_banxico(),
      serv_sal_min_front_banxico:this.indicadores_serv.indicadores_sal_min_front_banxico(),
      serv_uma_banxico:this.indicadores_serv.indicadores_uma_banxico(),
      serv_udi_banxico:this.indicadores_serv.indicadores_udi_banxico(),
      serv_tipo_de_cambio_banxico:this.indicadores_serv.indicadores_tipo_de_cambio_banxico(),
      serv_tiie_banxico: this.indicadores_serv.indicadores_tiie_banxico()
    }).subscribe({
      next: (res:any) => {
        console.log(res.indicadores_list)
        if (
          res.serv_inpc_banxico.status === 'success' &&
          res.indicadores_list.status === 'success' && 
          res.serv_sal_min_gral_banxico.status === 'success' && 
          res.serv_sal_min_front_banxico.status === 'success' && 
          res.serv_uma_banxico.status === 'success' && 
          res.serv_udi_banxico.status === 'success' && 
          res.serv_tipo_de_cambio_banxico.status === 'success' && 
          res.serv_tiie_banxico.status === 'success'
        ) {
          //inpc
          this.inpc = res.serv_inpc_banxico.valor+" "+res.serv_inpc_banxico.fecha;
          //tasa_recargos
          this.tasa_recargos = res.indicadores_list.tasa_recargos;
          //salario_minimo
          this.salario_minimo = res.serv_sal_min_gral_banxico.valor+" "+res.serv_sal_min_gral_banxico.fecha;
          //salario_min_fronterizo
          //this.salario_min_fronterizo = res.serv_sal_min_front_banxico.valor+" "+res.serv_sal_min_front_banxico.fecha;
          this.salario_min_fronterizo = res.indicadores_list.salario_min_fronterizo;
          //uma
          //this.uma = res.serv_uma_banxico.valor+" "+res.serv_uma_banxico.fecha;
          this.uma = res.indicadores_list.uma;
          //udi
          this.udi = res.serv_udi_banxico.valor+" "+res.serv_udi_banxico.fecha;
          //tipo_cmb_pdp
          this.tipo_cmb_pdp = res.serv_tipo_de_cambio_banxico.valor+" "+res.serv_tipo_de_cambio_banxico.fecha;
          //tiie
          this.tiie = res.serv_tiie_banxico.valor+" "+res.serv_tiie_banxico.fecha;
          this.cd.detectChanges();
        }
      },
      error: (err) => {
        console.error("Fallo en la comunicación con el servidor contable", err);
      },
    });
  }

  lista_publicaciones_min(){
    this.publicacionServ.verPublicacionesMin().subscribe(
      response => {
        if (response.status == 'success') {
          this.boolPublicaciones = true;
          this.publicaciones_lista = response.arrayPublicaciones;
          console.log(this.publicaciones_lista);
          this.cd.detectChanges();
        }
      }, error => {console.log(error);}
    );
  }

  ver_desglose_pub_completa(pub:any){
    this.publicacionServ.publicacionCompleta(pub.token_publicacion).subscribe(
      response => {
        console.log(response);
        if (response.status == 'success') {
          this.publicacion_completa_desglose = response.publicacion;
          this.publicacion_encabezado = pub.encabezado;
          this.view_publicacion_window = true;
          this.cd.detectChanges();
        }
      }, error => {console.log(error);}
    );
  }

  visitas_page(){
    this.vis_serv.totalVisitas().subscribe(
      response => {
        if (response.status == 'success') {
          this.visitasTotal = response.total_visitas;
          //console.log(response.total_visitas+" "+this.visitasTotal);
          this.cd.detectChanges();
        }
      }, error => {console.log(error);}
    );
  }

  cambiaIdioma(event:any,lenguaje:any){
    let menu_idioma = $(event).parents("ul.menu_idioma");
    let botones = $(menu_idioma).find("a.btnIdioma");
    $(botones).removeClass("active_lang");
    $(event).addClass("active_lang");
    console.log(lenguaje);
    this.sessionContext.setLenguaje(lenguaje);
  }

  fixedMenu(){
    $(document).ready(
      function(){
        let windowTop:any = $(window).scrollTop();
        if (windowTop <= 218) {
          $("#content-fixed").removeClass("content-fixed");
        } else {
          if (!$("#content-fixed").hasClass("content-fixed")) {
            $("#content-fixed").addClass("content-fixed");
          }
        }
      }
    )
  }

  verPublicacion(event:any,token_publicacion:any){
    this.publicacionServ.detallePublicacion(token_publicacion).subscribe(
      response => {
        if (response.status == 'success') {
          this.arrayDetallePublicaciones = response.arrayPublicaciones;
          var elems = document.querySelectorAll('.parallax');
          //M.Parallax.init(elems, global.options);
        }
      }, error => {console.log(error);}
    );
  }

  verLoginWindow(){
    this.view_login_window = true;
  }
}
