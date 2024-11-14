import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule,FormsModule,CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  correoUsuario : string | null = null;

  auth = inject(AuthService);
  router = inject(Router)

  constructor(){
    this.auth.correoUsuario$.subscribe((data) => {
      this.correoUsuario = data;
    })
  }

  cerrarSesion() : void
  {
    this.auth.usuarioActual = null;
    this.correoUsuario = null;
    this.auth.tipoUsuario = '';
    this.router.navigateByUrl('/login');
  }

  

}
