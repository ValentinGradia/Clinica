import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Usuario } from '../../interfaces/iusuario';
import { SpinnerComponent } from '../spinner/spinner.component';
import { UsuarioService } from '../../services/usuario.service';
import { IPaciente } from '../../interfaces/ipaciente';
import jsPDF from 'jspdf';
import { TurnosService } from '../../services/turnos.service';
import { ITurno } from '../../interfaces/iturno';
import { Timestamp } from '@angular/fire/firestore';
import { IEspecialista } from '../../interfaces/iespecialista';


@Component({
  selector: 'app-turnos-finalizados-grafico',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule, SpinnerComponent],
  templateUrl: './turnos-finalizados-grafico.component.html',
  styleUrl: './turnos-finalizados-grafico.component.css'
})
export class TurnosFinalizadosGraficoComponent implements OnInit {

  especialistas : IEspecialista[] = [];
  usuariosService = inject(UsuarioService);
  turnosService = inject(TurnosService);
  especialistaSeleccionado : IEspecialista | null = null;

  mostrarSpinner : boolean = false;
  respuesta : number | null = null;

  async ngOnInit(): Promise<void> {
      this.mostrarSpinner = !this.mostrarSpinner;
      this.especialistas = await this.usuariosService.traerEsepecialistas();
      this.mostrarSpinner = !this.mostrarSpinner;
  }

  cambiarTexto(e: IEspecialista) : void
  {
    const boton = document.getElementById('dropdownButton');
    boton!.textContent = e.nombre;
    this.especialistaSeleccionado = e;
  }


  async buscar() : Promise<void>
  {
    this.mostrarSpinner = !this.mostrarSpinner;
    const fechaInicioInput = (document.getElementById("fechaInicio") as HTMLInputElement).value;
    const fechaFinInput = (document.getElementById("fechaFin") as HTMLInputElement).value;

    const fechaInicio = new Date(fechaInicioInput);
    const fechaFin = new Date(fechaFinInput);

    var turnos = await this.turnosService.traerTurnosEspecialista(this.especialistaSeleccionado?.id!);
    turnos = turnos.map(turno => {
      return {
        ...turno, 
        dia: (turno.dia && turno.dia instanceof Timestamp) ? turno.dia.toDate() : turno.dia // Convertir `Timestamp` a `Date`
      } as ITurno;
    }).filter(turno => turno.estado == 'finalizado');

    turnos = turnos.filter(turno => turno.dia >= fechaInicio && turno.dia <= fechaFin);

    this.respuesta = turnos.length;
    this.mostrarSpinner = !this.mostrarSpinner;

  }

}
