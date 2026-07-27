export class Usuarios{
    constructor( 
        public id /*sub*/: number,
        public name: string,
        public rfc: string,
        public area: string,
        public cargo: string,
        public avatar: string,
        public user_token /*codigo_acceso*/: string,
        public emp_token /*token_usuario*/: string,
        public tiempo/*iat*/: number,
        public registro/*exp*/: number,
        public codigo_acceso: string,
        public password: string,
        public email: string,
        public firebase_token: string,

        //public gettoken: string,
        ){}
}
