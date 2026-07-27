import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import $ from 'jquery';// import Jquery here 

@Injectable({
  providedIn: 'root'
})
export class ValidatorServService {

  constructor() { }

  /*let media = window.matchMedia("(max-width: 400px)");
  let strFilterPass = /^[A-Za-zƒŠŒŽšœžŸÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ0-9,;.:-_/*+]*$/;
  let filtroRfc = /^[A-Za-z0-9]*$/;
  let filtroUrl = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
  let strFilter = /^[A-Za-zƒŠŒŽšœžŸÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèé êëìíîïðñòóôõöøùúûüýþÿ0-9.,:-]*$/;
  let filtroClave = /^[A-Za-z0-9ƒŠŒŽšœžŸÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ-]*$/;
  let filtroLetras = /^[A-Za-zƒŠŒŽšœžŸÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèé êëìíîïðñòóôõöøùúûüýþÿ.,;:()]*$/;
  let filtroDom = /^[A-Za-z0-9ƒŠŒŽšœžŸÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèé êëìíîïðñòóôõöøùúûüýþÿ.,;:-]*$/;
  var strFilEmp = /^[A-Za-z0-9ƒŠŒŽšœžŸÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèé êëìíîïðñòóôõöøùúûüýþÿ.-]*$/;
  let filtroDomNum = /^[A-Za-z0-9 .,-/]*$/;
  let correoRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  let filtroFecha = /^\d{1,2}\-\d{1,2}\-\d{2,4}$/;
  let filtroCosto  = /^[0-9.,$]*$/;
  let filtroNum = /^[0-9]*$/;
  let filtroPorc= /^[0-9.%]*$/;
  let filtroClasificacion = /^[0-9-]*$/;*/

  filtroCodAccess(valor:any){
    if (/^[A-Za-zƒŠŒŽšœžŸÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ0-9]*$/.test(valor)) {
      return true;
    } else {
      return false;
    }
  }

  filterPasswordMayus(valor:any){
    if (/^[A-Z]*$/.test(valor)) {
      return true;
    } else {
      return false;
    }
  }

  filterPasswordNumber(valor:any){
    return /\d/.test(valor);///^[0-9-]*$/.test(valor)
  }

