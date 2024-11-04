import { Routes } from '@angular/router';
import { HomeComponent } from './componentes/home/home.component';
import { BienvenidaComponent } from './componentes/bienvenida/bienvenida.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { LoginComponent } from './componentes/login/login.component';
import { UsuariosComponent } from './componentes/usuarios/usuarios.component';
import { usuarioGuard } from './guards/usuario.guard';
import { Component } from '@angular/core';
import { TurnosComponent } from './componentes/turnos/turnos.component';

export const routes: Routes = [
	{
		path: '',
		redirectTo: 'inicio',
		pathMatch : 'full'
	},
	{
		path : 'inicio',
		component : BienvenidaComponent
	},
	{
		path : 'registro',
		component : RegistroComponent
	},
	{
		path : 'login',
		component : LoginComponent
	},
	{
		path : 'usuarios',
		component : UsuariosComponent,
		canActivate : [usuarioGuard]
	},
	{
		path : 'turnos',
		component : TurnosComponent
	}
];
