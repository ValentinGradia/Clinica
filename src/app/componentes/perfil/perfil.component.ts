import { AfterViewInit, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { IAdmin } from '../../interfaces/iadmin';
import { IPaciente } from '../../interfaces/ipaciente';
import { IEspecialista } from '../../interfaces/iespecialista';
import { Usuario } from '../../interfaces/iusuario';
import { doc } from '@angular/fire/firestore';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';
import { SpinnerComponent } from '../spinner/spinner.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [FormsModule, CommonModule, SpinnerComponent],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements AfterViewInit {

  auth = inject(AuthService);
  usuariosDB = inject(UsuarioService);
  usuario !: Usuario;
  especialistaConHorariosAlmacenados : IEspecialista | null = null;


  horarios = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'];

  constructor(){
    this.usuario = this.auth.usuarioActual!;
  }

  ngAfterViewInit(): void {
    if(this.esEspecialista(this.usuario))
      {
        this.setearHorariosAlmacenados(this.usuario);
      }
  }
  

  setearHorariosAlmacenados(usuario: IEspecialista)
  {
    if(usuario.lunes !== undefined && usuario.martes !== undefined && usuario.miercoles !== undefined && usuario.jueves !== undefined && usuario.viernes !== undefined)
    {
      usuario.lunes!.forEach(horario => {
        var input = document.getElementById(`lunes-${horario}`) as HTMLInputElement;
        input.checked = true;
      });
  
      usuario.martes!.forEach(horario => {
        var input = document.getElementById(`martes-${horario}`) as HTMLInputElement;
        input.checked = true;
      });
  
      usuario.miercoles!.forEach(horario => {
        var input = document.getElementById(`miercoles-${horario}`) as HTMLInputElement;
        input.checked = true;
      });
  
      usuario.jueves!.forEach(horario => {
        var input = document.getElementById(`jueves-${horario}`) as HTMLInputElement;
        input.checked = true;
      });
  
      usuario.viernes!.forEach(horario => {
        var input = document.getElementById(`viernes-${horario}`) as HTMLInputElement;
        input.checked = true;
      });
    }
  }

  //type guards para verificar el tipo de usuario
  esEspecialista(usuario: Usuario): usuario is IEspecialista {
    return 'especialidad' in usuario && 'estado' in usuario;
  }

  esPaciente(usuario: Usuario): usuario is IPaciente {
    return 'obraSocial' in usuario && 'primerFoto' in usuario && 'segundaFoto' in usuario;
  }

  esAdmin(usuario: Usuario): usuario is IAdmin {
    return !(this.esEspecialista(usuario) || this.esPaciente(usuario));
  }

  actualizarHorario(dia: string, horario: string) : void
  {
    this.especialistaConHorariosAlmacenados = this.usuario as IEspecialista;
    this.especialistaConHorariosAlmacenados.lunes = this.especialistaConHorariosAlmacenados.lunes || [];
    this.especialistaConHorariosAlmacenados.martes = this.especialistaConHorariosAlmacenados.martes || [];
    this.especialistaConHorariosAlmacenados.miercoles = this.especialistaConHorariosAlmacenados.miercoles || [];
    this.especialistaConHorariosAlmacenados.jueves = this.especialistaConHorariosAlmacenados.jueves || [];
    this.especialistaConHorariosAlmacenados.viernes = this.especialistaConHorariosAlmacenados.viernes || [];

    switch(dia)
    {
      case 'lunes':
        if((document.getElementById(`${dia}-${horario}`) as HTMLInputElement).checked)
        {
          this.especialistaConHorariosAlmacenados.lunes!.push(horario);
        }
        else
        {
          this.especialistaConHorariosAlmacenados.lunes = this.especialistaConHorariosAlmacenados.lunes!.filter(hora => hora !== horario);
        }
        break;
      case 'martes':
        if((document.getElementById(`${dia}-${horario}`) as HTMLInputElement).checked)
          {
            this.especialistaConHorariosAlmacenados.martes!.push(horario);
          }
          else
          {
            this.especialistaConHorariosAlmacenados.martes =  this.especialistaConHorariosAlmacenados.martes!.filter(hora => hora !== horario);
          }
        break;
      case 'miercoles':
        if((document.getElementById(`${dia}-${horario}`) as HTMLInputElement).checked)
          {
            this.especialistaConHorariosAlmacenados.miercoles!.push(horario);
          }
          else
          {
            this.especialistaConHorariosAlmacenados.miercoles = this.especialistaConHorariosAlmacenados.miercoles!.filter(hora => hora !== horario);
          }
        break;
      case 'jueves':
        if((document.getElementById(`${dia}-${horario}`) as HTMLInputElement).checked)
          {
            this.especialistaConHorariosAlmacenados.jueves!.push(horario);
          }
          else
          {
            this.especialistaConHorariosAlmacenados.jueves = this.especialistaConHorariosAlmacenados.jueves!.filter(hora => hora !== horario);
          }
        break;
      default:
        if((document.getElementById(`${dia}-${horario}`) as HTMLInputElement).checked)
          {
            this.especialistaConHorariosAlmacenados.viernes!.push(horario);
          }
          else
          {
            this.especialistaConHorariosAlmacenados.viernes = this.especialistaConHorariosAlmacenados.viernes!.filter(hora => hora !== horario);
          }
        break;
    }

  }

  guardarHorarios() : void
  {

    this.usuariosDB.actualizarEspecialista(this.especialistaConHorariosAlmacenados!);
    Swal.fire({
      icon: "success",
      title: "Horarios almacenados con exito",
      showConfirmButton: false,
      timer: 1000
    });
  }


}