  filterPasswordSymbol(valor:any){
    return /(?=.*[\!@#$%^&*()\\[\]{}\-_+=|:;"'<>,./?])/.test(valor);
  }

  filterPassword(valor:any){
    if (/(?=(.*[0-9]))(?=.*[\!@#$%^&*()\\[\]{}\-_+=|:;"'<>,./?])(?=.*[a-z])(?=(.*[A-Za-z]))(?=(.*)).{8,}/.test(valor)) {
      return true;
    } else {
      return false;
    }
  }

  filterPasswordVentas(valor:any){
    if (/^[A-Za-z0-90123456789.,;:()/abcdefghijklmnopqrstuvwxyz#%&$¡!ABCDEFGHIJKLMNOPQRSTUVWXYZ]*$/.test(valor)) {
      return true;
    } else {
      return false;
    }
  }

  filtroFecha(valor:any){
    return /^\d{2,4}\-\d{1,2}\-\d{1,2}$/.test(valor) ? true : false;
  }

  filtroFechaMesAño(valor:any){
    return /^\d{2,4}\-\d{1,2}$/.test(valor) ? true : false;
  }

  filtroHora(valor:any){
    return /^(0[1-9]|1\d|2[0-3]):([0-5]\d)$/.test(valor) ? true : false;
  }

  filtroMYFecha(valor:any){
    return /^\d{2,4}\-\d{1,2}$/.test(valor) ? true : false;
  }

  filtroAlfaNumerico(valor:any){
    if (/^[-'"0-9A-Za-zƒŠŒŽšœžŸÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèé êëìíîïðñòóôõöøùúûüýþÿ.,;:()/#%&$¡!¨*]*$/.test(valor) &&
      !(valor.includes('  ') || valor.includes('   ') || valor.includes('    ') || valor.includes('    '))) {
      return true;
    } else {
      return false;
    }
  }

  filtroAlfaSimbolos(valor:any){
    if (/^[-'"0-9A-Za-zƒŠŒŽšœžŸÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèé êëìíîïðñòóôõöøùúûüýþÿ.,;:()/#%&$¡_!¨*]*$/.test(valor) &&
      !(valor.includes('  ') || valor.includes('   ') || valor.includes('    ') || valor.includes('    '))) {
      return true;
    } else {
      return false;
    }
  }

  filtrosymbolos(valor:any){
    if (/^[.,/%&$;:()¡!¨*]*$/.test(valor) &&
      !(valor.includes('  ') || valor.includes('   ') || valor.includes('    ') || valor.includes('    '))) {
      return true;
    } else {
      return false;
    }
  }

  filtroUrl(valor:any){
    if (/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(valor) &&
      !(valor.includes('  ') || valor.includes('   ') || valor.includes('    ') || valor.includes('    '))) {
      return true;
    } else {
      return false;
    }
  }

  filtroCorreo(valor:any){
    if (/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(valor)) {
      return true;
    } else {
      return false;
    }
  }

  filtroDom(valor:any){
    if (/^[A-Za-z0-9ƒŠŒŽšœžŸÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèé êëìíîïðñòóôõöøùúûüýþÿ.,;:-]*$/.test(valor) &&
      !(valor.includes('  ') || valor.includes('   ') || valor.includes('    ') || valor.includes('    '))) {
      return true;
    } else {
      return false;
    }
  }

  filtroDomNum(valor:any){
    if (/^[A-Za-z0-9ƒŠŒŽšœžŸÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèé êëìíîïðñòóôõöøùúûüýþÿ .,-/]*$/.test(valor)) {
      return true;
    } else {
      return false;
    }
  }

  strFilEmp(valor:any){
    if (/^[A-Za-z0-9ƒŠŒŽšœžŸÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèé êëìíîïðñòóôõöøùúûüýþÿ,.-]*$/.test(valor) &&
      !(valor.includes('  ') || valor.includes('   ') || valor.includes('    ') || valor.includes('    '))) {
      return true;
    } else {
      return false;
    }
  }

  strFilter(valor:any){
    if (/^[A-Za-zƒŠŒŽšœžŸÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèé êëìíîïðñòóôõöøùúûüýþÿ0-9.,:-]*$/.test(valor) &&
      !(valor.includes('  ') || valor.includes('   ') || valor.includes('    ') || valor.includes('    '))) {
      return true;
    } else {
      return false;
    }
  }

  filtroNum(valor:any){
    return /^[0-9.,$]*$/.test(valor) ? true : false;
  }

  filtroNumPrime(valor:any){
    return /^[0-9.,$]+$/.test(valor) ? true : false;
  }

  filtroPhone(valor:any){
    const regex = /^\+\d{1,3}(?:\s\d{2,4}){2,4}$/;
    return regex.test(valor) && !(valor.includes('  ') || valor.includes('   ') || valor.includes('    ') || valor.includes('    ')) ? true : false;
  }
  
  filtroNumericoSat(valor:any){
    return /^[0-9]*$/.test(valor) ? true : false;
  }

  filtroNumericoCPostal(valor:any){
    return /^[0-9]*$/.test(valor) && valor.length == 5 ? true : false;
  }

  filtroTipoArchivo(typoElement:any){
    if (typoElement == 'text/xml' || 
        typoElement == 'application/msword' ||
        typoElement == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        typoElement == 'application/vnd.openxmlformats-officedocument.wordprocessingml.template' ||
        typoElement == 'application/vnd.ms-word.document.macroEnabled.12' ||
        typoElement == 'application/vnd.ms-word.template.macroEnabled.12' ||
        typoElement == 'application/vnd.ms-excel' ||
        typoElement == 'application/vnd.ms-excel' ||
        typoElement == 'application/vnd.ms-excel' ||
        typoElement == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        typoElement == 'application/vnd.openxmlformats-officedocument.spreadsheetml.template' ||
        typoElement == 'application/vnd.ms-excel.sheet.macroEnabled.12' ||
        typoElement == 'application/vnd.ms-excel.template.macroEnabled.12' ||
        typoElement == 'application/vnd.ms-excel.addin.macroEnabled.12' ||
        typoElement == 'application/vnd.ms-excel.sheet.binary.macroEnabled.12' ||
        typoElement == 'application/vnd.ms-powerpoint' ||
        typoElement == 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
        typoElement == 'application/vnd.openxmlformats-officedocument.presentationml.template' ||
        typoElement == 'application/vnd.openxmlformats-officedocument.presentationml.slideshow' ||
        typoElement == 'application/vnd.ms-powerpoint.addin.macroEnabled.12' ||
        typoElement == 'application/vnd.ms-powerpoint.presentation.macroEnabled.12' ||
        typoElement == 'application/vnd.ms-powerpoint.template.macroEnabled.12' ||
        typoElement == 'application/vnd.ms-powerpoint.slideshow.macroEnabled.12' ||
        typoElement == 'application/vnd.ms-access' ||
        typoElement == 'application/pdf' || 
        typoElement == 'image/jpeg' || 
        typoElement == 'image/jpg' || 
        typoElement == 'image/png') {
      return true;
    } else {
      return false;
    }
  }

  devuelveTipoArchivo(typoElement:any){
    var typo_documento = "";
    if (typoElement == "application/pdf") {
      typo_documento = "pdf";
    } else if (typoElement != 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || typoElement != 'application/vnd.openxmlformats-officedocument.wordprocessingml.template' ||
        typoElement != 'application/vnd.ms-word.document.macroEnabled.12' || typoElement != 'application/vnd.ms-word.template.macroEnabled.12') {
      typo_documento = "doc";
    } else if (typoElement != 'application/vnd.ms-excel' || typoElement != 'application/vnd.ms-excel' || typoElement != 'application/vnd.ms-excel' ||
      typoElement != 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      typoElement != 'application/vnd.openxmlformats-officedocument.spreadsheetml.template' ||
      typoElement != 'application/vnd.ms-excel.sheet.macroEnabled.12' ||
      typoElement != 'application/vnd.ms-excel.template.macroEnabled.12' ||
      typoElement != 'application/vnd.ms-excel.addin.macroEnabled.12' ||
      typoElement != 'application/vnd.ms-excel.sheet.binary.macroEnabled.12') {
      typo_documento = "xls";
    } else if (typoElement == "text/xml") {
      typo_documento = "xml";
    } else if (typoElement == "image/jpeg") {
      typo_documento = "jpg";
    } else if (typoElement == "image/jpg") {
      typo_documento = "jpg";
    } else if (typoElement == "image/png") {
      typo_documento = "png";
    }
    console.log(typo_documento);
    return typo_documento;
  }

  filtroCosto(valor:any){
    return /^[0-9.,$]*$/.test(valor) ? true : false;
  }

  filtroPorcentaje(valor:any){
    return /^[0-9.%]*$/.test(valor) ? true : false;
  }

  filtroCuoPorc(valor:any){
    return /^[0-9.,$%]*$/.test(valor) ? true : false;
  }

  filtroCuenta(valor:any){
    return /^[0-9-]*$/.test(valor) ? true : false;
  }

  deten(valor: any) {
    valor.preventDefault();
  }

  filtroCURP(valor:any){
    return /^[a-zA-Z0-9]+$/.test(valor) && valor.length == 18 ? true : false;
  }

  filtroRFCGeneral(rfc:any) {
    const regex = /^([A-Za-zÑ&]{3,4})(\d{2})(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([A-Za-z\d]{3})$/;
    const match = rfc.match(regex);

    if (!match) {
        return false; // El RFC no tiene el formato correcto
    }

    const [_, letras, año, mes, dia, homoclave] = match;
    const fecha = new Date(`20${año}-${mes}-${dia}`);

    if (isNaN(fecha.getTime())) {
        return false; // La fecha no es válida
    }
    return true; // El RFC es válido
  }

  filtroRfcPersFisica(valor:any){
    var cdna1 = valor.substring(0,4);
    var cdna2 = valor.substring(4,10);
    var cdna3 = valor.substring(10,13);
    return /^[a-zA-Z]+$/.test(cdna1) && /^[0-9]+$/.test(cdna2) && /^[a-zA-Z0-9]+$/.test(cdna3) && valor.length == 13 ? true : false;
  }

  filtroRfcPersMoral(valor:any){
    var cdna1 = valor.substring(0,3);
    var cdna2 = valor.substring(3,9);
    var cdna3 = valor.substring(9,12);
    return /^[a-zA-Z]+$/.test(cdna1) && /^[0-9]+$/.test(cdna2) && /^[a-zA-Z0-9]+$/.test(cdna3) && valor.length == 12 ? true : false;
  }

  //input
    borraInputRow(valor:any){
      valor.classList.remove("error");
      valor.classList.remove("correcto");
      valor.value = '';
    };

    addlblDisabled(input:any){
      var label = $(input).parent(".input-field").find("label");
      label.addClass("disabled");
    }

    quitalblDisabled(input:any){
      var label = $(input).parent(".input-field").find("label");
      label.removeClass("disabled");
    }

    correctoInput(valor:any,mensaje:any){
      var divParent = valor.parentElement;
      var correctlbl = divParent.querySelector('label');
      correctlbl.className = "activeInput correctoLabel";
      correctlbl.innerText = mensaje;
      valor.classList.remove("error");
      valor.classList.add("correcto");
    };

    limpiaInput(valor:any){
      var divParent = valor.parentElement;
      var correctlbl = divParent.querySelector('label');
      correctlbl.className = "activeInput";
      valor.value = "";
      valor.classList.remove("error");
      valor.classList.remove("correcto");
    };

    correctoInput2(valor:any,mensaje:any){
      var divParent = valor.parentElement;
      var correctlbl = divParent.querySelector('label');
      correctlbl.className = "activeInput correctoLabel";
      correctlbl.innerHTML = mensaje;
    };

    correctoInputMail(valor:any){
        var divParent = valor.parentElement;
        var errorlbl = divParent.querySelector('label');
        errorlbl.className = "activeInput correctoLabel";
    };

    errorInput(valor:any,mensaje:any){
      var divParent = valor.parentElement;
      var errorlbl = divParent.querySelector('label');
      errorlbl.className = "activeInput errorLabel";
      errorlbl.innerText = mensaje;
      valor.classList.remove("correcto");
      valor.classList.add("error");
    };

    errorInput2(valor:any,mensaje:any){
      var divParent = valor.parentElement;
      var errorlbl = divParent.querySelector('label');
      errorlbl.className = "activeInput errorLabel";
      errorlbl.innerHTML = mensaje;
    };

    correctoInputRow(valor:any){
      valor.classList.remove("error");
      valor.classList.add("correcto");
    };
    
    correctoTelefonos(valor:any) {
      valor.classList.remove('telefono_error');
      valor.classList.add('telefono_correcto');
    }

    correctoInputBlackRow(valor:any){
      valor.classList.remove("error_black");
      valor.classList.add("correcto_black");
    };

    errorInputRow(valor:any){
      valor.classList.remove("correcto");
      valor.classList.add("error");
    };
    
    errorTelefonos(valor:any) {
      valor.classList.remove('telefono_correcto');
      valor.classList.add('telefono_error');
    }

    errorInputBlackRow(valor:any){
      valor.classList.remove("correcto_black");
      valor.classList.add("error_black");
    };

    correctoTextarea(valor:any,mensaje:any){
      var divParent = valor.parentElement;
      var correctlbl = divParent.querySelector('label');
      correctlbl.className = "activeInput correctoLabel";
      correctlbl.innerText = mensaje;
      valor.classList.remove("errorTextarea");
      valor.classList.add("correctoTextarea");
    };

    errorTextarea(valor:any,mensaje:any){
      var divParent = valor.parentElement;
      var errorlbl = divParent.querySelector('label');
      errorlbl.className = "activeInput errorLabel";
      errorlbl.innerText = mensaje;
      valor.classList.remove("correctoTextarea");
      valor.classList.add("errorTextarea");
    };

    correctoTextareaRow(valor:any){
      valor.classList.remove("errorTextarea");
      valor.classList.add("correctoTextarea");
    };

    errorTextareaRow(valor:any){
      valor.classList.remove("correctoTextarea");
      valor.classList.add("errorTextarea");
    };

    limpiaInputRow(valor:any){
      valor.value = "";
      valor.classList.remove("correcto");
      valor.classList.remove("error");
    };

    limpiaInputRowClases(valor:any){
      valor.classList.remove("correcto");
      valor.classList.remove("error");
    };

    limpiaInputTelefonos(valor:any) {
      valor.classList.remove('telefono_correcto');
      valor.classList.remove('telefono_error');
    }

    limpiaInputBlackRow(valor:any){
      valor.value = "";
      valor.classList.remove("correcto_black");
      valor.classList.remove("error_black");
    };

    limpiaTextarea(valor:any){
      valor.value = "";
      valor.classList.remove("errorTextarea");
      valor.classList.remove("correctoTextarea");
      valor.classList.remove("error");
      valor.classList.remove("correcto");
    };

    limpiaTextareaWithLabel(valor:any){
      var divParent = valor.parentElement;
      var correctlbl = divParent.querySelector('label');
      correctlbl.className = "activeInput";
      valor.value = "";
      valor.classList.remove("errorTextarea");
      valor.classList.remove("correctoTextarea");
    };

//select
    errorSelect(valor:any,mensaje:any){
      var divParent = valor.parentElement.parentElement;
      var errorlbl = divParent.querySelector('label');
      errorlbl.className = "activeSelect errorLabel";
      errorlbl.innerText = mensaje;
    };

    errorSelectH6(valor:any,mensaje:any){
      var divParent = valor.parentElement.parentElement;
      var errorh6 = divParent.querySelector('h6');
      errorh6.className = "errorTh";
      errorh6.innerText = mensaje;
    };

    errorSelectRow(valor:any){
      var inpSlect = $(valor).parent("div").find("input.select-dropdown");
      inpSlect.removeClass("correcto");
      inpSlect.addClass("error");
    };

    errorSelectBrowser(valor:any){
      $(valor).removeClass("correcto");
      $(valor).addClass("error");
    };

    errorSelectBrowserBlack(valor:any){
      $(valor).removeClass("select_correcto_black");
      $(valor).addClass("select_error_black");
    };

    correctoSelect(valor:any,mensaje:any){
      var divParent = valor.parentElement.parentElement;
      var correctlbl = divParent.querySelector('label');
      correctlbl.className = "active activeSelect correctoLabel";
      correctlbl.innerText = mensaje;
      valor.classList.remove("error");
      valor.classList.remove("correcto");
    };

    limpiaSelectWLabel(valor:any){
      valor.selectedIndex = 0;
      var divParent = valor.parentElement;
      var correctlbl = divParent.querySelector('label');
      correctlbl.className = "active activeSelect";
      valor.value = "";
      valor.classList.remove("error");
      valor.classList.remove("correcto");
    };

    correctoSelectH6(valor:any,mensaje:any){
      var divParent = valor.parentElement.parentElement;
      var correctH6 = divParent.querySelector('h6');
      correctH6.className = "errorTh noImportantH6";
      correctH6.innerText = mensaje;
    };

    correctoSelectRow(valor:any){
      var inpSlect = $(valor).parent("div").find("input.select-dropdown");
      inpSlect.removeClass("error");
      inpSlect.addClass("correcto");
    };

    correctoSelectBrowser(valor:any){
      $(valor).removeClass("error");
      $(valor).addClass("correcto");
    };

    correctoSelectBrowserBlack(valor:any){
      $(valor).removeClass("select_error_black");
      $(valor).addClass("select_correcto_black");
    };

    limpiaSelect(valor:any){
      valor.selectedIndex = 0;
      valor.classList.remove("error");
      valor.classList.remove("correcto");
    };

    addlblDisabledSelect(input:any){
        var label = $(input).parents(".input-field").find("label");
        label.addClass("disabled");
    }

    quitalblDisabledSelect(input:any){
        var label = $(input).parents(".input-field").find("label");
        label.removeClass("disabled");
    }

  //botones
    correctoBtn(valor:any){
      valor.classList.remove("btnError");
      valor.classList.add("btnCorrecto");
    };

    errorBtn(valor:any){
      valor.classList.remove("btnCorrecto");
      valor.classList.add("btnError");
    };

    contactoCorrectoBtn(valor:any){
      valor.classList.remove("btnError");
      valor.classList.add("bg-blue-600");
    };

    contactoErrorBtn(valor:any){
      valor.classList.remove("bg-blue-600");
      valor.classList.add("btnError");
    };

  //tablas
    correctoTR(valor:any){
      var tdInside = $(valor).find("td");
      $(tdInside).removeClass("error");
      $(tdInside).addClass("correcto");
    };

    errorTR(valor:any){
      var tdInside = $(valor).find("td");
      $(tdInside).removeClass("correcto");
      $(tdInside).addClass("error");
    };

    correctoTD(valor:any){
      valor.classList.remove("error");
      valor.classList.add("correcto");
    };

    errorTD(valor:any){
      valor.classList.remove("correcto");
      valor.classList.add("error");
    };

    limpiaTR(valor:any){
      var tdInside = $(valor).find("td");
      $(tdInside).removeClass("error");
      $(tdInside).removeClass("correcto");
    };

//validaciones numericas
    soloNumeros(e:any){
        var key = e.charCode;
        console.log(key);
        return key >= 48 && key <= 57;
    };

//keypress
  /*String.fromCharCode = Método estático que devuelve una cadena creada mediante el uso de una secuencia de valores Unicode especificada.
  https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/String/fromCharCode
  https://symbl.cc/es/unicode-table/*/
  key_press_numbers(e:KeyboardEvent) {
    const caracter = String.fromCharCode(e.charCode);
    if (this.filtroNum(caracter) == false) {
      e.preventDefault();
    }
  }

  key_press_numbers_clave_sat(e:KeyboardEvent) {
    const caracter = String.fromCharCode(e.charCode);
    if (this.filtroNumericoSat(caracter) == false) {
      e.preventDefault();
    }
  }

  key_press_alfa(e:KeyboardEvent) {
    const caracter = String.fromCharCode(e.charCode);
    console.log(caracter);
    if (this.filtroAlfaNumerico(caracter) == false) {
      e.preventDefault();
    }
  }
}
