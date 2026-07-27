import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textTruncate',
  standalone: false
})
export class TextTruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 50): string {
    if (!value) return '';
    
    // Si el texto es más corto que el límite, se deja intacto
    if (value.length <= limit) {
      return value;
    }
    
    // Si es más largo, se recorta y se le concatenan los puntos suspensivos
    return value.substring(0, limit) + '...';
  }
}
