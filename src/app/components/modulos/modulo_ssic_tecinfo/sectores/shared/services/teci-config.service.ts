import { Injectable } from '@angular/core';
import { global } from '../../../../../../servicios/global_ssic';

@Injectable({
  providedIn: 'root'
})
export class TeciConfigService {
  private apiUrl = `${global.urlApi}tecinfo`;

  getApiUrl(): string {
    return this.apiUrl;
  }

  getUsuarioToken(): string | null {
    return sessionStorage.getItem('inside_session_code');
  }

  buildUrl(endpoint: string): string {
    return `${this.apiUrl}/${endpoint}`;
  }

  getHeaders() {
    return {
      'Content-Type': 'application/x-www-form-urlencoded'
    };
  }

  buildPostBody(data: any): string {
    const body = {
      user_token: this.getUsuarioToken(),
      ...data
    };
    return 'json=' + JSON.stringify(body);
  }
}