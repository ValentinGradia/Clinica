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
import { solicitarTurnoGuard } from './guards/solicitar-turno.guard';
import { animation } from '@angular/animations';
import { loadBundle } from '@angular/fire/firestore';

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
		canActivate : [usuarioGuard],
		data : { animation : 'statusPage'}
	},
	{
		path : 'turnos',
		loadComponent : () => import('./componentes/turnos/turnos.component').then(m => m.TurnosComponent),
	},
	{
		path : 'perfil',
		component: PerfilComponent,
		// canActivate : [logueadoGuard]
	},
	{
		path : 'solicitar-turno',
		loadComponent : () => import('./componentes/solicitar-turno/solicitar-turno.component').then(m => m.SolicitarTurnoComponent),
		canActivate: [solicitarTurnoGuard]
	},
	{
		path:'turnosAdmin',
		loadComponent : () => import('./componentes/turnos-admin/turnos-admin.component').then(m => m.TurnosAdminComponent),
	},
	{
		path:'turnosEspecialista',
		loadComponent : () => import('./componentes/turnos-especialista/turnos-especialista.component').then(m => m.TurnosEspecialistaComponent),
	},
	{
		path:'turnosPaciente',
		loadComponent : () => import('./componentes/turnos-paciente/turnos-paciente.component').then(m => m.TurnosPacienteComponent),
	},
	{
		path:'pacientes',
		loadComponent : () => import('./componentes/pacientes/pacientes.component').then(m => m.PacientesComponent),
	}
];
