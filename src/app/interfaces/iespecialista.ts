export interface IEspecialista {
	id ?: string,
	nombre : string,
	apellido : string,
	edad : number,
	dni : number,
	especialidad : string[]
	correo: string
	contrasenia : string,
	aprobado : boolean
	foto : Promise<string>
}
