import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

export const turnoGuard: CanActivateFn = (route, state) => {
  var auth = inject(AuthService);


  if(auth.tipoUsuario !== 'Administrador')
  {
    Swal.fire({
      position: "center",
      icon: "error",
      title: "No tienes acceso",
      showConfirmButton: true,
    });

    return false
  }
  else{return true;}
};
