import { Component, inject, OnInit } from '@angular/core';
import { ITurno } from '../../interfaces/iturno';
import { TurnosService } from '../../services/turnos.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Timestamp } from '@angular/fire/firestore';
import { SpinnerComponent } from '../spinner/spinner.component';
import Swal from 'sweetalert2';
import { EstadoTurno } from '../../enums/estadoTurno';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';
import { IEspecialista } from '../../interfaces/iespecialista';

@Component({
  selector: 'app-turnos-paciente',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, SpinnerComponent],
  templateUrl: './turnos-paciente.component.html',
  styleUrl: './turnos-paciente.component.css'
})
export class TurnosPacienteComponent implements OnInit {

    turnosService = inject(TurnosService);
  usuariosDB = inject(UsuarioService);
  auth = inject(AuthService);
  turnos : Array<ITurno> = [];
  todosLosTurnos : Array<ITurno> = [];

  mostrarSpinner : boolean = false;

  valorFiltro : string = '';

  constructor(){}

  async ngOnInit(): Promise<void> {
    this.mostrarSpinner = true;
    const resp = (await this.turnosService.traerTurnosPaciente('CbFDkyWQXZyVcWbrSIeL'))
    resp.forEach(turno => {
      this.turnos.push(turno as ITurno);
    });

    this.turnos = this.turnos.map(turno => {
      return {
        ...turno, 
        dia: (turno.dia && turno.dia instanceof Timestamp) ? turno.dia.toDate() : turno.dia // Convertir `Timestamp` a `Date`
      } as ITurno;
    })

    this.todosLosTurnos = this.turnos;

    this.mostrarSpinner = false;
  }

  verResenia(turno : ITurno) : void
  {
    Swal.fire({
      position: "center",
      title: turno.resenia!,
      showConfirmButton: true,
    });
  }

  async calificarAtencion(turno : ITurno) : Promise<void>
  {
    var atencion;
    await Swal.fire({
      position: "center",
      title: "¿Como fue la atencion que recibio?",
      input : "text",
      inputAttributes: {
        autocapitalize: "off"
      },
      showConfirmButton: true,
    }).then(result => {
      if(result.isConfirmed)
      {
        atencion = result.value;
      }
    });

    turno.atencion = atencion;
    this.turnosService.actualizarTurno(turno);
  }

  filtrarTurno() : void
  {

    const regex = new RegExp(`^${this.valorFiltro}`, 'i');

    this.turnos = this.turnos.filter(turno => regex.test(turno.nombreEspecialista) || regex.test(turno.especialidad));
    console.log(this.turnos);
  }
  
  resetFiltro() : void
  {
    this.valorFiltro = '';
    this.turnos = this.todosLosTurnos;
  }

  async cancearTurno(turno : ITurno)
  {
    var motivo;
    await Swal.fire({
      position: "center",
      icon: "warning",
      title: "¿Por que desea cancelar el turno?",
      input : "text",
      inputAttributes: {
        autocapitalize: "off"
      },
      showConfirmButton: true,
    }).then(result => {
      if(result.isConfirmed)
      {
        motivo = result.value;
      }
    });

    turno.motivoCancelacion = motivo
    turno.estado = EstadoTurno.CANCELADO;
    this.turnosService.actualizarTurno({...turno})

    const especialista =  await this.usuariosDB.traerEspecialista(turno.idEspecialista);

    switch (turno.dia.getDay().toString()) {
      case '1':
        especialista.lunes?.push(turno.hora);
        break;
      case '2':
        especialista.martes?.push(turno.hora);
        break;
      case '3':
        especialista.miercoles?.push(turno.hora);
        break;
      case '4':
        especialista.jueves?.push(turno.hora);
        break;
      case '5':
        especialista.viernes?.push(turno.hora);
        break;
    }

    this.usuariosDB.actualizarEspecialista(especialista);
  }

}
