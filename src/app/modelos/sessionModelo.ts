export class sessionModelo{
  constructor(
    public codigo_acceso: string,
    public password: string,
    public token_device: string,
    public email: string,
  ){}
}