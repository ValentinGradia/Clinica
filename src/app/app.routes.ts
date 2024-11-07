import { Routes } from '@angular/router';
import { HomeComponent } from './componentes/home/home.component';
import { BienvenidaComponent } from './componentes/bienvenida/bienvenida.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { LoginComponent } from './componentes/login/login.component';
import { UsuariosComponent } from './componentes/usuarios/usuarios.component';
import { usuarioGuard } from './guards/usuario.guard';
import { Component } from '@angular/core';
import { TurnosComponent } from './componentes/turnos/turnos.component';
import { PerfilComponent } from './componentes/perfil/perfil.component';
import { logueadoGuard } from './guards/logueado.guard';

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
		loadComponent : () => import('./componentes/usuarios/usuarios.component').then(m => m.UsuariosComponent),
		canActivate : [usuarioGuard]
	},
	{
		path : 'turnos',
		component : TurnosComponent
	},
	{
		path : 'perfil',
		component: PerfilComponent,
		// canActivate : [logueadoGuard]
	}
];
