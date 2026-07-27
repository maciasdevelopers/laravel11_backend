import { NgForm,ReactiveFormsModule } from '@angular/forms';
import { Component,OnInit, ElementRef, ViewEncapsulation, Renderer2, ViewChild, Input} from '@angular/core';
import { Usuarios } from '../../../../../modelos/Usuarios';
import { ValidatorServService } from '../../../../../servicios/validator-serv.service';
import { LotesServService } from '../../../../../servicios/ssic/lotes-serv.service';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as Tesseract from 'tesseract.js';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';
//GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.js';
//GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.0.375/pdf.worker.min.js';
//<qrcode [qrdata]="'Tu cadena de datos'" [width]="256" [errorCorrectionLevel]="'M'"></qrcode> imports QRCodeComponent,

@Component({
  selector: 'app-codigos-de-barras',
  standalone: false,
  templateUrl: './codigos-de-barras.component.html',
  styleUrls: [
    '../../../../../styles/listas_ps.css',
    '../../../../../styles/input_group.css',
    '../../../../../styles/file_input.css',
    '../../../../../styles/buttons.css',
    '../../../../../styles/modals.css',
    '../../../../../styles/cabecera.css',
    '../../../../../styles/clientes.css',
    '../../../../../styles/collapsible.css',
    '../../../../../styles/tabs.css',
    '../../../../../styles/cards.css',
    '../../../../../styles/row.css',
    '../../../../../styles/encabezados.css',
    '../../../../../styles/buscador.css',
    '../../../../../styles/radioButtons.css',
    '../../../../../styles/paginador.css',
    '../../../../../styles/loading.css',
    '../../../../../styles/dropdown.css',
    '../../../../../styles/landing.css',
    '../../../../../styles/loading.css',
    '../../../../../styles/colores.css',
    '../../../../../styles/explain.css',
    '../../../../../styles/navegador.css',
    '../../inventarios.css',
    './codigos-de-barras.component.css'
  ],
  encapsulation: ViewEncapsulation.None,

})
export class CodigosDeBarrasComponent implements OnInit {
  @ViewChild('formRegistroLote') formLoteReg!: NgForm;
  public usuario: Usuarios;

  constructor(
    private sanitizer:DomSanitizer,
    private renderer:Renderer2,
    private validator:ValidatorServService,
    private loteServ:LotesServService, 
    private translate:TranslateService) {
    this.usuario = new Usuarios(1,"","","","","","","",1,1,"","","","");
  }

  ngOnInit(): void {}

  leerDocumento(event:any){
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) {
      return;
    }

    Array.from(input.files).forEach((doc:any) => {
      const lector = new FileReader();
      lector.onload = async () => {
        const arrayBuffer = lector.result as ArrayBuffer;
        if (doc.type.startsWith('image/')) {
          const img = new Image();
          img.src = URL.createObjectURL(doc);
          img.onload = () => {
            console.log(`Nombre: ${doc.name}`);
            console.log(`Tamaño: ${doc.size} bytes`);
            console.log(`Dimensiones: ${img.width}x${img.height}`);
          }

          Tesseract.recognize(img).then(({data: {text}}) => {
            console.log('texto extraido: ',text);
          });
        } else if (doc.type === 'application/pdf') {
          const typedArray = new Uint8Array(arrayBuffer)
          const pdf = await getDocument(typedArray).promise;
          let texto = '';
          console.log(pdf.numPages);
          for (let i = 1; i <= pdf.numPages; i++) {
            const pagina = await pdf.getPage(i);
            const text_contenido = await pagina.getTextContent();
            const paginaTexto = await text_contenido.items.map((item:any) => item.str).join(' ');
            texto += paginaTexto + '\n';
          }
          console.log('Texto extraído:', texto);
        }
      };
      lector.readAsArrayBuffer(doc); 
    });
  }

}
