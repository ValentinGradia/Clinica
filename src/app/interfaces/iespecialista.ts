import { Usuario } from "./iusuario"

export interface IEspecialista extends Usuario {
	especialidad : string[]
	estado: string,
	lunes ?: string[],
	martes ?: string[],
	miercoles ?: string[],
	jueves ?: string[],
	viernes ?: string[]
}
