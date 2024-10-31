import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonEngine } from '@angular/ssr';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {

  primerFotoCargada : boolean = false;
  segundoFotoCargada : boolean = false;

  agregarInputEspecialidad() : void
  {
    var div = document.getElementById('especialidad');

    var input = document.createElement('input');
    input.type = 'text';
    input.className = 'block w-full max-w-screen-sm rounded-md border-0 mt-2 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6';
    input.placeholder = '';

    div?.appendChild(input);
  }

  onFileSelected(event: Event) : void
  {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0)   
    {
      this.primerFotoCargada = true;
    }
  }

  segundaFoto(event: Event) : void
  {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0)   
    {
      this.segundoFotoCargada = true;
    }
  }
}             
