export class tareasUpdateModelo{
    constructor(
        public token_proyecto:string,
        public tkn_tarea:string,
        public name_tarea:string,
        public descrip_tarea:string,
        public fecha_fin_tarea:string,
        public teamProyectoTarea:any = [],
        public equipoResponsable:any = [],
        public creat_lider:string,
    ){}
}

