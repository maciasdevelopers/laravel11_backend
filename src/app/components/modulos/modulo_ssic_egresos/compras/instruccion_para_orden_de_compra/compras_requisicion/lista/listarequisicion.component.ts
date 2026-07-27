import { Component,OnInit } from '@angular/core';
import { Usuarios } from '../../../../../../../modelos/Usuarios';
import { RequisicionesService } from '../../../../../../../servicios/ssic/requisiciones.service';
import Swal from 'sweetalert2';
import { ValidatorServService } from '../../../../../../../servicios/validator-serv.service';
import {Html5QrcodeScanner, Html5QrcodeScannerState} from "html5-qrcode";
//<qrcode [qrdata]="'Tu cadena de datos'" [width]="256" [errorCorrectionLevel]="'M'"></qrcode> imports QRCodeComponent,
import { SentinelArkManager } from '../../../../../../../servicios/sentinel-ark-manager';
import { TranslateService } from '@ngx-translate/core';
import { Table } from 'primeng/table';
import { Router } from '@angular/router';
import { SessionContextService } from '../../../../../../../servicios/session-context';

@Component({
  selector: 'app_interno_egresos_compras_requisicion_lista',
  templateUrl: './listarequisicion.component.html',
  standalone:false,
  styleUrls: [
    '../../../../../../../styles/listas_ps.css',
    '../../../../../../../styles/datatable.css',
    '../../../../../../../styles/dropdown.css',
    '../../../../../../../styles/tabs.css',
    '../../../../../../../styles/input_group.css',
    '../../../../../../../styles/file_input.css',
    '../../../../../../../styles/buttons.css',
    '../../../../../../../styles/modals.css',
    '../../../../../../../styles/cabecera.css',
    '../../../../../../../styles/cards.css',
    '../../../../../../../styles/clientes.css',
    '../../../../../../../styles/collapsible.css',
    '../../../../../../../styles/row.css',
    '../../../../../../../styles/encabezados.css',
    '../../../../../../../styles/buscador.css',
    '../../../../../../../styles/radioButtons.css',
    '../../../../../../../styles/paginador.css',
    '../../../../../../../styles/landing.css',
    '../../../../../../../styles/colores.css',
    '../../../../../../../styles/switches.css',
    '../../../../egresos.css',
    './listarequisicion.component.css'],
  providers: [RequisicionesService]
})
export class ListaRequisicionComponent implements OnInit {
  public usuario: Usuarios;
  public identidad: any;
  public vistaRequisiciones:boolean = false;
  listaRequisiciones:any = [];
  requisicionModal:any = [];
  requisicionDocs:string = "";
  public count_requi_auth_cotizar: number = 0;

  customers:any = [];
  representatives:any = [];
  statuses!: any[];
  loading: boolean = true;
  activityValues: number[] = [0, 100];
  searchValue: string | undefined;
  url_activa:string = "";

  constructor(
    private validator:ValidatorServService,
    private _reqService: RequisicionesService,
    private sessionContext: SessionContextService,
    private sentinela: SentinelArkManager,
    private translate:TranslateService,
    private router:Router) {
    this.usuario = new Usuarios(1,"","","","","","","",1,1,"","","","");
    this.identidad = this.sentinela.getIdentifUsuario();
  }

