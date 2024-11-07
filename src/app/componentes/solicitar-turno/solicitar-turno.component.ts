import { Component, inject, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SpinnerComponent } from '../spinner/spinner.component';
import { IEspecialista } from '../../interfaces/iespecialista';

@Component({
  selector: 'app-solicitar-turno',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SpinnerComponent],
  templateUrl: './solicitar-turno.component.html',
  styleUrl: './solicitar-turno.component.css'
})
export class SolicitarTurnoComponent implements OnInit {

  usuariosDb = inject(UsuarioService);
  auth = inject(AuthService);
  especialidades : string[] = [];
  mostrarSpinner = false;
  especialistas : IEspecialista[] = [];
  especialistasFiltrados : IEspecialista[] = [];

  especialidadSeleccionada : string | null = null;
  especialistaSeleccionado : IEspecialista | null = null;

  async ngOnInit(): Promise<void> {
    this.mostrarSpinner = true;
    //el firstValueFrom convierte el observable a una promesa
    const data = await firstValueFrom(this.usuariosDb.traerEspecialistas());
    this.especialistas = data;

    data.forEach(especialista => {
      this.especialidades.push(...especialista.especialidad);
    });
    
    this.mostrarSpinner = false;
  }

  seleccionarEspecialidad(event: Event) : void
  {
    const selectElement = event.target as HTMLSelectElement;
    this.especialidadSeleccionada = selectElement.value;

    this.filtrarEspecialistas(this.especialidadSeleccionada);
  }

  seleccionarEspecialista(event: Event) : void
  {
    
  }

  filtrarEspecialistas(especialidad : string)
  {
    this.especialistas.forEach(e => {
      if(e.especialidad.includes(especialidad))
      {
        if(!this.especialistasFiltrados.includes(e))
        {
          this.especialistasFiltrados.push(e);
        }
      }
      else
      {
        this.especialistasFiltrados = this.especialistasFiltrados.filter(especialista => especialista !== e);
      }
    });
  }

}
