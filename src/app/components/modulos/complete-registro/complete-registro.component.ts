import { Component,OnInit,ViewChild,ElementRef,Renderer2} from '@angular/core';
import { EmpresasServService } from '../../../servicios/ssic/empresas-serv.service'; 
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-complete-registro',
  templateUrl: './complete-registro.component.html',
  standalone:false,
  styleUrls: ['./complete-registro.component.css']
})
export class CompleteRegistroComponent implements OnInit {
  arrayEmpresa:any = [];
  constructor(
    private renderer:Renderer2,
    public empService:EmpresasServService,
    private translate:TranslateService
  ) {
  }

  ngOnInit(): void {
    this.empService.listaEmpresasCompleteRegistro().subscribe(
      response => {
        if (response.status == 'success') {
          this.arrayEmpresa = response.arrayEmpVig;
          console.log(response.arrayEmpVig);
        }
      }, error => {console.log(error);}
    );
  }

}
