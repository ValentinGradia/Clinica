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
		component : BienvenidaComponent
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
		canActivate : [logueadoGuard]
	},
	{
		path : 'perfil',
		component: PerfilComponent,
		canActivate : [logueadoGuard]
	},
	{
		path : 'solicitar-turno',
		loadComponent : () => import('./componentes/solicitar-turno/solicitar-turno.component').then(m => m.SolicitarTurnoComponent),
		canActivate: [solicitarTurnoGuard]
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
	},
	{
		path:'estadisticas',
		loadComponent : () => import('./componentes/estadisticas/estadisticas.component').then(m => m.EstadisticasComponent),
	},
	{
		path:'turnosPorDia',
		loadComponent : () => import('./componentes/turnos-por-dia/turnos-por-dia.component').then(m => m.TurnosPorDiaComponent),
	},
	{
		path:'turnosPorEspecialidad',
		loadComponent : () => import('./componentes/turnos-por-especialidad/turnos-por-especialidad.component').then(m => m.TurnosPorEspecialidadComponent),
	},
	{
		path:'turnosSolicitados',
		loadComponent : () => import('./componentes/turnos-solicitados-grafico/turnos-solicitados-grafico.component').then(m => m.TurnosSolicitadosGraficoComponent),
	},
	{
		path:'turnosFinalizados',
		loadComponent : () => import('./componentes/turnos-finalizados-grafico/turnos-finalizados-grafico.component').then(m => m.TurnosFinalizadosGraficoComponent),
	},
	{
		path:'ingresos',
		loadComponent : () => import('./componentes/log-ingresos/log-ingresos.component').then(m => m.LogIngresosComponent),
	},
	{
		path:'seccion-usuarios',
		loadComponent : () => import('./componentes/seccion-usuarios/seccion-usuarios.component').then(m => m.SeccionUsuariosComponent),
	}

];
