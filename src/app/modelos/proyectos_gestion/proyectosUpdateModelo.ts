export class proyectosUpdateModelo{
    constructor(
        public token_proyecto:string,
        public name_proyecto:string,
        public descrip_proyecto:string,
        public abrev_cliente_proyecto:string,
        public cliente_proyecto:string,
        public prioridad:string,
        public fecha_fin_proyecto_epoc:string,
        public fecha_fin_proyecto_html:string,
        public upload_evid:boolean,
        public delete_evid_uploaded:boolean,
        public responsable_proyecto:string,
        public arrayEquipoTrabajo:any = [],
        public arrayRecalendar:any = [],
        public listProyToLeader:any = [],
    ){}
}

