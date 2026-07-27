export class requisicionesModelo{
    constructor(
        public proyecto:string,
        public prioridad:string,
        public justificacion:string,
        public lista_articulos:any = [],
        public requisicion_adjunto:any [] = [],
        public requisicion_documento:any [] = [],
    ){}
}

