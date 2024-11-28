import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fecha',
  standalone: true
})
export class FechaPipe implements PipeTransform {

  transform(date: Date): string {

    const dia = date.getDate().toString();
    const mes = date.getMonth().toString(); 
    const anio = date.getFullYear();
    const hora = date.getHours().toString();
    const minuto = date.getMinutes().toString();
    
    return `${dia}/${mes}/${anio} ${hora}:${minuto}`;
  }

}
