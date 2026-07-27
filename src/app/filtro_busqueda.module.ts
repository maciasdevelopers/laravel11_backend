import { NgModule, isDevMode } from '@angular/core';
import { FiltroPipePipe } from './pipes/filtro-pipe.pipe';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    FiltroPipePipe,
  ],
  imports: [
    CommonModule
  ],
  exports:[
    FiltroPipePipe
  ]
})
export class FiltroBusquedaModule { }
