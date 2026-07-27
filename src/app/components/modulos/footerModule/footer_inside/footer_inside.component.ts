import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { VisitasService } from '../../../../servicios/ssic/visitas.service';

@Component({
  selector: 'app-footer-inside',
  templateUrl: './footer_inside.component.html',
  standalone:false,
  styleUrls: ['./footer_inside.component.css']
})
export class FooterComponent implements OnInit {
  public visitasTotal:number = 0;
  constructor(public vis_serv:VisitasService,private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.vis_serv.totalVisitas().subscribe(
      response => {
        if (response.status == 'success') {
          this.visitasTotal = response.total_visitas;
          this.cd.detectChanges();
          //console.log(response.total_visitas+" "+this.visitasTotal);
        }
      }, error => {console.log(error);}
    );
  }

}
