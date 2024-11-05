import { EstadoTurno } from "../enums/estadoTurno";

export interface ITurno
{
	id?: string,
	idPaciente: string, 
	idEspecialista: string,
	especialidad: string,
	estado: EstadoTurno,
	resenia?: string
	nombreEspecialista: string,
	apellidoEspecialista: string,
	fecha: Date
}