  ngOnInit(): void {
    const url_serv = this.router.url;
    console.log(url_serv);
    this.url_activa = this.router.url;
    this.listarRequisicionesDone();
    this.customers = [{
      id: 1000,
      name: 'James Butt',
      country: {
        name: 'Algeria',
        code: 'dz'
      },
      company: 'Benton, John B Jr',
      date: '2015-09-13',
      status: 'unqualified',
      verified: true,
      activity: 17,
      representative: {
          name: 'Ioni Bowcher',
          image: 'ionibowcher.png'
      },
      balance: 70663
    },{
      id: 2000,
      name: 'Jairo Butt',
      country: {
        name: 'Algeria',
        code: 'dz'
      },
      company: 'Benton, John B Jr',
      date: '2015-09-13',
      status: 'unqualified',
      verified: true,
      activity: 17,
      representative: {
          name: 'Ioni Bowcher',
          image: 'ionibowcher.png'
      },
      balance: 70663
    }];
    this.loading = false;

    this.customers.forEach((customer:any) => (customer.date = new Date(<Date>customer.date)));

    this.representatives = [
      { name: 'Amy Elsner', image: 'amyelsner.png' },
      { name: 'Anna Fali', image: 'annafali.png' },
      { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
      { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
      { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
      { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
      { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
      { name: 'Onyama Limba', image: 'onyamalimba.png' },
      { name: 'Stephen Shaw', image: 'stephenshaw.png' },
      { name: 'Xuxue Feng', image: 'xuxuefeng.png' }
    ];

    this.statuses = [
      { label: 'Unqualified', value: 'unqualified' },
      { label: 'Qualified', value: 'qualified' },
      { label: 'New', value: 'new' },
      { label: 'Negotiation', value: 'negotiation' },
      { label: 'Renewal', value: 'renewal' },
      { label: 'Proposal', value: 'proposal' }
    ];
  }

  get empresa_data() {
    //console.log(this.sessionContext.empresa_data);
    return this.sessionContext.empresa_data;
  }

  get permiso_consulta() {
    return this.sessionContext.privilegio_consulta;
  }

  listarRequisicionesDone(){
    this.vistaRequisiciones = false;
    this._reqService.catalogoReqTrue().subscribe(
      response => {
        this.vistaRequisiciones = true;
        if (response.status == 'success') {
          console.log(response);
          this.listaRequisiciones = response.requisiciones;
          console.log(this.listaRequisiciones);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  openRequiDetail(token_requisicion:any){
    this.requisicionModal = [];
    for (let i = 0; i < this.listaRequisiciones.length; i++) {
      const row = this.listaRequisiciones[i];
      if (row["requisicion_token"] == token_requisicion) {
        this._reqService.detalleRequisicion(token_requisicion).subscribe(
          response => {
            if (response.status == 'success') {
              console.log(response);
              row["abierto"] = true;
              row["valida_autorizar"] = false;
              row["desglose_true"] = response.desglose_true;
              row["desglose_false"] = response.desglose_false;
              this.openModalDetail(this.listaRequisiciones[i]);
            }
            if (response.status == 'error') {
              let translate_response = this.translate.instant(response.message);
              Swal.fire({
                position:'top-end',
                icon: 'warning',
                title: translate_response,
                showConfirmButton:false,
                timer: 3000
              })
            }
          },
          error => {
            console.log(error);
          }
        );
      } else {
        row["abierto"] = false;
      }
    }
  }
  
  openModalDetail(requisicion:any){
    this.requisicionModal.push(requisicion);
    console.log(requisicion);
    console.log(this.requisicionModal);
    for (let i = 0; i < this.requisicionModal.length; i++) {
      const req = this.requisicionModal[i];
      console.log(req["desglose_true"]);
      if (req["abierto"] == true) {
        //for (let c = 0; c < this.identi_dad["company"].length; c++) {
        //  const emp = this.identi_dad["company"][c];
        //}
      }
    }
  }
  
  closeRequiDetail(token_requisicion:any){
    for (let i = 0; i < this.listaRequisiciones.length; i++) {
      const row = this.listaRequisiciones[i];
      if (row["requisicion_token"] == token_requisicion) {
        console.log("requisicion_token "+row["requisicion_token"]);
        row["abierto"] = false;
      }
    }
  }
  
  verDocs(requisicion:any) {
    this.requisicionDocs = this.requisicionDocs === requisicion ? null : requisicion;
  }

  eliminarRequisicionDetalle(token_requisicion:any,token_detalle_requisicion:any){
    console.log("token_requisicion: "+token_requisicion+" token_detalle_requisicion: "+token_detalle_requisicion);
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_delete"),
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_delete"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          this._reqService.eliminaRequisicionDetalle(token_requisicion,token_detalle_requisicion).subscribe(
            response => {
              let translate_response = this.translate.instant(response.message);
              if (response.status == 'success') {
                this.openRequiDetail(token_requisicion);
                setTimeout(function(){
                  Swal.fire({
                    position:'center',
                    icon: 'success',
                    title: translate_response,
                    showConfirmButton:false,
                    timer: 3000
                  })
                },3000);
              }
              if (response.status == 'error') {
                Swal.fire({
                  position:'top-end',
                  icon: 'warning',
                  title: translate_response,
                  showConfirmButton:false,
                  timer: 3000
                })
              }
            },
            error => {
              console.log(error);
            }
          );
        }
      }
    );
  }
  
  requiAuthToCotizarAll(requisicion_token:any,decision:any){
    console.log(this.listaRequisiciones);
    for (let a = 0; a < this.listaRequisiciones.length; a++) {
      const requi = this.listaRequisiciones[a];
      if (requi["requisicion_token"] == requisicion_token) {
        for (let b = 0; b < requi["desglose_true"].length; b++) {
          const desglose = requi["desglose_true"][b];
          if (desglose["bool_requi_autorizacion"] == false){
            if (decision == true) {
              desglose["char_requi_autorizacion"] = "A";
              requi["coments_rechazo_bool"] = false;
              desglose["requi_coments_rechazo_bool"] = true;
            } else {
              desglose["char_requi_autorizacion"] = "D";
              requi["coments_rechazo_bool"] = true;
              desglose["requi_coments_rechazo_bool"] = false;
            }
            this.requiAuthAnalizis(requisicion_token);
          }
        }
      }
    }
    console.log(this.count_requi_auth_cotizar);
    //valida_autorizar
  }
  
  requiAuthCantidad(event:any,valor:any,requisicion_token:any,token_detalle_requisicion:any){
    console.log(this.listaRequisiciones);
    for (let a = 0; a < this.listaRequisiciones.length; a++) {
      const requi = this.listaRequisiciones[a];
      if (requi["requisicion_token"] == requisicion_token) {
        for (let b = 0; b < requi["desglose_true"].length; b++) {
          const desglose = requi["desglose_true"][b];
          if (desglose["token_detalle_requisicion"] == token_detalle_requisicion){
            desglose["requi_cantidad_autorizada"] = valor.value;
            if (valor.value != "" && this.validator.filtroNum(valor.value) == true) {
              this.validator.correctoInputRow(valor);
            } else {
              event.preventDefault();
              this.validator.errorInputRow(valor);
            }
            this.requiAuthAnalizis(requisicion_token);
          }
        }
      }
    }
    console.log(this.count_requi_auth_cotizar);
  }
  
  onKeyPressNumbers(e:KeyboardEvent) {
    this.validator.key_press_numbers(e);
  }
  
  onKeyPressAlfa(e:KeyboardEvent) {
    this.validator.key_press_alfa(e);
  }
  
  viewDocumento(event: any){
    window.open(event.value, '_blank');
  }
  
  requiAuthToCotizarTrue(requisicion_token:any,token_detalle_requisicion:any,event:any){
    console.log(this.listaRequisiciones);
    for (let a = 0; a < this.listaRequisiciones.length; a++) {
      const requi = this.listaRequisiciones[a];
      if (requi["requisicion_token"] == requisicion_token) {
        for (let b = 0; b < requi["desglose_true"].length; b++) {
          const desglose = requi["desglose_true"][b];
          if (desglose["token_detalle_requisicion"] == token_detalle_requisicion){
            desglose["requi_coments_rechazo_bool"] = true;
            if (event.checked == true) {
              desglose["char_requi_autorizacion"] = "A";
            } else {
              desglose["char_requi_autorizacion"] = "N";
            }
            console.log(desglose["char_requi_autorizacion"]);
            this.requiAuthAnalizis(requisicion_token);
          }
        }
      }
    }
    console.log(this.count_requi_auth_cotizar);
    //valida_autorizar
  }
  
  requiAuthToCotizarFalse(requisicion_token:any,token_detalle_requisicion:any,event:any){
    console.log(this.listaRequisiciones);
    for (let a = 0; a < this.listaRequisiciones.length; a++) {
      const requi = this.listaRequisiciones[a];
      if (requi["requisicion_token"] == requisicion_token) {
        for (let b = 0; b < requi["desglose_true"].length; b++) {
          const desglose = requi["desglose_true"][b];
          if (desglose["token_detalle_requisicion"] == token_detalle_requisicion){
            if (event.checked == true) {
              desglose["char_requi_autorizacion"] = "D";
              desglose["requi_coments_rechazo_bool"] = false;
            } else {
              desglose["char_requi_autorizacion"] = "N";
              desglose["requi_coments_rechazo_bool"] = true;
            }
            console.log(desglose["char_requi_autorizacion"]);
            this.requiAuthAnalizis(requisicion_token);
          }
        }
      }
    }
    console.log(this.count_requi_auth_cotizar);
    //valida_autorizar
  }

  keyupObservaRequi(requisicion_token:any,token_detalle_requisicion:any,event:any){
    console.log(this.listaRequisiciones);
    for (let a = 0; a < this.listaRequisiciones.length; a++) {
      const requi = this.listaRequisiciones[a];
      if (requi["requisicion_token"] == requisicion_token) {
        for (let b = 0; b < requi["desglose_true"].length; b++) {
          const desglose = requi["desglose_true"][b];
          if (desglose["token_detalle_requisicion"] == token_detalle_requisicion){
            if (event.value != "" && this.validator.strFilter(event.value) == true && event.value.length >= 4) {
              desglose["requi_autorizacion_coments_write"] = event.value;
              this.validator.correctoInputRow(event);
            } else {
              desglose["requi_autorizacion_coments_write"] = "";
              this.validator.errorInputRow(event);
            }
            this.requiAuthAnalizis(requisicion_token);
          }
        }
      }
    }
    console.log(this.count_requi_auth_cotizar);
  }
  
  keyupObservaRequiAllRechazo(requisicion_token:any,event:any){
    console.log(this.listaRequisiciones);
    for (let a = 0; a < this.listaRequisiciones.length; a++) {
      const requi = this.listaRequisiciones[a];
      if (requi["requisicion_token"] == requisicion_token) {
        if (event.value != "" && this.validator.strFilter(event.value) == true && event.value.length >= 4) {
          requi["coments_rechazo_text"] = event.value;
          this.validator.correctoInputRow(event);
        } else {
          requi["coments_rechazo_text"] = "";
          this.validator.errorInputRow(event);
        }
        this.requiAuthAnalizis(requisicion_token);
      }
    }
    console.log(this.count_requi_auth_cotizar);
  }
  
  requiAuthAnalizis(requisicion_token:any){
    console.log(this.listaRequisiciones);
    for (let a = 0; a < this.listaRequisiciones.length; a++) {
      const requi = this.listaRequisiciones[a];
      if (requi["requisicion_token"] == requisicion_token) {
        var someAuth = requi["desglose_true"].some((row:any) => row.bool_requi_autorizacion == false && row.char_requi_autorizacion != "N");
        var someComents = requi["desglose_true"].some((row:any) => row.bool_requi_autorizacion == false && (
          (row.char_requi_autorizacion == "D" && requi["coments_rechazo_text"] == "" && row.requi_autorizacion_coments_write == "") || 
          (row.char_requi_autorizacion == "A" && row.requi_cantidad_autorizada != row.requi_cantidad && row.requi_autorizacion_coments_write == "")
        ));
        console.log(someAuth+" "+someComents);
        requi["valida_autorizar"] = someAuth == true && someComents == false ? true : false;
        //requi["valida_autorizar"] = someAuth == false ? true : false;
      }
    }
    console.log(this.count_requi_auth_cotizar);
    //valida_autorizar
  }
  
  autorizaRequisicion(token_requisicion:any,token_detalle_requisicion:any,decision:any,coments:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("req_auth"),
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("yes"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          if (decision == true) {
            for (let a = 0; a < this.listaRequisiciones.length; a++) {
              const requi = this.listaRequisiciones[a];
              if (requi["requisicion_token"] == token_requisicion) {
                for (let b = 0; b < requi["desglose_true"].length; b++) {
                  const desglose = requi["desglose_true"][b];
                  if (desglose["token_detalle_requisicion"] == token_detalle_requisicion){
                    this._reqService.autorizaRequisicion(token_requisicion,token_detalle_requisicion,desglose["requi_cantidad_autorizada"],coments).subscribe(
                      response => {
                        let translate_response = this.translate.instant(response.message);
                        if (response.status == 'success') {
                          setTimeout(function(e:any){
                            Swal.fire({
                              position:'center',
                              icon: 'success',
                              title: translate_response,
                              showConfirmButton:false,
                              timer: 3000
                            })
                            e.openRequiDetail(token_requisicion);
                            requi["valida_autorizar"] = false;
                          },3000);
                        }
                        if (response.status == 'error') {
                          Swal.fire({
                            position:'top-end',
                            icon: 'warning',
                            title: translate_response,
                            showConfirmButton:false,
                            timer: 3000
                          })
                        }
                      },
                      error => {
                        console.log(error);
                      }
                    );
                  }
                }
              }
            }
          } else {
            this._reqService.desautorizaRequisicion(token_requisicion,token_detalle_requisicion,coments).subscribe(
              response => {
                let translate_response = this.translate.instant(response.message);
                if (response.status == 'success') {
                  this.openRequiDetail(token_requisicion);
                  setTimeout(function(){
                    Swal.fire({
                      position:'center',
                      icon: 'success',
                      title: translate_response,
                      showConfirmButton:false,
                      timer: 3000
                    })
                  },3000);
                }
                if (response.status == 'error') {
                  Swal.fire({
                    position:'top-end',
                    icon: 'warning',
                    title: translate_response,
                    showConfirmButton:false,
                    timer: 3000
                  })
                }
              },
              error => {
                console.log(error);
              }
            );
          } 
        }
      }
    );
  }
  
  autorizaRequisicionAll(token_requisicion:any,coments_rechazo:any,desglose:any){
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("req_auth"),
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("yes"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          for (let a = 0; a < this.listaRequisiciones.length; a++) {
            const requi = this.listaRequisiciones[a];
            if (requi["requisicion_token"] == token_requisicion) {
              this._reqService.autorizaRequisicionAll(token_requisicion,coments_rechazo,desglose).subscribe(
                response => {
                  let translate_response = this.translate.instant(response.message);
                  if (response.status == 'success') {
                    this.openRequiDetail(token_requisicion);
                    setTimeout(function(){
                      Swal.fire({
                        position:'center',
                        icon: 'success',
                        title: translate_response,
                        showConfirmButton:false,
                        timer: 3000
                      })
                    },3000);
                  }
                  if (response.status == 'error') {
                    Swal.fire({
                      position:'top-end',
                      icon: 'warning',
                      title: translate_response,
                      showConfirmButton:false,
                      timer: 3000
                    })
                  }
                },
                error => {
                  console.log(error);
                }
              );
            }
          }
        }
      }
    );
  }

  clear(table: Table) {
    table.clear();
    this.searchValue = ''
  }

  getSeverity(status: string) {
    switch (status.toLowerCase()) {
        case 'unqualified':
            return 'danger';

        case 'qualified':
            return 'success';

        case 'new':
            return 'info';

        case 'negotiation':
            return 'warn';

        default:
            return null;
    }
  }
}
