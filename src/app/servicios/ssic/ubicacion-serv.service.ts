import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { global } from '../global_ssic'; 
import { Usuarios } from '../../modelos/Usuarios';

@Injectable({
  providedIn: 'root'
})
export class UbicacionServService {
  arraygeoLoc:any = [];
  public url: string;

  httpOptions:any = {
    Headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  constructor(private _httpClient: HttpClient) {
    this.url = global.urlApi;
  }

  geolocalizar():Observable<any>{
    const d= document,
    n = navigator,
    options = {
      enableHighAccuracy:true,
      timeout:500,
      maximumAge:0,
    }

    const success = (position:any) => {
      this.arraygeoLoc['latude'] = position.coords.latitude;
      this.arraygeoLoc['longude'] = position.coords.longitude;
    }

    const error = (err:any) => {
      console.log("Error "+err.code+":"+err.message);
    }

    n.geolocation.getCurrentPosition(success,error,options);
    return this.arraygeoLoc;
  }
}
