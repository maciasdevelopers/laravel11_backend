import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServLandCSSService {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  cargaArchCss(archivos:string[]){
		for (let cssArch of archivos) {
			let lkin = document.createElement("link");
			lkin.rel="stylesheet"; 
			lkin.href = "./assets/css/"+cssArch+".css";
			let head = document.getElementById("headIndex");
			head?.appendChild(lkin);
		}
	}

}
