export class loteDetailAngularModelo{
    constructor(
        public token_lote:string,
        public fechaLote:string,
        public numeroLote:string,
        public comentarios:string,
        public evidencias:[],
    ){}
}