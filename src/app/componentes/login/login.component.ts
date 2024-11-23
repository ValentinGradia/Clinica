import { CommonModule } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  usuariosService = inject(UsuarioService);

  constructor(private auth : AuthService, private router: Router){}

  correo !: string;
  contrasenia !: string;
  userMenuVisible : boolean = false;
  users = [
    {
      contrasenia: "10101010",
      correo: "marianfer@gmail.com",
      foto : "https://firebasestorage.googleapis.com/v0/b/clinica-17f36.appspot.com/o/imagenes%2Ffoto-marian-3232.jpg?alt=media&token=b38d7b2e-4a8d-4b95-95ff-6a21044d4af1",
    },
    {
      contrasenia: "777777",
      correo: "raul@gmail.com",
      foto : "https://firebasestorage.googleapis.com/v0/b/clinica-17f36.appspot.com/o/imagenes%2FFoto-Raul-905478.jpg?alt=media&token=70687b2d-1ba3-40fb-8668-2b80317354b5",
    },
    {
      contrasenia: "222222",
      correo: "especialista@especialista.com",
      foto : "https://firebasestorage.googleapis.com/v0/b/clinica-17f36.appspot.com/o/imagenes%2FFoto-Eusebio-456789.jpg?alt=media&token=a3385fcd-064e-4b74-9334-9ae8806fd4e8",
    },
    {
      contrasenia: "123456",
      correo: "vg@gmail.com",
      foto : "https://firebasestorage.googleapis.com/v0/b/clinica-17f36.appspot.com/o/imagenes%2FprimerFoto-Valentin-4709750.jpg?alt=media&token=c3d00647-bfb3-4755-8d67-acb070bbfea8",
    },
    {
      contrasenia: "000000",
      correo: "defe@gmail.com",
      foto : "https://firebasestorage.googleapis.com/v0/b/clinica-17f36.appspot.com/o/imagenes%2FprimerFoto-Gustavo-46296402.jpg?alt=media&token=127c9ff5-bc5b-4833-84fc-155c235e7030",
    }
  ];

  spinner : boolean = false;


  async iniciar() : Promise<void>
  {
    this.spinner = !this.spinner;
    try
    {
      var userCredential = await this.auth.loguearUsuario(this.correo,this.contrasenia);
      if(userCredential == null)
      {
        throw new Error("Usuario no existente");
      }
      await this.auth.setearCorreo(this.correo);

      this.usuariosService.guardarUsuario(this.auth.usuarioActual!);
      this.spinner = !this.spinner;
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

  mostrarMenu() : void
  {
    this.userMenuVisible = !this.userMenuVisible;
  }

  seleccionarUser(correo: string, contrasenia : string) :void
  {

    this.correo = correo;
    this.contrasenia = contrasenia;
  }

}
