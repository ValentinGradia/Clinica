import { EstadoTurno } from "../enums/estadoTurno";

export interface ITurno
{
	id?: string,
	idPaciente: string, 
	fotoPaciente: string,
	idEspecialista: string,
	especialidad: string,
	estado: EstadoTurno,
	resenia?: string,
	motivoCancelacion ?: string,
	atencion? : string,
	nombreEspecialista: string,
	apellidoEspecialista: string,
	nombrePaciente: string,
	dia: Date ,
	hora: string,
	historiaClinica?: boolean,
	altura?: number,
	peso?: number,
	temperatura?: number,
	presion?: string,
	primerDatoDinamico?: Map<any, any>,
	segundoDatoDinamico?: Map<any, any>,
	tercerDatoDinamico?: Map<any, any>,
}
