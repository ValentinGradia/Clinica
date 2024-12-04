import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dni',
  standalone: true
})
export class DniPipe implements PipeTransform {

  transform(value: string ): string {
    const dni = value.toString();

    const dniFormateado = `${dni.slice(0, 2)}.${dni.slice(2, 5)}.${dni.slice(5, 8)}`;
    
    return dniFormateado;
  }

}
