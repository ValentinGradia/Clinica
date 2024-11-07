import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

export const logueadoGuard: CanActivateFn = (route, state) => {
  

  var auth = inject(AuthService);


  if(auth.usuarioActual == null)
  {
    Swal.fire({
      position: "center",
      icon: "warning",
      title: "Primero debes iniciar sesion",
      showConfirmButton: true,
    });

    return false
  }
  else{return true;}
};
