import { Injectable } from '@angular/core';
import { global } from './global_ssic';
import { TranslateService } from '@ngx-translate/core';
import DataTable from 'datatables.net-dt';
import { Config } from 'datatables.net';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataTableService {
  dtTrigger: Subject<any> = new Subject<any>();

  dtOptions: Config = {};
  constructor(private translate:TranslateService) {
    this.dtOptions = {
      pagingType: 'full_numbers'
    };
    var translate_buscar = this.translate.instant("bus_car");
    $(document).ready(function(){
      //correctlbl.innerText = mensaje;
      //$('.dt-start').addClass("col-12 m4 l3 xl3");
      $('.dt-start .dt-length').css({'display':'flex','flex-wrap':'wrap-reverse','flex-direction':'row-reverse','justify-content':'space-between','padding-right':'10px','width':'50%'});
      $('.dt-start .dt-length select').addClass("browser-default");
      $('.dt-start .dt-length select').css({'display':'block','font-family':'ubuntu','background-color':'#e7e7ea','height':'30px','border-radius':'8px','color':'#303030','text-align':'center','margin':'0','margin-top':'3px','width':'100%'});
      $('.dt-layout-cell label').css({'font-family':'ubuntu','height':'20px','line-height':'20px','color':'white!important','margin-left':'5px','font-size':'13px','font-weight':'bold','border-radius':'5px','background-color':'#2962ff','padding-left':'5px','padding-right':'5px',});
      //$('.dt-start label').text("hola");
      $('.dt-end label').text(translate_buscar);
      $('.dt-layout-cell input[type="search"]').css({'padding':'0','font-family':'ubuntu','background-color':'#e7e7ea','height':'30px','border-radius':'8px','color':'#303030','text-align':'center','margin':'0','width':'100%',});
      $('.dt-info').css({'color':'#353535','padding':'0','font-weight':'bold','font-size':'small'});
      //$('.dt-paging button.current').css({'background-color':'#020a5e','height':'25px','line-height':'25px','width':'25px','padding':'0','font-weight':'bold','border-radius':'5px','color':'white'});
      $(".dt-paging button.current").css("cssText", "background-color:#020a5e;height:25px;line-height:25px;width:25px;padding:0;font-weight:bold;border-radius:5px;color:white!important;");
    });

   }

  destruyeDatatable(tabla:any){
    $(document).ready(function(){
      new DataTable(tabla).destroy();
    });
  }

  loadDatatable(tabla:any){
    $(document).ready(function(){
      new DataTable(tabla,{destroy: true,scrollX: true});
      new DataTable(tabla).destroy();
      new DataTable(tabla,{destroy: true,scrollX: true});
    });
  }

  cargaDatatable(tabla:any){
    var translate_buscar = this.translate.instant("bus_car");
    $(document).ready(function(e:any){
      console.log(DataTable.isDataTable(tabla));
      if (DataTable.isDataTable(tabla) == false) {
        new DataTable(tabla).destroy();
        //new DataTable(tabla,{paging: false,destroy: true,scrollX: true});
        new DataTable(tabla,{destroy: true,scrollX: true});
        new DataTable(tabla).settings();
      } else {
        new DataTable(tabla).destroy();
        //new DataTable(tabla).clear().draw();
        new DataTable(tabla,{destroy: true,scrollX: true});
      }

      //correctlbl.innerText = mensaje;
      //$('.dt-start').addClass("col-12 m4 l3 xl3");
      $('.dt-start .dt-length').css({'display':'flex','flex-wrap':'wrap-reverse','flex-direction':'row-reverse','justify-content':'space-between','padding-right':'10px','width':'50%'});
      $('.dt-start .dt-length select').addClass("browser-default");

      //const selectdor:any = document.querySelector(".dt-start .dt-length select");
      //selectdor.innerHTML = "(click)='func_prueba();'";

      $('.dt-start .dt-length select').css({'display':'block','font-family':'ubuntu','background-color':'#e7e7ea','height':'30px','border-radius':'8px','color':'#303030','text-align':'center','margin':'0','margin-top':'3px','width':'100%'});
      $('.dt-layout-row .dt-start label,.dt-layout-row .dt-end label').css({
        'font-family':'ubuntu',
        'height':'20px',
        'line-height':'20px',
        'color':'white!important',
        'margin-left':'5px',
        'font-size':'13px',
        'font-weight':'bold',
        'border-radius':'5px',
        'background-color':'#2962ff',
        'padding-left':'5px',
        'padding-right':'5px',
      });
      //$('.dt-start label').text("hola");
      $('.dt-end label').text(translate_buscar);
      $('.dt-layout-cell input[type="search"]').css({'padding':'0','font-family':'ubuntu','background-color':'#e7e7ea','height':'30px','border-radius':'8px','color':'#303030','text-align':'center','margin':'0','width':'100%',});
      $('.dt-info').css({'color':'#353535','padding':'0','font-weight':'bold','font-size':'small'});
      //$('.dt-paging button.current').css({'background-color':'#020a5e','height':'25px','line-height':'25px','width':'25px','padding':'0','font-weight':'bold','border-radius':'5px','color':'white'});
      $(".dt-paging button.current").css("cssText", "background-color:#020a5e;height:25px;line-height:25px;width:25px;padding:0;font-weight:bold;border-radius:5px;color:white!important;");
    });
  }

  cargaDatatableScroll(tabla:any){
    var translate_buscar = this.translate.instant("bus_car");
    $(document).ready(function(e:any){
      console.log(DataTable.isDataTable(tabla));
      if (DataTable.isDataTable(tabla) == false) {
        new DataTable(tabla).destroy();
        //new DataTable(tabla,{paging: false,destroy: true,scrollX: true});
        new DataTable(tabla,{destroy: true,scrollCollapse: true,scrollY: '200px'});
        new DataTable(tabla).settings();
      } else {
        new DataTable(tabla).destroy();
        //new DataTable(tabla).clear().draw();
        new DataTable(tabla,{destroy: true,scrollCollapse: true,scrollY: '200px'});
      }

      //correctlbl.innerText = mensaje;
      //$('.dt-start').addClass("col-12 m4 l3 xl3");
      $('.dt-start .dt-length').css({'display':'flex','flex-wrap':'wrap-reverse','flex-direction':'row-reverse','justify-content':'space-between','padding-right':'10px','width':'50%'});
      $('.dt-start .dt-length select').addClass("browser-default");

      //const selectdor:any = document.querySelector(".dt-start .dt-length select");
      //selectdor.innerHTML = "(click)='func_prueba();'";

      $('.dt-start .dt-length select').css({'display':'block','font-family':'ubuntu','background-color':'#e7e7ea','height':'30px','border-radius':'8px','color':'#303030','text-align':'center','margin':'0','margin-top':'3px','width':'100%'});
      $('.dt-layout-row .dt-start label,.dt-layout-row .dt-end label').css({
        'font-family':'ubuntu',
        'height':'20px',
        'line-height':'20px',
        'color':'white',
        'margin-left':'5px',
        'font-size':'13px',
        'font-weight':'bold',
        'border-radius':'5px',
        'background-color':'#2962ff',
        'padding-left':'5px',
        'padding-right':'5px',
      });
      //$('.dt-start label').text("hola");
      $('.dt-end label').text(translate_buscar);
      $('.dt-layout-cell input[type="search"]').css({'padding':'0','font-family':'ubuntu','background-color':'#e7e7ea','height':'30px','border-radius':'8px','color':'#303030','text-align':'center','margin':'0','width':'100%','max-width':'max-content',});
      $('.dt-info').css({'color':'#353535','padding':'0','font-weight':'bold','font-size':'small'});
      //$('.dt-paging button.current').css({'background-color':'#020a5e','height':'25px','line-height':'25px','width':'25px','padding':'0','font-weight':'bold','border-radius':'5px','color':'white'});
      $(".dt-paging button.current").css("cssText", "background-color:#020a5e;height:25px;line-height:25px;width:25px;padding:0;font-weight:bold;border-radius:5px;color:white!important;");
    });
  }

  cargaDatatable_5(tabla:any){
    var translate_buscar = this.translate.instant("bus_car");
    $(document).ready(function(e:any){
      console.log(DataTable.isDataTable(tabla));
      if (DataTable.isDataTable(tabla) == false) {
        new DataTable(tabla).destroy();
        //new DataTable(tabla,{paging: false,destroy: true,scrollX: true});
        new DataTable(tabla,{destroy: true,scrollX: true});
        new DataTable(tabla).settings();
      } else {
        new DataTable(tabla).destroy();
        //new DataTable(tabla).clear().draw();
        new DataTable(tabla,{destroy: true,scrollX: true});
      }

      //correctlbl.innerText = mensaje;
      //$('.dt-start').addClass("col-12 m4 l3 xl3");
      $('.dt-start .dt-length').css({'display':'flex','flex-wrap':'wrap-reverse','flex-direction':'row-reverse','justify-content':'space-between','padding-right':'10px','width':'50%'});
      $('.dt-start .dt-length select').addClass("browser-default");

      //const selectdor:any = document.querySelector(".dt-start .dt-length select");
      //selectdor.innerHTML = "(click)='func_prueba();'";

      $('.dt-start .dt-length select').css({'display':'block','font-family':'ubuntu','background-color':'#e7e7ea','height':'30px','border-radius':'8px','color':'#303030','text-align':'center','margin':'0','margin-top':'3px','width':'100%'});
      $('.dt-layout-row .dt-start label,.dt-layout-row .dt-end label').css({
        'font-family':'ubuntu',
        'height':'20px',
        'line-height':'20px',
        'color':'white',
        'margin-left':'5px',
        'font-size':'13px',
        'font-weight':'bold',
        'border-radius':'5px',
        'background-color':'#2962ff',
        'padding-left':'5px',
        'padding-right':'5px',
      });
      //$('.dt-start label').text("hola");
      $('.dt-end label').text(translate_buscar);
      $('.dt-layout-cell input[type="search"]').css({'padding':'0','font-family':'ubuntu','background-color':'#e7e7ea','height':'30px','border-radius':'8px','color':'#303030','text-align':'center','margin':'0','width':'100%',});
      $('.dt-info').css({'color':'#353535','padding':'0','font-weight':'bold','font-size':'small'});
      //$('.dt-paging button.current').css({'background-color':'#020a5e','height':'25px','line-height':'25px','width':'25px','padding':'0','font-weight':'bold','border-radius':'5px','color':'white'});
      $(".dt-paging button.current").css("cssText", "background-color:#020a5e;height:25px;line-height:25px;width:25px;padding:0;font-weight:bold;border-radius:5px;color:white!important;");
    });
  }
}
