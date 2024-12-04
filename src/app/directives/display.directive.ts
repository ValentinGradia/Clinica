import { Directive, ElementRef, Renderer2, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appDisplay]',
  standalone: true
})
export class DisplayDirective {

  @Input() mostrar: boolean = true;

	constructor(private el: ElementRef, private renderer: Renderer2) {}
	
	ngOnChanges(changes: SimpleChanges): void {
		if (this.mostrar) 
    {
		  this.renderer.removeStyle(this.el.nativeElement, 'display');
		} 
    else 
    {
		  this.renderer.setStyle(this.el.nativeElement, 'display', 'none');
		}
	}

}
