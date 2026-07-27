// src/app/pipes/numeral-format.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import numeral from 'numeral';

@Pipe({
  name: 'numeralFormat'
})
export class NumeralFormatPipe implements PipeTransform {
  /**
   * Transforma un valor numérico aplicando el formato de Numeral.js
   * @param value El número a formatear
   * @param formatString La cadena de formato (ej. '0,0.00', '$0,0', '0a', etc.)
   */
  transform(value: number | string, formatString: string = '0,0'): string {
    if (value == null || value === '') {
      return '';
    }
    // Asegurarse de que numeral reciba un número o cadena válida
    return numeral(value).format(formatString);
  }
}
