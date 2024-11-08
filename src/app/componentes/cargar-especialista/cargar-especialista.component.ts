import { Component, EventEmitter, inject, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';
import { StorageService } from '../../services/storage.service';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { IEspecialista } from '../../interfaces/iespecialista';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-cargar-especialista',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './cargar-especialista.component.html',
  styleUrl: './cargar-especialista.component.css'
})
export class CargarEspecialistaComponent {

  tercerFotoCargada : boolean = false;

  @Output() regresar = new EventEmitter<boolean>();

  auth = inject(AuthService)
  db = inject(UsuarioService);
  storage = inject(StorageService);

  tercerImagen: Blob | null = null;

  inputsCreadosEspecialidades: { control: FormControl; className: string; placeholder: string }[] = [];

  spinner: boolean = false;

  protected credenciales !: FormGroup;

  constructor(private fb: FormBuilder)
  {
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

  get Ecorreo(){
    return this.credenciales.get('Ecorreo');
  }

  get Econtrasenia(){
    return this.credenciales.get('Econtrasenia');
  }

  get Enombre(){
    return this.credenciales.get('Enombre');
  }

  get Eapellido(){
    return this.credenciales.get('Eapellido');
  }

  get Eedad(){
    return this.credenciales.get('Eedad');
  }

  get Edni(){
    return this.credenciales.get('Edni');
  }

  get Eespecialidad(){
    return this.credenciales.get('Eespecialidad');
  }

  async guardarEspecialista() : Promise<void>
  {
    if(this.credenciales.valid)
      {


        this.mostrarSpinner();
  
        const tercerUrl =  await this.storage.subir(this.tercerImagen!,`Foto-${this.Enombre?.value}-${this.Edni?.value}`);
  

        var especialidades = this.inputsCreadosEspecialidades.map(input => input.control.value);
        especialidades.push(this.Eespecialidad?.value);
  
        var e : IEspecialista = {
          correo : this.Ecorreo?.value,
          contrasenia: this.Econtrasenia?.value,
          nombre: this.Enombre?.value,
          apellido: this.Eapellido?.value,
          dni : this.Edni?.value,
          edad: this.Eedad?.value,
          estado : "pendiente",
          especialidad : especialidades,
          foto : tercerUrl
        }

        this.db.guardarEspecialista(e);
  
        this.credenciales.reset();
        this.tercerFotoCargada = false;
        this.ocultarSpinner();
        Swal.fire({
          title: "Completado",
          text: "Especialista almacenado con exito",
          icon: "success",
          position :"center",
          timer : 1500
        });
      }
      else
      {
        this.mostrarError();
      }
  }

  volver() : void
  {
    this.regresar.emit(true);
  }

  agregarInputEspecialidad() : void
  {

    const nuevoControl = new FormControl('');

    this.credenciales.addControl(`Eespecialidad${this.inputsCreadosEspecialidades.length}`, nuevoControl);


    const nuevoInput = {
      control: nuevoControl,
      className: 'block w-full max-w-screen-sm rounded-md border-0 mt-2 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6',
      placeholder: 'Ingrese una especialidad'
    };

    this.inputsCreadosEspecialidades.push(nuevoInput);
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

  onFileSelected(event: any, select : string) : void
  {
    const file = event.target.files[0];
      const imagen = new Blob([file], {
        type: file.type
      });

      this.tercerFotoCargada = true;
      this.tercerImagen = imagen;
      
    
  }

  async mostrarSpinner() : Promise<void>
  {
    this.spinner = true;
  }

  async ocultarSpinner() : Promise<void>
  {
    this.spinner = false;
  }


}
