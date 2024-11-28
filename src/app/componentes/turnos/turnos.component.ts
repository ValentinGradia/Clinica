import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import e from 'express';

@Component({
  selector: 'app-turnos',
  standalone: true,
  imports: [],
  templateUrl: './turnos.component.html',
  styleUrl: './turnos.component.css'
})
export class TurnosComponent{

  auth = inject(AuthService);
  router = inject(Router);
  
  constructor()
  {
    if(this.auth.tipoUsuario == 'Especialista')
    {
      this.router.navigateByUrl('/turnosEspecialista');
    }
    else if(this.auth.tipoUsuario == 'Paciente')
    {
      this.router.navigateByUrl('/turnosPaciente');
    }
    else{
      //this.router.navigateByUrl('/turnosAdmin');
    }
  }
}
