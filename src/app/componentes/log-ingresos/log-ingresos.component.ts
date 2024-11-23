import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
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
import Chart from 'chart.js/auto';
import { firstValueFrom } from 'rxjs';
import { Usuario } from '../../interfaces/iusuario';

@Component({
  selector: 'app-log-ingresos',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule, SpinnerComponent],
  templateUrl: './log-ingresos.component.html',
  styleUrl: './log-ingresos.component.css'
})
export class LogIngresosComponent implements OnInit{

  mostrarSpinner : boolean = false;
  ingresos : Usuario[] = [];
  usuariosService = inject(UsuarioService);

  async ngOnInit(): Promise<void> {
      this.mostrarSpinner = true;
      this.ingresos = await firstValueFrom(this.usuariosService.traerIngresos());

      this.ingresos = this.ingresos.map(usuario => {
        return {
          ...usuario, 
          ingreso: new Date(usuario.ingreso!)
        } as Usuario;
      })
      this.mostrarSpinner = false;
  }
}
