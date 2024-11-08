import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

export const solicitarTurnoGuard: CanActivateFn = (route, state) => {
  var auth = inject(AuthService);


  if(auth.tipoUsuario !== 'Especialista')
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
