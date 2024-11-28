import { AfterViewInit, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { IAdmin } from '../../interfaces/iadmin';
import { IPaciente } from '../../interfaces/ipaciente';
import { IEspecialista } from '../../interfaces/iespecialista';
import { Usuario } from '../../interfaces/iusuario';
import { doc, Timestamp } from '@angular/fire/firestore';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';
import { SpinnerComponent } from '../spinner/spinner.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf';
import { TurnosService } from '../../services/turnos.service';
import { ITurno } from '../../interfaces/iturno';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, SpinnerComponent],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements AfterViewInit {

  auth = inject(AuthService);
  usuariosDB = inject(UsuarioService);
  turnosService = inject(TurnosService);
  usuario !: Usuario;

  mostrarSpinner : boolean = false;

  protected credentials !: FormGroup;
  especialistaConHorariosAlmacenados : IEspecialista | null = null;


  horarios = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'];

  constructor(){
    this.usuario = this.auth.usuarioActual!;
  }

  get altura(){
    return this.credentials.get('altura');
  }

  get peso(){
    return this.credentials.get('peso');
  }

  get temperatura(){
    return this.credentials.get('temperatura');
  }

  get presion(){
    return this.credentials.get('presion');
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
    return 'obraSocial' in usuario && 'foto' in usuario && 'segundaFoto' in usuario;
  }

  esAdmin(usuario: Usuario): usuario is IAdmin {
    return !(this.esEspecialista(usuario) || this.esPaciente(usuario));
  }

  async descargarHistoriasClinicas() : Promise<void>
  {
    this.mostrarSpinner = !this.mostrarSpinner; 
    var turnosPaciente : ITurno[] = await this.turnosService.traerTurnosPaciente(this.usuario.id!) as ITurno[];
    turnosPaciente = turnosPaciente.map(turno => {
      
      return {
        ...turno, 
        dia: (turno.dia && turno.dia instanceof Timestamp) ? turno.dia.toDate() : turno.dia 
      } as ITurno;
    }).filter(turno => turno.estado == 'finalizado');

    var doc = new jsPDF();
    const logo = 'assets/clinica.png';
    doc.addImage(logo,'PNG',70,10,60,60);
    doc.setFontSize(30);
    doc.text(`Historias clinicas`,50,80);
    var ejeY = 95;
    var ejeX = 10;
    for (let i = 0; i < turnosPaciente.length; i++) {
      const fecha = turnosPaciente[i].dia;
      const dia = fecha.getDate().toString().padStart(2, "0"); 
      const mes = (fecha.getMonth() + 1).toString().padStart(2, "0"); 
      const anio = fecha.getFullYear();
      doc.setFontSize(22);
      doc.text(`Turno realizado el ${dia}/${mes}/${anio} a las ${turnosPaciente[i].hora}`,ejeX,ejeY);
      ejeY += 20;
      doc.setFontSize(16);
      doc.text(`Altura: ${turnosPaciente[i].altura}`,ejeX,ejeY);
      ejeY += 10;
      doc.text(`Peso: ${turnosPaciente[i].peso}`,ejeX,ejeY);
      ejeY += 10;
      doc.text(`Temperatura: ${turnosPaciente[i].temperatura}°C`,ejeX,ejeY);
      ejeY += 10;
      doc.text(`Presion: ${turnosPaciente[i].presion}`,ejeX,ejeY);
      ejeY += 10;
      if(turnosPaciente[i].primerDatoDinamico)
      {
        doc.text(`${Object.keys(turnosPaciente[i].primerDatoDinamico!)[0]}: ${Object.values(turnosPaciente[i].primerDatoDinamico!)[0]}`,ejeX,ejeY);
        ejeY += 10;
      }

      if(turnosPaciente[i].segundoDatoDinamico)
      {
        doc.text(`${Object.keys(turnosPaciente[i].segundoDatoDinamico!)[0]}: ${Object.values(turnosPaciente[i].segundoDatoDinamico!)[0]}`,ejeX,ejeY);
        ejeY += 10;
      }

      if(turnosPaciente[i].tercerDatoDinamico)
      {
        doc.text(`${Object.keys(turnosPaciente[i].tercerDatoDinamico!)[0]}: ${Object.values(turnosPaciente[i].tercerDatoDinamico!)[0]}`,ejeX,ejeY);
        ejeY += 10;
      }

      if(i % 2 !== 0)
      {
        doc.addPage();
      }
    }

    const nombrePDF = `${this.usuario.nombre}_${new Date().toLocaleString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false })}.PDF`;
    doc.save(nombrePDF);

    this.mostrarSpinner = !this.mostrarSpinner; 
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
