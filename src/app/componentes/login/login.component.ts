import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(private auth : AuthService, private router: Router){}

  correo !: string;
  contrasenia !: string;

  spinner : boolean = false;

  completarDatos(tipo : string) : void
  {
    if(tipo == 'usuario')
    {
      this.correo = 'paciente@paciente.com';
      this.contrasenia = '111111';
    }
    else if(tipo == 'especialista')
    {
      this.correo = 'especialista@especialista.com';
      this.contrasenia = '222222';
    }
    else{
      this.correo = 'admin@admin.com';
      this.contrasenia = '333333';
    }
  }


  async iniciar() : Promise<void>
  {
    this.spinner = true;
    try
    {
      var userCredential = await this.auth.loguearUsuario(this.correo,this.contrasenia);
      if(userCredential == null)
      {
        throw new Error("Usuario no existente");
      }
      await this.auth.setearCorreo(this.correo);
      this.spinner = false;
      Swal.fire({
        icon: "success",
        title: "Sesion iniciada con exito",
        showConfirmButton: false,
        timer: 1500
      });
      this.router.navigateByUrl('/inicio');
    }
    catch(error : any)
    {
      this.spinner = false;
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message
      });
    }
  }

}
