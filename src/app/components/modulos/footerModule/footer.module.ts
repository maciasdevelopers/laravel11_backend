import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { NgxCaptureModule } from 'ngx-capture';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgOptimizedImage } from '@angular/common';
import { FooterComponent } from './footer_inside/footer_inside.component';

@NgModule({
  declarations: [
    FooterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbPaginationModule,
    NgxCaptureModule,
    NgOptimizedImage
  ],
  providers: [
    provideHttpClient(),
  ],
  exports:[
    FormsModule,
    FooterComponent
  ],
})
export class FooterModule { }
