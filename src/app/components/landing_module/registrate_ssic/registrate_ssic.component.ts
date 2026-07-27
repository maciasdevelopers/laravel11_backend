import { Component, OnInit, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Usuarios } from '../../../modelos/Usuarios';
import { LoaderServService } from '../../../servicios/ssic/loader-serv.service';
import { ValidatorServService } from '../../../servicios/validator-serv.service';
import { ServEncryptService } from '../../../servicios/ssic/serv-encrypt.service';
import { ServLandCSSService } from '../../../servicios/serv-land-css.service';
import { Router } from '@angular/router';
import { ImagesServiceService } from '../../../servicios/ssic/images-service.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app_registrate_ssic',
  templateUrl: './registrate_ssic.component.html',
  standalone:false,
  styleUrls: [
    '../../../styles/landing.css',
    '../../../styles/images.css',
    '../../../styles/parallax.css',
    '../../../styles/input_group.css',
    '../../../styles/buttons.css',
    './registrate_ssic.component.css'
  ]
})
export class RegistrateSsicComponent implements OnInit {
  public usuario: Usuarios;
  public status: string;
  public token: any;
  public identificaUser: any;
  public boolRegistro:string;
  constructor(private renderer:Renderer2,
    private routerr:Router,
    private validator:ValidatorServService,
    private encryptor:ServEncryptService) {
    this.usuario = new Usuarios(1,"","","","","","","",1,1,"","","","");
    this.status = '';
    this.boolRegistro = "";
  }
  ngOnInit(): void {
  }

  decideTipoRegistro(tipo_registro:any){
    if (tipo_registro == 'fis') {
      this.boolRegistro = "fis";
    } else {
      this.boolRegistro = "mor";
    }
  }

  onRegistro(form: { reset: () => void; }): void{
    //this._UsuariosService.registroCliente(this.usuario).subscribe(//funciones de callback
    //  response => {
    //    console.log(response);
    //    form.reset();
    //  },
    //  error => {
    //    console.log(<any>error);
    //  }
    //);
  }

}
