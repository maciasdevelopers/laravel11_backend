import { Component, OnInit } from '@angular/core';
import { global } from '../../servicios/global_ssic';
import { Router } from '@angular/router';

@Component({
  selector: 'app-permission-denied',
  templateUrl: './permission_denied.component.html',
  standalone:false,
  styleUrls: ['./permission_denied.component.css']
})
export class PermissionDeniedComponent implements OnInit {
  public page_error: string;
  public url_denegado_name:string = "";
  public url_denegado_link:string = "";
  public home_link:string = "";
  constructor(private routerr:Router) {
    this.page_error ='Página no encontrada'; 
   }

  ngOnInit(): void {

    if (global.url_denegado_name != "" && global.url_denegado_link != "") {
      this.url_denegado_name = global.url_denegado_name;
      this.url_denegado_link = global.url_denegado_link;
      this.home_link = global.home_link;
    }
    console.log("url_denegado_name "+global.url_denegado_name+" url_denegado_link "+global.url_denegado_link);
  }

  reintentoIngreso(){
    console.log(this.url_denegado_link);
    this.routerr.navigate(['./'+this.url_denegado_link]);
  }

}
