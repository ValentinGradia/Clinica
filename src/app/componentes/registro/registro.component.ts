import { CommonModule } from '@angular/common';
import { Component, input, Input } from '@angular/core';
import { FormBuilder, FormsModule, FormGroup, Validators, ReactiveFormsModule,FormControl } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonEngine } from '@angular/ssr';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';
import { IPaciente } from '../../interfaces/ipaciente';
import { StorageService } from '../../services/storage.service';
import { IEspecialista } from '../../interfaces/iespecialista';
import { BienvenidaComponent } from "../bienvenida/bienvenida.component";
import { CargarPacienteComponent } from "../cargar-paciente/cargar-paciente.component";
import { CargarEspecialistaComponent } from '../cargar-especialista/cargar-especialista.component';
import { BlobOptions } from 'buffer';


@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule, ReactiveFormsModule, CargarPacienteComponent, CargarEspecialistaComponent],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {

  regreso : boolean = false;

  usuarioSeleccionado : 'Paciente' | 'Especialista' | null = null;


  cargarEspecialista() : void
  {
    this.regreso = false;
    this.usuarioSeleccionado = 'Especialista'
  }

  cargarPaciente() : void
  {
    this.regreso = false;
    this.usuarioSeleccionado = 'Paciente';
  }

  verificarRegreso(e: boolean) : void
  {
    this.regreso = true;
  }
}             
