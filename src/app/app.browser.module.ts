import { inject, NgModule, PLATFORM_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppModule } from './app-module';
import { App } from './app';

import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { isPlatformBrowser } from '@angular/common';

export function HttpLoaderFactory(http: HttpClient) {
  const platformId = inject(PLATFORM_ID);
  return new TranslateHttpLoader();
}

@NgModule({
  imports: [
    AppModule,
    BrowserModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  bootstrap: [App],
})
export class AppBrowserModule {}
