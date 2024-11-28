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
import jsPDF from 'jspdf';

@Component({
  selector: 'app-turnos-por-especialidad',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule, SpinnerComponent],
  templateUrl: './turnos-por-especialidad.component.html',
  styleUrl: './turnos-por-especialidad.component.css'
})
export class TurnosPorEspecialidadComponent {

  turnosService = inject(TurnosService);
  turnos : ITurno[] = [];
  mostrarSpinner : boolean = false;
  chart : Chart | null = null;

  @ViewChild('barras') barras!: ElementRef<HTMLCanvasElement>;

  async ngOnInit(): Promise<void> {
    this.mostrarSpinner = true;
    const resp = await firstValueFrom(this.turnosService.traerTurnos());
    this.turnos = resp;

    this.turnos = this.turnos.map(turno => {
      return {
        ...turno, 
        dia: (turno.dia && turno.dia instanceof Timestamp) ? turno.dia.toDate() : turno.dia // Convertir `Timestamp` a `Date`
      } as ITurno;
    })

    const especialidadesUnicas = Array.from(new Set(this.turnos.map(turno => turno.especialidad)));

    const valores : number[] = [];

    especialidadesUnicas.forEach(especialidad => {
      var turnos = this.turnos.filter(turno => turno.especialidad == especialidad);
      valores.push(turnos.length);
    });

    const context = this.barras.nativeElement.getContext('2d');
    this.chart = new Chart(
      context!,
      {
        type: 'bar',
        data: {
          labels: especialidadesUnicas,
          datasets: [{
            label: 'Turnos',
            data: valores,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 205, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(201, 203, 207, 0.2)'
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              ,'rgb(75, 192, 192)',
              'rgb(54, 162, 235)',
              'rgb(153, 102, 255)',
              'rgb(201, 203, 207)'
            ],
            borderWidth: 1
          }]
        },
        options : {
          maintainAspectRatio: false, 
          responsive: true, 
          scales : {
            y: {
              beginAtZero: true, 
              ticks: {
                stepSize: 1,
              }
            }
          }
        }
      }
    );

    this.mostrarSpinner = false;
  }

  async descargarGraficoPDF() {
    const doc = new jsPDF();
    
    const imgData = this.chart!.toBase64Image();
    doc.setFontSize(22);
    doc.text('Gráfico de turnos por especialidad', 10, 120);
    
    doc.addImage(imgData, 'PNG', 10, 10, 180, 100);
    
    
    const nombrePDF = `grafico_especialidad_${new Date().toLocaleString('es-ES')}.pdf`;
    doc.save(nombrePDF);
  }

}
