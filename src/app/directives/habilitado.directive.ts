import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appHabilitado]',
  standalone: true
})
export class HabilitadoDirective {

  constructor(private el: ElementRef) {}

  @HostListener('click') onClick() {
  
    const button = this.el.nativeElement as HTMLButtonElement;
    button.disabled = true; 

    setTimeout(() => {
      button.disabled = false; 
    }, 2000);
  }

}
