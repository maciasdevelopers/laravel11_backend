export class proyectosModelo{
    constructor(
        public new_name_proyecto:string,
        public new_descrip_proyecto:string,
        public new_abrev_cliente_proyecto:string,
        public new_cliente_proyecto:string,
        public prioridad:string,
        public new_fecha_fin_proyecto:string,
        public bool_upload_evid:boolean,
        public bool_delete_evid_uploaded:boolean,
        public new_responsable_proyecto:string,
        public new_equipo_trabajo:any = [],
        public depende_proyecto:any = []
    ){}
}

