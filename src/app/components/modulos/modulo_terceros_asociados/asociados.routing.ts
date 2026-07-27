// importacion necesaria
import {ModuleWithProviders, NgModule} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';
import { global } from "../../../servicios/global_ssic";
import { AssocGuardService } from "../../../servicios/terceros/associates/auth-assoc.service";
import { AssocDisGuardService } from "../../../servicios/terceros/associates/disauth_assoc.service";
// importacion de componentes
//import { AsociadosTercerosComponent } from "./main_asociados/asociados_terceros.component";
import { AltaVentasMostradorComponent } from "./altaventamostrador/altaventamostrador.component";
import { CatalogoVentasMostradorComponent } from "./catalogoventamostrador/catalogoventamostrador.component";

//console.log(sessionStorage.length);//sessionStorage.length
console.log(localStorage.length);
const assocRutas: Routes = [
  //portal_para_terceros_asociados
  {path:'',redirectTo:'home',pathMatch:'full',resolve:[AssocGuardService]},
  //{path:'home',component: AsociadosTercerosComponent,canActivate:[AssocGuardService]},
  //{path:'home/:emp_token',component: AsociadosTercerosComponent,canActivate:[AssocGuardService]},
  {path:'ventas_catalogo',component: CatalogoVentasMostradorComponent,canActivate:[AssocGuardService]},
  {path:'ventas_registro',component: AltaVentasMostradorComponent,canActivate:[AssocGuardService]},
  //{path:'productos_catalogo',component: AltaVentasMostradorComponent,canActivate:[AssocGuardService]},

];

NgModule({
  imports:[RouterModule.forRoot(assocRutas,{useHash:true}),],
  exports:[RouterModule],
  providers: [
    AssocGuardService,
    AssocDisGuardService,
  ]
})

//exportar rutas
export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<any> = RouterModule.forChild(assocRutas);
