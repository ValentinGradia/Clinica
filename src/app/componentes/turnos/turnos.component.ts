import { Component, inject, OnInit } from '@angular/core';
import { ITurno } from '../../interfaces/iturno';
import { TurnosService } from '../../services/turnos.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Timestamp } from '@angular/fire/firestore';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-turnos',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, SpinnerComponent],
  templateUrl: './turnos.component.html',
  styleUrl: './turnos.component.css'
})
export class TurnosComponent implements OnInit {

  turnosService = inject(TurnosService);
  turnos : Array<ITurno> = [];
  todosLosTurnos : Array<ITurno> = [];

  mostrarSpinner : boolean = false;

  valorFiltro : string = '';

  constructor(){}

  async ngOnInit(): Promise<void> {
    this.mostrarSpinner = true;
    const resp = (await this.turnosService.traerTurnosPaciente('8jAwImsYn9Lppx462e0R'))

    resp.forEach(turno => {
      this.turnos.push(turno.data() as ITurno);
    });

    this.turnos = this.turnos.map(turno => {
      return {
        ...turno, 
        fecha: (turno.fecha && turno.fecha instanceof Timestamp) ? turno.fecha.toDate() : turno.fecha // Convertir `Timestamp` a `Date`
      } as ITurno;
    })

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

}
