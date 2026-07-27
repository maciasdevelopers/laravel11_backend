import { Injectable } from '@angular/core';
import { Workbook } from "exceljs";
import * as ExcelJS from 'exceljs';
import * as fs from "file-saver";
import { ExcelColumnas } from '../interfaces/ExcelColumnas';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class DescargaExcel {
  constructor(private translate:TranslateService,){}

  async descarga_xlsx_documento(data:any[],columnas:ExcelColumnas[],hoja:any,nombre_documento:any){ 
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet(hoja);
    // =====================
    // 1) Generar encabezados dinámicos
    // =====================
    let currentRow = 1;
    const buildHeaders = (cols:ExcelColumnas[],row:number,colStart:number):number => {
      let colIndex = colStart;
      cols.forEach((col) => {
        const colspan = col.colspan || 1;
        const rowspan = col.rowspan || 1;
        
        //celda principal
        const celda = worksheet.getCell(row,colIndex);
        celda.value = col.label;
        celda.font = { bold: true };
        celda.alignment = { horizontal: 'center', vertical: 'middle' };

        //merge si aplica
        if (colspan > 1 || rowspan > 1) {
          worksheet.mergeCells(row, colIndex, row + rowspan - 1, colIndex + colspan - 1);
        }

        //Si tiene hijos, los dibujamos en la siguiente fila
        if (col.children) {
          buildHeaders(col.children,row + 1, colIndex);
        }

        colIndex += colspan;
      });
      return colIndex;
    };
    buildHeaders(columnas,currentRow,1);
    // =====================
    // 2) Generar filas de datos
    // =====================
    const columnasPlanas = (cols:ExcelColumnas[]): ExcelColumnas[] => {
      return cols.flatMap((col:any) => col.children ? columnasPlanas(col.children) : col);
    };
    const leafColumnas = columnasPlanas(columnas);
    data.forEach((item) => {
      const rowData = worksheet.addRow(
        leafColumnas.map((col:any) => {
          const value = item[col.field || ""];
          if (col.translate) {
            return this.translate.instant(value);
          }
          return value;
        })
      );

      // aplicar alineación por columna
      rowData.eachCell((cell:any, colNumber:number) => {
        const config = leafColumnas[colNumber - 1]; // la columna actual
        cell.alignment = { 
          horizontal: config.align || 'left', 
          vertical: 'middle', 
          wrapText: true 
        };
      });
    });
    // =====================
    // 3) Ajustar anchos
    // =====================
    worksheet.columns.forEach((col:any) => {
      let maxLength = 10;
      col.eachCell({includeEmpty:true},(cell:any) => {
        const len = cell.value ? cell.value.toString().length : 0;
        maxLength = Math.max(maxLength, len + 5);
      });
      col.width = maxLength;
    });
    // =====================
    // 4) Descargar archivo
    // =====================
    const buffer = await workbook.xlsx.writeBuffer();
    fs.saveAs(new Blob([buffer]), nombre_documento);
  }

  async descarga_xlsx_documento_estado_cuenta(
    documento_destino:string,
    documento_estado_cuenta:string,
    banco_asociado:string,
    //Resumen de Saldo
    saldo_inicial:string,
    movimientos_deposito:string,
    movimientos_retiro:string,
    saldo_final:string,
    //movimientos
    movimientos:any[],
    //Totales
    mov_total_deposito:string,
    mov_total_retiro:string,
    mov_total_saldo_final:string,
    columnas:ExcelColumnas[],
    hoja:any,
    nombre_documento:any
  ){ 
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet(hoja);

    worksheet.mergeCells('A1:C1');
    worksheet.getCell('A1').value = 'ESTADO DE CUENTA';
    worksheet.getCell('A1').font = { bold: true, size: 14 };

    if (banco_asociado != '') {
      worksheet.mergeCells('A2:C2');
      worksheet.getCell('A2').value = banco_asociado;
      worksheet.getCell('A2').font = { bold: true };
  
      worksheet.mergeCells('A4:C4');
      worksheet.getCell('A4').value = documento_destino;
      worksheet.getCell('A4').font = { bold: true, color: { argb: 'FF555555' } };
      worksheet.mergeCells('A5:C5');
      worksheet.getCell('A5').value = documento_estado_cuenta; // El número de cuenta 
    } else {
      worksheet.mergeCells('A2:C2');
      worksheet.getCell('A2').value = documento_destino;
      worksheet.getCell('A2').font = { bold: true, color: { argb: 'FF555555' } };
      worksheet.mergeCells('A3:C3');
      worksheet.getCell('A3').value = documento_estado_cuenta; // El número de cuenta 
    }

    worksheet.mergeCells('F1:G1');
    worksheet.getCell('F1').value = 'Resumen de Saldo';
    worksheet.getCell('F1').font = { bold: true, size: 14 };

    worksheet.getCell('F2').value = 'Saldo inicial';
    worksheet.getCell('F2').font = { bold: true, color: { argb: 'FF555555' } };
    const cell_saldo_inicial = worksheet.getCell('G2');
    cell_saldo_inicial.value = saldo_inicial;
    cell_saldo_inicial.font = { bold: true };
    cell_saldo_inicial.alignment = { horizontal: 'right' };

    worksheet.getCell('F3').value = 'Depósitos y adiciones';
    worksheet.getCell('F3').font = { bold: true, color: { argb: 'FF555555' } };
    const cell_movimientos_deposito = worksheet.getCell('G3');
    cell_movimientos_deposito.value = movimientos_deposito;
    cell_movimientos_deposito.font = { bold: true };
    cell_movimientos_deposito.alignment = { horizontal: 'right' };

    worksheet.getCell('F4').value = 'Retiros y deducciones';
    worksheet.getCell('F4').font = { bold: true, color: { argb: 'FF555555' } };
    const cell_movimientos_retiro = worksheet.getCell('G4');
    cell_movimientos_retiro.value = movimientos_retiro;
    cell_movimientos_retiro.font = { bold: true };
    cell_movimientos_retiro.alignment = { horizontal: 'right' };

    worksheet.getCell('F5').value = 'Saldo final';
    worksheet.getCell('F5').font = { bold: true, color: { argb: 'FF555555' } };
    const cell_saldo_final = worksheet.getCell('G5');
    cell_saldo_final.value = saldo_final;
    cell_saldo_final.font = { bold: true };
    cell_saldo_final.alignment = { horizontal: 'right' };

    worksheet.mergeCells('A7:G7');
    const cell_list_mov = worksheet.getCell('A7');
    cell_list_mov.value = 'Registro de movimientos';
    cell_list_mov.font = { bold: true, color: { argb: 'FF555555' } };
    cell_list_mov.alignment = { horizontal: 'center' };

    // =====================
    // 1) Generar encabezados dinámicos
    // =====================
    let currentRow = 1;
    const buildHeaders = (cols:ExcelColumnas[],row:number,colStart:number):number => {
      let colRow = 8;
      let colIndex = colStart;
      cols.forEach((col) => {
        const colspan = col.colspan || 1;
        const rowspan = col.rowspan || 1;
        
        //celda principal
        const celda = worksheet.getCell(colRow,colIndex);
        celda.value = col.label;
        celda.font = { bold: true };
        celda.alignment = { horizontal: 'center', vertical: 'middle' };

        //merge si aplica
        if (colspan > 1 || rowspan > 1) {
          worksheet.mergeCells(colRow, colIndex, colRow + rowspan - 1, colIndex + colspan - 1);
        }

        //Si tiene hijos, los dibujamos en la siguiente fila
        if (col.children) {
          buildHeaders(col.children,colRow + 1, colIndex);
        }

        colIndex += colspan;
      });
      return colIndex;
    };
    buildHeaders(columnas,currentRow,1);

    // =====================
    // 2) Generar filas de datos
    // =====================
    const columnasPlanas = (cols:ExcelColumnas[]): ExcelColumnas[] => {
      return cols.flatMap((col:any) => col.children ? columnasPlanas(col.children) : col);
    };
    const leafColumnas = columnasPlanas(columnas);
    movimientos.forEach((item) => {
      const rowData = worksheet.addRow(
        leafColumnas.map((col:any) => {
          const value = item[col.field || ""];
          if (col.translate) {
            return this.translate.instant(value);
          }
          return value;
        })
      );

      // aplicar alineación por columna
      rowData.eachCell((cell:any, colNumber:number) => {
        const config = leafColumnas[colNumber - 1]; // la columna actual
        cell.alignment = { 
          horizontal: config.align || 'left', 
          vertical: 'middle', 
          wrapText: true 
        };
      });
    });
    
    const ultimaFilaDatos = worksheet.lastRow ? worksheet.lastRow.number : 8;
    const filaTotales = ultimaFilaDatos + 1;
    
    const celdaTotales = worksheet.getCell(`D${filaTotales}`);
    celdaTotales.value = 'Total:';
    celdaTotales.font = { bold: true };
    celdaTotales.alignment = { horizontal: 'right' };

    const celdaTotalDeposito = worksheet.getCell(`E${filaTotales}`);
    celdaTotalDeposito.value = mov_total_deposito;
    celdaTotalDeposito.font = { bold: true };
    celdaTotalDeposito.alignment = { horizontal: 'right' };

    const celdaTotalRetiro = worksheet.getCell(`F${filaTotales}`);
    celdaTotalRetiro.value = mov_total_retiro;
    celdaTotalRetiro.font = { bold: true };
    celdaTotalRetiro.alignment = { horizontal: 'right' };

    const celdaTotalSaldoFinal = worksheet.getCell(`G${filaTotales}`);
    celdaTotalSaldoFinal.value = mov_total_saldo_final;
    celdaTotalSaldoFinal.font = { bold: true };
    celdaTotalSaldoFinal.alignment = { horizontal: 'right' };

    // =====================
    // 3) Ajustar anchos
    // =====================
    worksheet.columns.forEach((col:any) => {
      let maxLength = 10;
      col.eachCell({includeEmpty:true},(cell:any) => {
        const len = cell.value ? cell.value.toString().length : 0;
        maxLength = Math.max(maxLength, len + 5);
      });
      col.width = maxLength;
    });

    // =====================
    // 4) Descargar archivo
    // =====================
    const buffer = await workbook.xlsx.writeBuffer();
    fs.saveAs(new Blob([buffer]), nombre_documento);
  }

  descarga_xlsx_documento_old(tabla_id:any,hoja:any,nombre_documento:any){ 
    setTimeout(async () => {
      const tabla = document.getElementById(tabla_id);
      const tablaClon = tabla?.cloneNode(true) as HTMLElement;

      if (!tablaClon) return;

      // remover botones, iconos y columnas no deseadas
      tablaClon.querySelectorAll(
        'button, a, i, svg, .pi, .p-button, th.ultimo, td.ultimo, td.img_dat').forEach((el: any) => el.remove());

      // limpiar innerHTML de celdas
      tablaClon.querySelectorAll('td, th').forEach((celda: any) => {
        celda.innerHTML = celda.innerText.trim();
      });

      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet(hoja);

      const filas = tablaClon.querySelectorAll('tr');
      const columnWidths: number[] = [];

      filas.forEach((fila, filaIndex) => {
        let colIndex = 1;
        const celdas = fila.querySelectorAll('th, td');

        celdas.forEach((celda: any) => {
          const texto = celda.innerText.trim();
          const colspan = parseInt(celda.getAttribute('colspan') || '1', 10);
          const rowspan = parseInt(celda.getAttribute('rowspan') || '1', 10);

          const cell = worksheet.getCell(filaIndex + 1, colIndex);
          cell.value = texto;

          // alinear números a la derecha
          if (celda.classList.contains('td_importes')) {
            cell.alignment = { horizontal: 'right' };
          }

          // aplicar merge si hay colspan/rowspan
          if (colspan > 1 || rowspan > 1) {
            worksheet.mergeCells(
              filaIndex + 1,
              colIndex,
              filaIndex + rowspan,
              colIndex + colspan - 1
            );
          }

          // calcular ancho de columna
          const textLength = texto.length;
          for (let i = 0; i < colspan; i++) {
            const currentCol = colIndex + i - 1;
            columnWidths[currentCol] = Math.max(columnWidths[currentCol] || 10, textLength + 5);
          }

          colIndex += colspan;
        });
      });

      // aplicar ancho automático
      worksheet.columns = columnWidths.map((w) => ({ width: w }));

      // primera fila en negritas
      worksheet.getRow(1).font = { bold: true };

      const buffer = await workbook.xlsx.writeBuffer();
      fs.saveAs(new Blob([buffer]), nombre_documento);
    });
  }

  async descargar_plantilla_nomina(){
    const work_book = new ExcelJS.Workbook();
    const work_sheet = work_book.addWorksheet('PlantillaNomina');
    const encabezados = [
      "CLAVE",	
      "REGISTRO PATRONAL DEL IMSS",
      "NOMBRE DEL TRABAJADOR",
      "PERIODICIDAD",
      "PERIODO DE PAGO (INICIO)",
      "PERIODO DE PAGO (FIN)",
      "MONEDA",
      "NSS",
      "RFC",
      "CURP",

      "FECHA DE ALTA",
      "DEPARTAMENTO",
      "PUESTO",
      "TIPO DE SALARIO",
      "SALARIO DIARIO",
      "SDI",
      "DÍAS TRABAJADOS",
      "FALTAS",
      "SUELDO",
      "HORAS EXTRAS DOBLES",
      "AGUINALDO",
      "HORAS EXTRAS TRIPLES",
      "VACACIONES",
      "PRIMA VACACIONAL",
      "REPARTO DE UTILIDADES",
      "DESPENSA*",
      "PREMIOS DE ASISTENCIA",	
      "PREMIOS DE PUNTUALIDAD",	
      "PRIMA DOMINICAL",
      "BNO EXTRA X COMISION OTRO EDO",	
      "INDEMNIZACION",
      "PRIMA DE ANTIGUEDAD",	
      "ISR AJUSTADO POR SUBSIDIO",	
      "ISR",
      "IMSS",
      "CREDITO FONACOT",
      "CREDITO INFONAVIT",
      "SUBSIDIO PARA EL EMPLEO",
      "SUBS. PARA EL EMPLEO APLICADO",
      "OTRAS PERCEPCIONES",
      "TOTAL PERCEPCIONES",
      "OTRAS DEDUCCIONES",
      "TOTAL DEDUCCIONES",
      "TOTAL EFECTIVO",
      "TOTAL EN ESPECIE",
      
      "NETO PAGADO",
      "SALARIO POR HORA",
      "HORAS POR DIA",
      "JORNADA",
      "U.T. LABORADAS"
    ];

    //agregar encabezados al documento
    work_sheet.addRow(encabezados.map(e => e ?? ""));

    //formato en encabezados
    encabezados.forEach((h,i) => {
      const celda = work_sheet.getCell(1,i + 1);
      celda.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      
      celda.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1F4E78' }  // Azul corporativo
      };

      celda.alignment = {vertical: 'middle', horizontal: 'center'};

      work_sheet.getColumn(i + 1).width = 22;
      
    });

    //bloquear encabezados
    work_sheet.views = [{state:'frozen',ySplit:1}];
    
    //generar documento
    const buffer = await work_book.xlsx.writeBuffer();
    fs.saveAs(new Blob([buffer]), 'plantilla_nomina.xlsx');
    console.log("Columnas con formato:", work_sheet.columns.length);
  }
  
}
