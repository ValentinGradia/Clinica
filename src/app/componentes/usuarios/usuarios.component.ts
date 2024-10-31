import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { IEspecialista } from '../../interfaces/iespecialista';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit {

  fotoCargada : boolean = false;
  especialistas : Array<IEspecialista> = [];
  mostrarSpinner : boolean = false;

  constructor(private usuarios: UsuarioService){}

  async ngOnInit(): Promise<void> {
    this.mostrarSpinner = true;
    await this.usuarios.traerEspecialistas(true).subscribe((data) => {
      this.especialistas = data;
      this.mostrarSpinner = false;
    });

  }


  cargarFoto(event : Event) : void
  {

  }


  aprobar(especialista: any) : void
  {

  }

}
