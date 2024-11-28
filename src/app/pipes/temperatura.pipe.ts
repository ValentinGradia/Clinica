import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'temperatura',
  standalone: true
})
export class TemperaturaPipe implements PipeTransform {

  transform(value: string): unknown {
    
    return `${value} °C`;
  }

}
