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


  constructor()
  {
    
  }

  async ngOnInit(): Promise<void> {
    this.mostrarSpinner = true;
    const resp = (await this.turnosService.traerTurnosFinalizados('Flop3kEUP22GCphjczuc'))
    resp.forEach(turno => {
      this.turnos.push(turno as ITurno);
    });
    this.mostrarSpinner = false;
  }

  seleccionarTurno(turno: ITurno) : void
  {
    
  }

}
