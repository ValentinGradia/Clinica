import { Routes } from '@angular/router';
import { HomeComponent } from './componentes/home/home.component';
import { BienvenidaComponent } from './componentes/bienvenida/bienvenida.component';
import { RegistroComponent } from './componentes/registro/registro.component';

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
	}
];
