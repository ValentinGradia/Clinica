import { Component, inject, OnInit } from '@angular/core';
import { ITurno } from '../../interfaces/iturno';
import { TurnosService } from '../../services/turnos.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Primitive, Timestamp } from '@angular/fire/firestore';
import { SpinnerComponent } from '../spinner/spinner.component';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { EstadoTurno } from '../../enums/estadoTurno';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';
import { IEspecialista } from '../../interfaces/iespecialista';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, SpinnerComponent],
  templateUrl: './pacientes.component.html',
  styleUrl: './pacientes.component.css'
})
export class PacientesComponent implements OnInit {

  turnosService = inject(TurnosService);
  usuariosDB = inject(UsuarioService);
  auth = inject(AuthService);

  mostrarSpinner : boolean = false;

  turnos : ITurno[] = [];


  async ngOnInit(): Promise<void> {
    this.mostrarSpinner = true;
    const resp = (await this.turnosService.traerTurnosFinalizados(this.auth.usuarioActual!.id!))
    resp.forEach(turno => {
      this.turnos.push(turno as ITurno);
    });

    this.turnos = this.turnos.map(turno => {
      return {
        ...turno, 
        dia: (turno.dia && turno.dia instanceof Timestamp) ? turno.dia.toDate() : turno.dia // Convertir `Timestamp` a `Date`
      } as ITurno;
    })
    this.mostrarSpinner = false;
  }

  seleccionarTurno(turno: ITurno) : void
  {

    const diaTurno = 
    turno.dia.toLocaleString('es-ES', { weekday: 'short' }) + " " + 
    turno.dia.toLocaleString('es-ES', { month: 'short' }) + " " + 
    turno.dia.getDate();

    Swal.fire({
      title: 'Informacion turno',
      html: `
        <div class="flex flex-col">
          <div class="grid grid-cols-2">
            <div class="flex">
            
              <label class="text-3xl">Dia: </label>
              <p class="text-3xl ml-4">${diaTurno}</p>
            </div>

            <div class="flex">         
              <label class="text-3xl ml-8">Hora: </label>
              <p class="text-3xl ml-4">${turno.hora}</p>
            </div>
          </div>
          <div class="grid grid-cols-2">
            <div class="flex">
              <label class="text-3xl">Altura: </label>
              <p class="text-3xl ml-4">${turno.altura} cm</p>
            </div>
            <div class="flex">
              <label class="text-3xl ml-8">Peso: </label>
              <p class="text-3xl ml-4">${turno.peso} kg</p>
            </div>
          </div>
          <div class="grid grid-cols-2">
            <div class="flex">
              <label class="text-3xl">Temp: </label>
              <p class="text-3xl ml-4">${turno.temperatura}°C</p>
            </div>
            <div class="flex">
              <label class="text-3xl ml-8">Presion: </label>
              <p class="text-3xl ml-4">${turno.presion}</p>
            </div>
          </div>
        </div>
      `,
      confirmButtonText: "Mostrar reseña",
      showCancelButton: true,
      cancelButtonText: 'Aceptar',
    }).then((result) => {
      if(result.isConfirmed)
      {
        Swal.fire({
          title: `${turno.resenia}`,
        })
      }
    });
  }

}
