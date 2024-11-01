import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormsModule, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonEngine } from '@angular/ssr';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {

  primerFotoCargada : boolean = false;
  segundoFotoCargada : boolean = false;

  protected credentials !: FormGroup;

  protected credenciales !: FormGroup;

  constructor(private fb: FormBuilder){
    this.credentials = this.fb.group({
      correo: ['',[Validators.required, Validators.email]],
      contrasenia:['',[Validators.required, Validators.minLength(6)]],
      nombre: ['',[Validators.required, Validators.pattern('^[a-zA-ZÀ-ÿ\\s]+$')]],
      apellido: ['',[Validators.required, Validators.pattern('^[a-zA-ZÀ-ÿ\\s]+$')]],
      edad: ['',[Validators.required, Validators.pattern('^[0-9]+$')]],
      dni: ['',[Validators.required, Validators.pattern('^[0-9]+$')]],
      obraSocial: ['',[Validators.required, Validators.pattern('^[a-zA-ZÀ-ÿ\\s]+$')]]
    })


    this.credenciales = this.fb.group({
      Ecorreo: ['',[Validators.required, Validators.email]],
      Econtrasenia:['',[Validators.required, Validators.minLength(6)]],
      Enombre: ['',[Validators.required, Validators.pattern('^[a-zA-ZÀ-ÿ\\s]+$')]],
      Eapellido: ['',[Validators.required, Validators.pattern('^[a-zA-ZÀ-ÿ\\s]+$')]],
      Eedad: ['',[Validators.required, Validators.pattern('^[0-9]+$')]],
      Edni: ['',[Validators.required, Validators.pattern('^[0-9]+$')]],
      Eespecialidad: ['',[Validators.required]]
    })
  }

  get correo(){
    return this.credentials.get('correo');
  }

  get contrasenia(){
    return this.credentials.get('contrasenia');
  }

  get nombre(){
    return this.credentials.get('nombre');
  }

  get apellido(){
    return this.credentials.get('apellido');
  }

  get edad(){
    return this.credentials.get('edad');
  }

  get dni(){
    return this.credentials.get('dni');
  }

  get obraSocial(){
    return this.credentials.get('obraSocial');
  }

  get Ecorreo(){
    return this.credentials.get('Ecorreo');
  }

  get Econtrasenia(){
    return this.credentials.get('Econtrasenia');
  }

  get Enombre(){
    return this.credentials.get('Enombre');
  }

  get Eapellido(){
    return this.credentials.get('Eapellido');
  }

  get Eedad(){
    return this.credentials.get('Eedad');
  }

  get Edni(){
    return this.credentials.get('Edni');
  }

  get Eespecialidad(){
    return this.credentials.get('Eespecialidad');
  }


  guardarPaciente() : void
  {
    if(this.credentials.valid)
    {
      console.log(this.nombre);
    }
    else
    {
      console.log(this.nombre?.value);
      this.mostrarError();
    }
  }


  guardarEspecialista() : void
  {
    if(this.credenciales.valid)
      {
        console.log("hola");
      }
      else
      {
        this.mostrarError();
      }
  }

  mostrarError() : void
  {
    Swal.fire({
      title: "Datos incorrectos",
      text: "Complete los campos de manera correcta",
      icon: "error",
      position :"center"
    });
  }

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
