import { Directive, ElementRef, HostListener, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appBoton]',
  standalone: true
})
export class BotonDirective implements OnInit{

  @Input() colorHover : string = '';
  @Input() colorDefault: string = '';
  
  constructor(private elemento: ElementRef, private renderer: Renderer2) {
   }

   ngOnInit(): void {
      this.elemento.nativeElement.style.backgroundColor = this.colorDefault;
   }

  @HostListener('mouseenter') onMouseEnter() {
    this.renderer.setStyle(this.elemento.nativeElement, 'cursor', 'pointer');
    this.elemento.nativeElement.style.backgroundColor = this.colorHover;
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.renderer.setStyle(this.elemento.nativeElement, 'cursor', 'pointer');
    this.elemento.nativeElement.style.backgroundColor = this.colorDefault;
  }

}
