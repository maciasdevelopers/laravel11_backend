import { Injectable } from '@angular/core';
declare var epson: any;
@Injectable({
  providedIn: 'root'
})
export class ImpresionServService {
  private impresora_epson: any;
  constructor() { }

//impresora_epson
  epson_Conectar(ip_direccion:string): Promise<void>{
    return new Promise((resolve,reject) => {
      this.impresora_epson = new epson.epSoftware2_27_0();
      this.impresora_epson.connect(ip_direccion,8008,(status:any) => {
        if (status === 'OK') {
          this.impresora_epson.createDevice(
            'impresion local',
            epson.epSoftware2_27_0.DEVICE_TYPE_PRINTER,
            {crypto: false,buffer: false},
            (device:any, errorCode:any) => {
              if (device) {
                this.impresora_epson = device;
                resolve();
              } else {
                console.log(`Error connecting to printer: ${errorCode}`);
                reject(`Error connecting to printer: ${errorCode}`)
              }
            }
          );
        }
      });
    });
  }

  epson_imprimeTicket(data:any): void{
    if (this.impresora_epson) {
      this.impresora_epson.addText(data);
      this.impresora_epson.addFeedLine(1);
      this.impresora_epson.send();
    }
  }
}
