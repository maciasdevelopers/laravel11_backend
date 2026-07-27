export interface ExcelColumnas {
  label: string;         // Texto que aparece en el Excel
  field?: string;        // Nombre del campo en el objeto de datos
  colspan?: number;      // Si agrupa varias columnas (como THIRD PARTY)
  rowspan?: number;      // Si abarca varias filas
  children?: ExcelColumnas[]; // Hijos en caso de colspan
  align?: 'left' | 'right' | 'center'; // Opcional, alineación
  translate?: true | false; // Opcional, alineación
}