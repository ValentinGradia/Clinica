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

  sacarTurno(horario : string, dia : Date | string)
  {
    this.mostrarSpinner = !this.mostrarSpinner;
    var turno = {
      idPaciente : this.auth.usuarioActual?.id,
      fotoPaciente: this.auth.usuarioActual?.foto,
      idEspecialista: this.especialistaSeleccionado?.id,
      especialidad: this.especialidadSeleccionada,
      estado: EstadoTurno.PENDIENTE,
      nombreEspecialista: this.especialistaSeleccionado?.nombre,
      apellidoEspecialista: this.especialistaSeleccionado?.apellido,
      nombrePaciente: this.auth.usuarioActual?.nombre!,
      dia: dia,
      hora: horario
    } as ITurno

    var numeroDia = dia as Date;
    switch (numeroDia.getDay().toString()) {
      case '1':
        this.especialistaSeleccionado!.lunes! =
          this.especialistaSeleccionado!.lunes!.filter(
            (hora) => hora !== horario
          );
        break;
      case '2':
        this.especialistaSeleccionado!.martes! =
          this.especialistaSeleccionado!.martes!.filter(
            (hora) => hora !== horario
          );
        break;
      case '3':
        this.especialistaSeleccionado!.miercoles! =
          this.especialistaSeleccionado!.miercoles!.filter(
            (hora) => hora !== horario
          );
        break;
      case '4':
        this.especialistaSeleccionado!.jueves! =
          this.especialistaSeleccionado!.jueves!.filter(
            (hora) => hora !== horario
          );
        break;
      case '5':
        this.especialistaSeleccionado!.viernes! =
          this.especialistaSeleccionado!.viernes!.filter(
            (hora) => hora !== horario
          );
        break;
    }

    this.turnosDb.agregarTurno(turno)
    this.usuariosDb.actualizarEspecialista(this.especialistaSeleccionado!);
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

  filtrarFecha(fecha: Date): string[] 
  {
    const diaSemana = fecha.getDay();
    let horarios: string[] = [];
  
    switch (diaSemana) {
      case 1:
        horarios = this.especialistaSeleccionado?.lunes ?? [];
        break;
      case 2:
        horarios = this.especialistaSeleccionado?.martes ?? [];
        break;
      case 3:
        horarios = this.especialistaSeleccionado?.miercoles ?? [];
        break;
      case 4:
        horarios = this.especialistaSeleccionado?.jueves ?? [];
        break;
      case 5:
        horarios = this.especialistaSeleccionado?.viernes ?? [];
        break;
      default:
        return [];
    }
  
    return horarios.sort((a, b) => {
      const [horaA, minutoA] = a.split(':').map(Number);
      const [horaB, minutoB] = b.split(':').map(Number);
  
      return horaA * 60 + minutoA - (horaB * 60 + minutoB);
    });
  }

}
