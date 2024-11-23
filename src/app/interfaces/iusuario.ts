export interface Usuario
{
	id ?: string,
	nombre : string,
	apellido : string,
	edad : number,
	dni : number,
	correo: string,
	contrasenia : string
	foto : string,
	ingreso ?: Date
}