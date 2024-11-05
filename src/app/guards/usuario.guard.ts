import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

export const usuarioGuard: CanActivateFn = (route, state) => {

  var auth = inject(AuthService);


  if(auth.tipoUsuario !== 'Administrador')
  {
    Swal.fire({
      position: "center",
      icon: "warning",
      title: "Solo los administradores pueden acceder a la seccion de usuarios",
      showConfirmButton: true,
    });

    return false
  }
  else{return true;}
};
