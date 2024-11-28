import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Usuario } from '../../interfaces/iusuario';
import { SpinnerComponent } from '../spinner/spinner.component';
import { UsuarioService } from '../../services/usuario.service';
import { IPaciente } from '../../interfaces/ipaciente';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { TurnosService } from '../../services/turnos.service';
import { ITurno } from '../../interfaces/iturno';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-seccion-usuarios',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule, SpinnerComponent],
  templateUrl: './seccion-usuarios.component.html',
  styleUrl: './seccion-usuarios.component.css'
})
export class SeccionUsuariosComponent implements OnInit {

  usuarios : IPaciente[] = [];
  usuariosService = inject(UsuarioService);
  turnosService = inject(TurnosService);

  mostrarSpinner : boolean = false;


  async ngOnInit(): Promise<void> {
    this.mostrarSpinner = !this.mostrarSpinner;
      this.usuarios = [...await this.usuariosService.obtenerPacientes()
      ];

      this.mostrarSpinner = !this.mostrarSpinner;
  }

  async descargarPDF(usuario : IPaciente) : Promise<void>
  {
    this.mostrarSpinner = !this.mostrarSpinner; 
    var turnosPaciente : ITurno[] = await this.turnosService.traerTurnosPaciente(usuario.id!) as ITurno[];
    turnosPaciente = turnosPaciente.map(turno => {
      return {
        ...turno, 
        dia: (turno.dia && turno.dia instanceof Timestamp) ? turno.dia.toDate() : turno.dia // Convertir `Timestamp` a `Date`
      } as ITurno;
    })
    var doc = new jsPDF();
    const logo = 'assets/clinica.png';
    doc.addImage(logo,'PNG',70,10,60,60);
    doc.setFontSize(30);
    doc.text(`${usuario.nombre}  ${usuario.apellido}`,50,80);
    doc.setFontSize(24);
    doc.text(`Turnos`,90,95);

    doc.setFontSize(16);
    var ejeY = 110;
    var ejeX = 10;
    for (let i = 0; i < turnosPaciente.length; i++) {

      const fecha = turnosPaciente[i].dia;

      const dia = fecha.getDate().toString().padStart(2, "0"); 
      const mes = (fecha.getMonth() + 1).toString().padStart(2, "0"); 
      const anio = fecha.getFullYear();

      doc.text(`Especialista: ${turnosPaciente[i].nombreEspecialista}, ${turnosPaciente[i].apellidoEspecialista}`,ejeX,ejeY);
      ejeY += 10;
      doc.text(`Especialidad: ${turnosPaciente[i].especialidad}`,ejeX,ejeY);
      ejeY += 10;
      if(turnosPaciente[i].resenia)
      {
        doc.text(`Reseña: ${turnosPaciente[i].resenia}`,ejeX,ejeY);
        ejeY += 10;
      }
      doc.text(`Dia: ${dia}/${mes}/${anio}`,ejeX,ejeY);
      ejeY += 10;
      doc.text(`Hora: ${turnosPaciente[i].hora}`,ejeX,ejeY);
      ejeY += 10;

      if(i == 3)
      {
        ejeX += 80;
      }
    }

    const nombrePDF = `${usuario.nombre}_${new Date().toLocaleString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false })}.PDF`;
    doc.save(nombrePDF);

    this.mostrarSpinner = !this.mostrarSpinner; 
    
  }

}
