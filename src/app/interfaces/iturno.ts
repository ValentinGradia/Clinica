export interface ITurno
{
	id?: string,
	idPaciente: string, 
	idEspecialista: string,
	especialidad: string,
	estado: string,
	reseña?: string
}