import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { InterfProveedores } from '../../interfaces/interf-proveedores';
import { global } from '../global_ssic';
import { Usuarios } from '../../modelos/Usuarios';
import * as CryptoJS from 'crypto-js';
@Injectable({
  providedIn: 'root'
})
export class ServEncryptService {
  public url: string;
  public key = CryptoJS.enc.Base64.parse('sosencriptadordetextos'); // Misma que en el backend

  httpOptions = {
    Headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private _httpClient: HttpClient) {
    this.url = global.urlApi;
  }

  emperador(texto:any){
    let key:string = "textoencriptado";
    let iv:string = "1234567812345678";
    const config = {
      keySize: 256 / 8,
      iv: CryptoJS.enc.Utf8.parse(iv),
      padding: CryptoJS.pad.ZeroPadding,
      mode: CryptoJS.mode.CBC,
    };
    return CryptoJS.AES.encrypt(texto,key,config).toString();
    //decrypt
  }

  esclavo(texto:any){
    let key:string = "textoencriptado";
    let iv:string = "1234567812345678";
    const config = {
      keySize: 256 / 8,
      iv: CryptoJS.enc.Utf8.parse(iv),
      padding: CryptoJS.pad.ZeroPadding,
      mode: CryptoJS.mode.CBC,
    };
    //console.log(texto);CryptoJS.enc.Utf8
    return CryptoJS.AES.decrypt(texto,key,config).toString(CryptoJS.enc.Utf8);
  }

  emperador_strong(texto:any){
    let key_aes_one:string = "textoencriptado";
    let key_aes_two:string = "textoreencriptado";
    let key_aes_tre:string = "textosuperencriptado";

    let iv:string = "1234567812345678";
    const config128 = {keySize: 128 / 8,iv: CryptoJS.enc.Utf8.parse(iv),padding: CryptoJS.pad.ZeroPadding,mode: CryptoJS.mode.CBC,};
    const config256 = {keySize: 256 / 8,iv: CryptoJS.enc.Utf8.parse(iv),padding: CryptoJS.pad.ZeroPadding,mode: CryptoJS.mode.CBC,};
    const config512 = {keySize: 512 / 8,iv: CryptoJS.enc.Utf8.parse(iv),padding: CryptoJS.pad.ZeroPadding,mode: CryptoJS.mode.CBC,};
    
    let encryptar = CryptoJS.AES.encrypt(texto,key_aes_one,config128).toString();
    encryptar = CryptoJS.AES.encrypt(encryptar,key_aes_two,config256).toString();
    encryptar = CryptoJS.AES.encrypt(encryptar,key_aes_tre,config512).toString();
    encryptar = btoa(encryptar);
    encryptar = CryptoJS.DES.encrypt(encryptar,key_aes_one).toString();
    encryptar = CryptoJS.TripleDES.encrypt(encryptar,key_aes_one).toString();
    encryptar = CryptoJS.Rabbit.encrypt(encryptar,key_aes_one).toString();
    return CryptoJS.DES.encrypt(encryptar, key_aes_one).toString();
  }

