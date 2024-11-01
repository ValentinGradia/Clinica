export interface IPaciente {
	id ?: string,
	nombre : string,
	apellido : string,
	edad : number,
	dni : number,
	obraSocial : string,
	correo: string,
	contrasenia : string,
	primerFoto : Promise<string>,
	segundaFoto: Promise<string>
}
