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

@Component({
  selector: 'app-turnos',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, SpinnerComponent],
  templateUrl: './turnos.component.html',
  styleUrl: './turnos.component.css'
})
export class TurnosComponent implements OnInit {

  turnosService = inject(TurnosService);
  auth = inject(AuthService);
  turnos : Array<ITurno> = [];
  todosLosTurnos : Array<ITurno> = [];

  mostrarSpinner : boolean = false;

  valorFiltro : string = '';

  constructor(){}

  async ngOnInit(): Promise<void> {
    this.mostrarSpinner = true;
    const resp = (await this.turnosService.traerTurnosPaciente(this.auth.usuarioActual?.id!))
    resp.forEach(turno => {
      this.turnos.push(turno as ITurno);
    });

    // this.turnos = this.turnos.map(turno => {
    //   return {
    //     ...turno, 
    //     fecha: (turno.fecha && turno.fecha instanceof Timestamp) ? turno.fecha.toDate() : turno.fecha // Convertir `Timestamp` a `Date`
    //   } as ITurno;
    // })

    this.todosLosTurnos = this.turnos;

    this.mostrarSpinner = false;
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
  }

}
