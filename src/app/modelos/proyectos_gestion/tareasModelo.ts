export class tareasModelo{
    constructor(
        public name_tarea:string,
        public descrip_tarea:string,
        public fecha_fin_tarea:string,
        public responsable_tarea:string,
        public array_responsables_tarea:any = [],
        public array_depende_tarea:any = []
    ){}
}

