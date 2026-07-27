import { Component, OnInit } from '@angular/core';
import { LoaderServService } from '../../../../servicios/ssic/loader-serv.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  standalone:false,
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {
  public cargando:any = false;
  constructor(private readonly loader:LoaderServService) {
    this.cargando = this.loader.isLoading$;
   }
  ngOnInit(): void {
  }
}
