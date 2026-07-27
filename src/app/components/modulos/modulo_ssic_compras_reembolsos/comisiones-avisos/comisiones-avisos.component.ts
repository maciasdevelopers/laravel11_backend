import { Component, OnInit} from "@angular/core";
import { Usuarios } from "../../../../modelos/Usuarios";
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import '../../../../../assets/js/zxcvbn.js';
// To use Html5Qrcode (more info below)
//<qrcode [qrdata]="'Tu cadena de datos'" [width]="256" [errorCorrectionLevel]="'M'"></qrcode> imports QRCodeComponent,
import { SsicComisionesService } from "../../../../servicios/ssic/ssic-comisiones.service";
//const messaging = getMessaging();  

@Component({
  selector: 'app-comisiones-avisos',
  templateUrl: './comisiones-avisos.component.html',
  standalone:false,
  styleUrls: [
    './comisiones-avisos.component.css',
    './../../modulo_ssic_egresos/egresos.css',
    '../../../../styles/listas_ps.css',
    '../../../../styles/datatable.css',
    '../../../../styles/input_group.css',
    '../../../../styles/file_input.css',
    '../../../../styles/buttons.css',
    '../../../../styles/modals.css',
    '../../../../styles/modalFixed.css',
    '../../../../styles/cabecera.css',
    '../../../../styles/clientes.css',
    '../../../../styles/collapsible.css',
    '../../../../styles/cards.css',
    '../../../../styles/row.css',
    '../../../../styles/encabezados.css',
    '../../../../styles/buscador.css',
    '../../../../styles/dropdown.css',
    '../../../../styles/radioButtons.css',
    '../../../../styles/paginador.css',
    '../../../../styles/breadcrumb.css',
  ]
})
export class EEGRComisionesAvisosComponent implements OnInit {
  public usuario: Usuarios;
  public tokenComision:any = "";
  public peticion_status:string = "";
  public peticion_mensaje:string = "";

  constructor(
    private translate:TranslateService,
    private act_rute:ActivatedRoute,
    private comi_serv: SsicComisionesService,
  ) {
    this.usuario = new Usuarios(1,"","","","","","","",1,1,"","","","");
  }

  ngOnInit(): void {
    this.tokenComision = this.act_rute.snapshot.paramMap.get("tknComi");
    
    
    

    this.reembolsos_detalle();
  }

  cerrarModal(modal:any){
    $(modal).removeClass("open");
  }

  reembolsos_detalle(){
    this.comi_serv.comision_registro_aviso_eegr(this.tokenComision).subscribe(
      response => {
        this.peticion_status = response.status;
        this.peticion_mensaje = this.translate.instant(response.message);
      },
      error => {
        console.log(error);
      }
    );
  }
}
