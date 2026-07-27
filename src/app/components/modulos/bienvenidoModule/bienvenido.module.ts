import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BienvenidoComponent } from './bienvenido_component/bienvenido.component';
@NgModule({
  declarations: [BienvenidoComponent],
  imports: [CommonModule],
  exports:[CommonModule, BienvenidoComponent],
})
export class BienvenidoModule { }
