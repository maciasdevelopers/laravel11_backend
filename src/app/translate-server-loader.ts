// src/app/translate-server-loader.ts

import { join } from 'path';
import { Observable, of } from 'rxjs';
import { TranslateLoader } from '@ngx-translate/core';
import * as fs from 'fs';

export class TranslateServerLoader implements TranslateLoader {
  constructor(
    private prefix: string = 'i18n',
    private suffix: string = '.json',
  ) {}

  public getTranslation(lang: string): Observable<any> {
    const assetsFolder = join(
      process.cwd(),
      'dist', // Ojo: la carpeta de compilación, puede ser 'dist/tu-proyecto'
      'browser', // Carpeta de la app del navegador
      'assets',
      this.prefix
    );

    const jsonData = JSON.parse(
      fs.readFileSync(join(assetsFolder, `${lang}${this.suffix}`), 'utf8')
    );

    return of(jsonData);
  }
}