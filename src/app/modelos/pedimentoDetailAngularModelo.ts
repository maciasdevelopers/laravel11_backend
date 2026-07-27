export class pedimentoDetailAngularModelo{
    constructor(
        public token_pedimento:string,
        public fechaPedim:string,
        public numeroPedim:string,
        public aduana:string,
        public comentarios:string,
        public evidencias:[],
    ){}
}