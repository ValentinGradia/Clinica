import { Component, inject, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SpinnerComponent } from '../spinner/spinner.component';
import { IEspecialista } from '../../interfaces/iespecialista';
import { EstadoTurno } from '../../enums/estadoTurno';
import { TurnosService } from '../../services/turnos.service';
import { ITurno } from '../../interfaces/iturno';
import Swal from 'sweetalert2';

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
  turnosDb = inject(TurnosService);
  mostrarSpinner = false;
  especialistas : IEspecialista[] = [];
  mostrarEspecialistas : IEspecialista[] = []
  especialistasFiltrados : IEspecialista[] = [];
  especialidadSeleccionada : string | null = null;
  valorInicial = 3;
  mostrarTabla  :boolean = false;
  diasDisponibles : Array<any> = [];

  especialistaSeleccionado : IEspecialista | null = null;

  async ngOnInit(): Promise<void> {
    this.mostrarSpinner = true;
    //el firstValueFrom convierte el observable a una promesa
    const data = await firstValueFrom(this.usuariosDb.traerEspecialistasAprobados());
    this.especialistas = data;


    this.mostrarEspecialistas = this.especialistas.slice(0,3);

    this.setearDias();
    console.log(this.especialistas);

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

  actualizar(accion : string) : void
  {
    if(accion == '+')
    {
      
      this.mostrarEspecialistas = this.especialistas.slice(this.valorInicial, this.valorInicial+3);
      this.valorInicial += 3;
    }
    else
    {
      if(this.valorInicial !== 3)
      {
        this.mostrarEspecialistas = this.especialistas.slice(this.valorInicial-6, this.valorInicial-3);
        this.valorInicial -= 3;
      }
    }
  }


  seleccionarEspecialidad(especialidad : string) : void
  {
    this.especialidadSeleccionada = especialidad;
    this.mostrarTabla = true;
  }

  sacarTurno(horario : string, dia : string)
  {
    this.mostrarSpinner = !this.mostrarSpinner;
    var turno = {
      idPaciente : this.auth.usuarioActual?.id,
      idEspecialista: this.especialistaSeleccionado?.id,
      especialidad: this.especialidadSeleccionada,
      estado: EstadoTurno.PENDIENTE,
      nombreEspecialista: this.especialistaSeleccionado?.nombre,
      apellidoEspecialista: this.especialistaSeleccionado?.nombre,
      dia: dia,
      hora: horario
    } as ITurno

    this.turnosDb.agregarTurno(turno)
    this.mostrarSpinner = !this.mostrarSpinner;
    Swal.fire({
      title: "Completado",
      text: "Turno en estado pendiente",
      icon: "success",
      position :"center",
    });
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

  verEspecialidades(e : IEspecialista) : void
  {
    this.especialistaSeleccionado = e;
    this.especialidadSeleccionada = null;
    this.mostrarTabla = false;
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
