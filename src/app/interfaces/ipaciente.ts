import { Usuario } from "./iusuario";

export interface IPaciente extends Usuario{
	obraSocial : string,
	segundaFoto: string
}
