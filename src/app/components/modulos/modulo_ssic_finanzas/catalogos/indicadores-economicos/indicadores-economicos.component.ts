import { Component, OnInit } from '@angular/core';
import { ValidatorServService } from '../../../../../servicios/validator-serv.service';
import Swal from 'sweetalert2';
//<qrcode [qrdata]="'Tu cadena de datos'" [width]="256" [errorCorrectionLevel]="'M'"></qrcode> imports QRCodeComponent,
import { TranslateService } from '@ngx-translate/core';
import { SentinelArkManager } from '../../../../../servicios/sentinel-ark-manager';
import { FnzsIndicadoresService } from '../../../../../servicios/ssic/fnzs-indicadores.service';

@Component({
  selector: 'app-indicadores-economicos',
  templateUrl: './indicadores-economicos.component.html',
  standalone: false,
  styleUrls: [
    '../../../../../styles/listas_ps.css',
    '../../../../../styles/datatable.css',
    '../../../../../styles/input_group.css',
    '../../../../../styles/buttons.css',
    '../../../../../styles/modals.css',
    '../../../../../styles/clientes.css',
    '../../../../../styles/cabecera.css',
    '../../../../../styles/collapsible.css',
    '../../../../../styles/row.css',
    '../../../../../styles/encabezados.css',
    '../../../../../styles/buscador.css',
    '../../../../../styles/radioButtons.css',
    '../../../../../styles/paginador.css',
    '../../../../../styles/navegador.css',
    '../../finanzas.css',
    './indicadores-economicos.component.css']
})
export class IndicadoresEconomicosComponent implements OnInit {
  public identidad: any;

  public chat_clave: string = '';
  public chat_respuestas: any = [];

  public inpc_text: string = "---";
  public inpc_save: string = "";
  public inpc_list: any = [];

  public tasa_recargos_text: string = "---";
  public tasa_recargos_list: any = [];

  public tipo_cmb_pdp_text: string = "---";
  public tipo_cmb_pdp_list: any = [];

  public salario_minimo_text: string = "---";
  public salario_minimo_list: any = [];

  public salario_min_fronterizo_text: string = "---";
  public salario_min_fronterizo_list: any = [];

  public uma_text: string = "---";
  public uma_list: any = [];

  public udi_text: string = "---";
  public udi_list: any = [];

  public tiie_text: string = "---";
  public tiie_list: any = [];

  constructor(
    private sentinela: SentinelArkManager,
    private validator: ValidatorServService,
    private translate: TranslateService,
    private indicadores_serv: FnzsIndicadoresService
  ) {
    this.identidad = this.sentinela.getIdentifUsuario();
  }

  ngOnInit(): void {
    this.lista_indicadores();
  }

  cerrarModal(modal: any) {
    $(modal).removeClass("open");
  }

  lista_indicadores() {
    this.indicadores_serv.verFnzsIndicadores().subscribe(
      response => {
        if (response.status == 'success') {
          this.inpc_text = response.inpc;
          this.tasa_recargos_text = response.tasa_recargos;
          this.tipo_cmb_pdp_text = response.tipo_cmb_pdp;
          this.salario_minimo_text = response.salario_minimo;
          this.salario_min_fronterizo_text = response.salario_min_fronterizo;
          this.uma_text = response.uma;
          this.udi_text = response.udi;
          this.tiie_text = response.tiie;
        }
      }, error => { console.log(error); }
    );
  }

  async enviaChatGPT() {
    console.log(this.chat_clave);
    if (this.chat_clave.trim() === '') {
      return;
    }
    this.chat_respuestas.push(`You: ${this.chat_clave}`);
    this.chat_clave = '';
  }

  //inpc
  ver_indicador_inpc() {
    this.indicadores_serv.indicadores_inpc().subscribe(
      response => {
        if (response.status == 'success') {
          this.inpc_list = response.indicador;
          //this.chat_clave = "INPC";
          //this.enviaChatGPT();
        }
      }, error => { console.log(error); }
    );
  }

  keyup_indicador_inpc(event: any) {
    if (event.value != "" && this.validator.filtroNum(event.value) == true && event.value.length >= 3) {
      this.inpc_save = event.value;
      this.validator.correctoInputRow(event);
    } else {
      this.inpc_save = "";
      this.validator.errorInputRow(event);
    }
    console.log(this.inpc_save);
  }

  indicador_inpc_to_save() {
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_insert"),
      icon: 'question',
      confirmButtonColor: '#388E3C',
      confirmButtonText: this.translate.instant("swal_yes_insert"),
      showCancelButton: true,
      cancelButtonColor: '#D32F2F',
      cancelButtonText: this.translate.instant("swal_cancel"),
    }).then(
      (result) => {
        if (result.isConfirmed) {
          if (this.inpc_save != "" && this.validator.strFilter(this.inpc_save) == true && this.inpc_save.length >= 3) {
            this.indicadores_serv.indicadores_inpc_new(this.inpc_save).subscribe(
              response => {
                let translate_response = this.translate.instant(response.message);
                if (response.status == 'success') {
                  //this.reembolsos_detalle(this.tokenReembolso);
                  //this.clean_coti();
                  this.ver_indicador_inpc();
                  setTimeout(function () {
                    Swal.fire({
                      position: 'center',
                      icon: 'success',
                      title: translate_response,
                      showConfirmButton: false,
                      timer: 3000
                    })
                  }, 3000);
                }
                if (response.status == 'error') {
                  Swal.fire({
                    position: 'top-end',
                    icon: 'warning',
                    title: translate_response,
                    showConfirmButton: false,
                    timer: 3000
                  })
                }
              },
              error => {
                console.log(error);
              }
            );
          } else {
            this.validator.errorInputRow(document.getElementById("txt_indicador_inpc"))
          }
        }
      }
    );
  }

  //tasa_recargos
  indicadores_tasa_recargos() {
    this.indicadores_serv.verFnzsIndicadores().subscribe(
      response => {
        if (response.status == 'success') {
          this.tasa_recargos_list = response.tasa_recargos;


        }
      }, error => { console.log(error); }
    );
  }

  indicadores_tipo_cmb_pdp() {
    this.indicadores_serv.verFnzsIndicadores().subscribe(
      response => {
        if (response.status == 'success') {
          this.tipo_cmb_pdp_list = response.tipo_cmb_pdp;


        }
      }, error => { console.log(error); }
    );
  }

  indicadores_salario_minimo() {
    this.indicadores_serv.verFnzsIndicadores().subscribe(
      response => {
        if (response.status == 'success') {
          this.salario_minimo_list = response.salario_minimo;


        }
      }, error => { console.log(error); }
    );
  }

  indicadores_salario_min_front() {
    this.indicadores_serv.verFnzsIndicadores().subscribe(
      response => {
        if (response.status == 'success') {
          this.salario_min_fronterizo_list = response.salario_min_fronterizo;


        }
      }, error => { console.log(error); }
    );
  }

  indicadores_uma() {
    this.indicadores_serv.verFnzsIndicadores().subscribe(
      response => {
        if (response.status == 'success') {
          this.uma_list = response.uma;


        }
      }, error => { console.log(error); }
    );
  }

  indicadores_udi() {
    this.indicadores_serv.verFnzsIndicadores().subscribe(
      response => {
        if (response.status == 'success') {
          this.udi_list = response.udi;


        }
      }, error => { console.log(error); }
    );
  }

  indicadores_tiie() {
    this.indicadores_serv.verFnzsIndicadores().subscribe(
      response => {
        if (response.status == 'success') {
          this.tiie_list = response.tiie;


        }
      }, error => { console.log(error); }
    );
  }
}
