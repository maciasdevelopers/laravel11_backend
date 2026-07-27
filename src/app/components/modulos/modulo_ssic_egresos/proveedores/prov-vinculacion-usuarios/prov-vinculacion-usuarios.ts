import { Component, OnInit } from '@angular/core';
import { ValidatorServService } from '../../../../../servicios/validator-serv.service';
import { ProveedoresService } from '../../../../../servicios/proveedores.service';
import { TranslateService } from '@ngx-translate/core';
import { ServEncryptService } from '../../../../../servicios/ssic/serv-encrypt.service';
import { DescargaExcel } from '../../../../../servicios/descarga-excel';
import { ComunicacionInternaService } from '../../../../../servicios/comunicacion-interna.service';
import Swal from 'sweetalert2';
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app_prov_vinculacion_usuarios',
  standalone: false,
  templateUrl: './prov-vinculacion-usuarios.html',
  //styleUrl: './prov-vinculacion-usuarios.css'
  styleUrls: [
    '../../../../../styles/input_group.css',
    '../../../../../styles/buttons.css',
    '../../../../../styles/modals.css',
    '../../../../../styles/proveedores.css',
    '../../../../../styles/collapsible.css',
    '../../../../../styles/row.css',
    '../../../../../styles/cards.css',
    '../../../../../styles/encabezados.css',
    '../../../../../styles/div_busqueda.css',
    '../../../../../styles/radioButtons.css',
    '../../../../../styles/paginador.css',
    '../../../../../styles/tabs.css',
    '../../../../../styles/loading.css',
    '../../../../../styles/listas_ps.css',
    '../../../../../styles/landing.css',
    '../../../../../styles/colores.css',
    '../../../../../styles/navegador.css',
    '../../../../../styles/switches.css',
    '../../../../../styles/ubicaciones.css',
    '../../egresos.css',
    './prov-vinculacion-usuarios.css'
  ]
})
export class ProvVinculacionUsuarios implements OnInit{
  list_proveedores_vincular:any = [];

  constructor(
    public validator:ValidatorServService,
    public _provServ: ProveedoresService,
    private translate:TranslateService,
    public encryptor:ServEncryptService,
    private servXlsx:DescargaExcel,
    private relInterna:ComunicacionInternaService) {
  }

  ngOnInit(): void {
    this.listProveedoresNotVincUser();  
  }

