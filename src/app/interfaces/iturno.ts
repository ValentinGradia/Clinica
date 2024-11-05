import { EstadoTurno } from "../enums/estadoTurno";

export interface ITurno
{
	id?: string,
	idPaciente: string, 
	idEspecialista: string,
	especialidad: string,
	estado: EstadoTurno,
	resenia?: string,
	motivoCancelacion ?: string,
	nombreEspecialista: string,
	apellidoEspecialista: string,
	fecha: Date
}