  encryptBankAccount(plainText: string): string {
    const iv = CryptoJS.lib.WordArray.random(16);
    const encrypted = CryptoJS.AES.encrypt(plainText, this.key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    const combined = iv.concat(encrypted.ciphertext);
    return CryptoJS.enc.Base64.stringify(combined);
  }

  decryptBankAccount(cipherText: string): string {
    const rawData = CryptoJS.enc.Base64.parse(cipherText);

    // Extraer el IV (primeros 16 bytes / 128 bits)
    const iv = CryptoJS.lib.WordArray.create(rawData.words.slice(0, 4), 16);

    // Extraer el texto cifrado (resto)
    const ciphertext = CryptoJS.lib.WordArray.create(
      rawData.words.slice(4),
      rawData.sigBytes - 16
    );

    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext: ciphertext } as CryptoJS.lib.CipherParams,
      this.key,
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  esclavo_strong(texto:any){
    let key_aes_one:string = "textoencriptado";
    let key_aes_two:string = "textoreencriptado";
    let key_aes_tre:string = "textosuperencriptado";

    let iv:string = "1234567812345678";
    const config128 = {keySize: 128 / 8,iv: CryptoJS.enc.Utf8.parse(iv),padding: CryptoJS.pad.ZeroPadding,mode: CryptoJS.mode.CBC,};
    const config256 = {keySize: 256 / 8,iv: CryptoJS.enc.Utf8.parse(iv),padding: CryptoJS.pad.ZeroPadding,mode: CryptoJS.mode.CBC,};
    const config512 = {keySize: 512 / 8,iv: CryptoJS.enc.Utf8.parse(iv),padding: CryptoJS.pad.ZeroPadding,mode: CryptoJS.mode.CBC,};
    
    let desencryptar =CryptoJS.DES.decrypt(texto, key_aes_one).toString(CryptoJS.enc.Utf8);
    desencryptar = CryptoJS.Rabbit.decrypt(desencryptar, key_aes_one).toString(CryptoJS.enc.Utf8);
    desencryptar = CryptoJS.TripleDES.decrypt(desencryptar, key_aes_one).toString(CryptoJS.enc.Utf8);
    desencryptar = CryptoJS.DES.decrypt(desencryptar, key_aes_one).toString(CryptoJS.enc.Utf8);
    desencryptar = atob(desencryptar).toString();
    desencryptar = CryptoJS.AES.decrypt(desencryptar,key_aes_tre,config512).toString(CryptoJS.enc.Utf8);
    desencryptar = CryptoJS.AES.decrypt(desencryptar,key_aes_two,config256).toString(CryptoJS.enc.Utf8);
    return CryptoJS.AES.decrypt(desencryptar,key_aes_one,config128).toString(CryptoJS.enc.Utf8);
  }

  sencible_encript(texto:any){
    let key_aes_one:string = "textoreencriptado";
    return CryptoJS.AES.encrypt(texto,key_aes_one).toString();
  }

  sencible_decript(texto:any){
    let key_aes_one:string = "textoreencriptado";
    const bytes = CryptoJS.AES.decrypt(texto,key_aes_one);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  santoEncryptCode(codigo:any){
    //var cifradoOf = CryptoJS.SHA512(CryptoJS.SHA256(CryptoJS.MD5(codigo))).toString();
    var md5 = CryptoJS.MD5(codigo).toString();
    var sha256 = CryptoJS.SHA256(md5).toString();
    var cifradoOf = CryptoJS.SHA512(sha256).toString();
    //console.log(cifradoOf);
    return cifradoOf;
  }

  generarPassWD(data_token:any,data_email:any){
    const symbols = ".,#$%&/()=";
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const allChars = upper + lower + numbers + symbols;
    let stringDataPass = data_token + Math.random() + data_email;
    let primerDataPass = this.santoEncryptPass(stringDataPass).substring(0, 8);
    let randomPart = "";
    for (let i = 0; i < 6; i++) {
      randomPart += allChars.charAt(Math.floor(Math.random()) * allChars.length);
    }

    const pass =
    upper.charAt(Math.floor(Math.random() * upper.length)) + // 1 mayúscula
    lower.charAt(Math.floor(Math.random() * lower.length)) + // 1 minúscula
    numbers.charAt(Math.floor(Math.random() * numbers.length)) + // 1 número
    symbols.charAt(Math.floor(Math.random() * symbols.length)) + // 1 símbolo
    randomPart;
    
    const password_mezclar = this.mezclarCadenas(pass, primerDataPass.substring(0, 6));
    const password_creada = password_mezclar.charAt(0).toUpperCase() + password_mezclar.slice(1);
    const encryptedPass = this.santoEncryptPass(password_creada);
    return { plain: password_creada, encrypted: encryptedPass };
  }

  mezclarCadenas(cad_ena_uno:string,cad_ena_dos:string){
    let result_pass = "";
    for (let i = 0; i < Math.max(cad_ena_uno.length,cad_ena_dos.length); i++) {
      if (cad_ena_uno[i]) result_pass += cad_ena_uno[i];
      if (cad_ena_dos[i]) result_pass += cad_ena_dos[i];
    }
    return result_pass;
  }

  santoEncryptPass(password:any){
    //var cifradoOf = CryptoJS.SHA512(CryptoJS.MD5(CryptoJS.SHA256(password))).toString();
    var md5 = CryptoJS.MD5(password).toString();
    var sha256 = CryptoJS.SHA256(md5).toString();
    var cifradoOf = CryptoJS.SHA512(sha256).toString();
    //console.log(cifradoOf);
    return cifradoOf;
  }

  imperialEncrypt(imperial_text:any){
    const splittedWord = imperial_text.toLowerCase().split(""); // ["h", "o", "l", "a"]
    const codes = splittedWord.map((letter:any) => `${letter}${String(letter).charCodeAt(0)}`);
    let key_aes_tre:string = "textosuperencriptadoABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let iv:string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ƒŠŒŽšœžŸÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ.,;:()/#%&$¡!¨";
    let proceso_imperial = btoa(encodeURIComponent(codes));
    proceso_imperial = CryptoJS.SHA512(proceso_imperial).toString();
    proceso_imperial = CryptoJS.SHA256(proceso_imperial).toString();
    proceso_imperial = CryptoJS.MD5(proceso_imperial).toString();
    console.log(proceso_imperial);
    proceso_imperial = CryptoJS.SHA3(proceso_imperial, { outputLength: 224 }).toString();
    return proceso_imperial;
  }
}
