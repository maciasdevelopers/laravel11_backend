import { Component, EventEmitter, input, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-paginacion',
  standalone: false,
  
  templateUrl: './paginacion.component.html',
  styleUrl: './paginacion.component.css'
})
export class PaginacionComponent implements OnInit{
  @Input() totalItems: any;
  @Input() currentPage: any;
  @Input() itemsForPage: any;
  totalPaginas = 0;
  paginas:number[] = [];
  @Output() onClick: EventEmitter<number> = new EventEmitter();

  constructor(){

  }

  ngOnInit(): void {
    if (this.totalItems) {
      this.totalPaginas = Math.ceil(this.totalItems/this.itemsForPage);
      this.paginas = Array.from({length: this.totalPaginas},(_,i) => i+1);
    }
  }

  paginaSelected(pagina:number){
    this.onClick.emit(pagina);
  }
}
