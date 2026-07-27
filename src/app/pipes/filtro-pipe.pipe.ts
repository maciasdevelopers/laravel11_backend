import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroBusqueda',
  standalone: false
})
export class FiltroPipePipe implements PipeTransform {

  transform(items:any[] , filterText:string): any[] {
    if (!items) return [];
    if (!filterText) return items;

    return items.filter(item => this.busqueda_interior(item, filterText));
  }

  private busqueda_interior(objeto:any, filtro:string):Boolean{
    if (objeto == null) return false;
    if (typeof objeto !== 'object') {
      return objeto.toString().includes(filtro);
    } 
    // Si es un array, revisamos cada elemento
    if (Array.isArray(objeto)) {
      return objeto.some(in_side => this.busqueda_interior(in_side,filtro));
    }
    // Si es objeto, revisamos cada propiedad recursivamente
    return Object.values(objeto).some(value => this.busqueda_interior(value,filtro));
  }

}

