export class informesModelo{
    constructor(
        public informe_titulo:string,
        public informe_observaciones:string,
        public informe_horas_activas:number,
        public informe_evidencias_files:any [] = [],
        public informe_evidencias_nombres:any = [],
        //public informe_evidencias_links:any = [],
        public informe_bool_urls:boolean,
    ){}
}