  listProveedoresNotVincUser(){
    this._provServ.provNotVincUser().subscribe(
      response => {
        if (response.status == 'success') {
          console.log(response)
          this.list_proveedores_vincular = response.listado;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  ver_usuarios_vinculados(token_soli_vinculo:any){

  }

  vincular_usuario(soli_vinculo_token:any,proveedor_token:any){
    let vinc_soli = this.list_proveedores_vincular.find((row:any) => row.soli_vinculo_token === soli_vinculo_token);
    Swal.fire({
      title: this.translate.instant("swal_attenc"),
      text: this.translate.instant("swal_insert"),
      icon: "warning",
      confirmButtonColor: "#388E3C",
      confirmButtonText: this.translate.instant("swal_yes_insert"),
      showCancelButton: true,
      cancelButtonColor: "#D32F2F",
      customClass: {
        popup: 'my-swal-zindex'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        if (vinc_soli.soli_usersVinculadosTotal > 0) {
          this._provServ.proveedorVincularExistenteUser(soli_vinculo_token,proveedor_token).subscribe(
            response => {
              console.log(response.message);
              let translate_response = this.translate.instant(response.message);
              if (response.status == "success") {
                setTimeout(function(){
                  Swal.fire({
                    position:"center",
                    icon: "success",
                    title: translate_response,
                    showConfirmButton:false,
                    timer: 3000,
                    customClass: {
                      popup: 'my-swal-zindex'
                    }
                  })
                },1000);
                this.listProveedoresNotVincUser();  
              }
              if (response.status == "error") {
                Swal.fire({
                  position:"top-end",
                  icon: "warning",
                  title: translate_response,
                  showConfirmButton:false,
                  timer: 3000,
                  customClass: {
                    popup: 'my-swal-zindex'
                  }
                })
              }
            },
            error => {
              //console.log(error);
            }
          ) 
        } else {
          var possible_letter = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
          var possible_char = '.,#$%&/()=';
          var stringDataCode = proveedor_token + vinc_soli.soli_vinculo_email + "code_access";
          var primerDataCode = this.encryptor.santoEncryptCode(stringDataCode).substring(0, 7);
          for (let a = 0; a < 1; a++) {
            primerDataCode = possible_letter.charAt(Math.floor(Math.random() * possible_letter.length)) + primerDataCode;
          }
          var segundaDataCode = this.encryptor.santoEncryptCode(primerDataCode);

          const password_generada = this.encryptor.generarPassWD(proveedor_token,vinc_soli.soli_vinculo_email);
          var password_db = this.encryptor.santoEncryptPass(password_generada);
          console.log(password_generada+" "+password_db);
          this._provServ.proveedorVincularNuevoUser(soli_vinculo_token,proveedor_token,segundaDataCode,password_db).subscribe(
            response => {
              console.log(response.message);
              let translate_response = this.translate.instant(response.message);
              if (response.status == "success") {
                setTimeout(function(){
                  Swal.fire({
                    position:"center",
                    icon: "success",
                    title: translate_response,
                    showConfirmButton:false,
                    timer: 3000,
                    customClass: {
                      popup: 'my-swal-zindex'
                    }
                  })
                },1000);
                this.listProveedoresNotVincUser();
                
                var contenidoHtml = '<html><head><title>titulo de la página</title></head>' +
                  '<body><div style="background-color: #d3d3d3;display:flex;justify-content:center">' +
                  '<h4 style="width: 100%;font-size: 35px;font-weight: bold;"></h4>' +
                  '<h6 style="width: 100%;font-weight: 600;"></h6><br>' +
                  '<p style="width: 100%;margin: 0;padding: 20px;"></p>' +
                  '<p style="width: 100%;margin: 0;padding-left: 20px;">Código de acceso: <strong>' + primerDataCode + '</strong></p>' +
                  '<p style="width: 100%;margin: 0;padding-left: 20px;">Contraseña: <strong>' + password_generada + '</strong></p>' +
                  '</div></body></html>';
                const parametros = {
                  from_name: 'SOPORTE SOS',
                  from_email: 'soporte@sos-mexico.com.mx',
                  to_name: vinc_soli.soli_vinculo_email + ' <' + vinc_soli.soli_vinculo_email + '>',
                  to_email: vinc_soli.soli_vinculo_email,
                  access_code: primerDataCode,
                  pass_code: password_generada,
                  link: 'https://sos-mexico.com.mx/clientes'
                };
                //emailjs.send(user['email'],contenidoHtml,parametros,'')
                emailjs.send('service_dejznyj', 'template_v1nh0fl', parametros, 'H1Nl6vkZbsBm1MtNF')
                .then((response) => {
                  console.log("success", response.status, response.text);
                  Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: response.text,
                    showConfirmButton: false,
                    timer: 3000
                  });
                }, (err) => {
                  console.log("falla", err);
                  Swal.fire({
                    position: 'top-end',
                    icon: 'warning',
                    title: "falla " + err,
                    showConfirmButton: false,
                    timer: 3000
                  })
                });

              }
              if (response.status == "error") {
                Swal.fire({
                  position:"top-end",
                  icon: "warning",
                  title: translate_response,
                  showConfirmButton:false,
                  timer: 3000,
                  customClass: {
                    popup: 'my-swal-zindex'
                  }
                })
              }
            },
            error => {
              //console.log(error);
            }
          ) 
        }
      }
    })
  }
}
