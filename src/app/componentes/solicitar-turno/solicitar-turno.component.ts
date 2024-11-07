import { Component, inject, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SpinnerComponent } from '../spinner/spinner.component';
import { IEspecialista } from '../../interfaces/iespecialista';

@Component({
  selector: 'app-solicitar-turno',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SpinnerComponent],
  templateUrl: './solicitar-turno.component.html',
  styleUrl: './solicitar-turno.component.css'
})
export class SolicitarTurnoComponent implements OnInit {

  usuariosDb = inject(UsuarioService);
  auth = inject(AuthService);
  especialidades : string[] = [];
  mostrarSpinner = false;
  especialistas : IEspecialista[] = [];
  especialistasFiltrados : IEspecialista[] = [];
  diasDisponibles : Array<any> = [];

  especialidadSeleccionada : string | null = null;
  especialistaSeleccionado : IEspecialista | null = null;

  async ngOnInit(): Promise<void> {
    this.mostrarSpinner = true;
    //el firstValueFrom convierte el observable a una promesa
    const data = await firstValueFrom(this.usuariosDb.traerEspecialistas());
    this.especialistas = data;

    data.forEach(especialista => {
      this.especialidades.push(...especialista.especialidad);
    });

    this.setearDias();

    this.mostrarSpinner = false;
  }

  setearDias() : void
  {
    const fechaActual = new Date();
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaActual.getDate() + 15);

    var fechaTemporal = new Date(fechaActual);
    while(fechaTemporal <= fechaLimite)
    {

      this.diasDisponibles.push(new Date(fechaTemporal));
      fechaTemporal.setDate(fechaTemporal.getDate() + 1);
    }
  }


  seleccionarEspecialidad(event: Event) : void
  {
    const selectElement = event.target as HTMLSelectElement;
    this.especialidadSeleccionada = selectElement.value;

    this.filtrarEspecialistas(this.especialidadSeleccionada);
  }


  filtrarEspecialistas(especialidad : string)
  {
    this.especialistas.forEach(e => {
      if(e.especialidad.includes(especialidad))
      {
        if(!this.especialistasFiltrados.includes(e))
        {
          this.especialistasFiltrados.push(e);
        }
      }
      else
      {
        this.especialistasFiltrados = this.especialistasFiltrados.filter(especialista => especialista !== e);
      }
    });
  }

  obtenerHorario(dia: Date, index: number): string {
    const horarios = this.filtrarFecha(dia);
    return horarios[index] || '';
  }

  getMaxHorarios(): number[] {
    type DiasSemana = 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes';

    const maxHorarios = Math.max(
      ...(['lunes', 'martes', 'miercoles', 'jueves', 'viernes'] as DiasSemana[]).map((dia) =>
        (this.especialistaSeleccionado![dia] || []).length
      ));

    return Array(maxHorarios).fill(0).map((_, i) => i); 
  }

  filtrarFecha(fecha: Date): string[] {
    const diaSemana = fecha.getDay();

    switch (diaSemana) {
      case 1:
        return this.especialistaSeleccionado?.lunes ?? [];
      case 2:
        return this.especialistaSeleccionado?.martes ?? [];
      case 3:
        return this.especialistaSeleccionado?.miercoles ?? [];
      case 4:
        return this.especialistaSeleccionado?.jueves ?? [];
      case 5:
        return this.especialistaSeleccionado?.viernes ?? [];
      default:
        return [];
    }
  }

}
