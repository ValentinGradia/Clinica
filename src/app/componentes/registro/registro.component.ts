import { CommonModule } from '@angular/common';
import { Component, input, Input } from '@angular/core';
import { FormBuilder, FormsModule, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonEngine } from '@angular/ssr';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';
import { IPaciente } from '../../interfaces/ipaciente';
import { StorageService } from '../../services/storage.service';
import { IEspecialista } from '../../interfaces/iespecialista';


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

  primerImagen : Blob | null = null;
  segundaImagen: Blob | null = null;
  tercerImagen: Blob | null = null;

  inputsCreadosEspecialidades: { value: string; className: string; placeholder: string }[] = [];

  spinner: boolean = false;

  protected credentials !: FormGroup;

  protected credenciales !: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private db: UsuarioService, private storage: StorageService){
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


  async guardarPaciente() : Promise<void>
  {
    if(this.credentials.valid)
    {
      this.mostrarSpinner();

      this.auth.registrarUsuario(this.correo?.value,this.contrasenia?.value);

      const primerUrl = this.storage.subir(this.primerImagen!,`primerFoto-${this.nombre?.value}-${this.dni?.value}`);
      const segundaUrl = this.storage.subir(this.segundaImagen!, `segundaFoto-${this.nombre?.value}-${this.dni?.value}`);

      await primerUrl;
      await segundaUrl;

      var p : IPaciente = {
        correo : this.correo?.value,
        contrasenia: this.contrasenia?.value,
        nombre: this.nombre?.value,
        apellido: this.apellido?.value,
        dni : this.dni?.value,
        edad: this.edad?.value,
        obraSocial: this.obraSocial?.value,
        primerFoto : primerUrl,
        segundaFoto: segundaUrl,
      }

      this.db.guardarPaciente(p);

      this.credentials.reset();
      this.ocultarSpinner();
    }
    else
    {
      this.mostrarError();
    }
  }


  async guardarEspecialista() : Promise<void>
  {

    var especialidades = this.inputsCreadosEspecialidades.map(input => input.value);
    console.log(especialidades);

    if(this.credenciales.valid)
      {
        this.mostrarSpinner();
  
        // const tercerUrl = this.storage.subir(this.primerImagen!,`Foto-${this.nombre?.value}-${this.dni?.value}`);
  
        // await tercerUrl;

        var especialidades = this.inputsCreadosEspecialidades.map(input => input.value);
  
        // var e : IEspecialista = {
        //   correo : this.correo?.value,
        //   contrasenia: this.contrasenia?.value,
        //   nombre: this.nombre?.value,
        //   apellido: this.apellido?.value,
        //   dni : this.dni?.value,
        //   edad: this.edad?.value,
        //   foto : tercerUrl,
        // }
        console.log(especialidades);
        //this.db.guardarEspecialista(e);
  
        this.credentials.reset();
        this.ocultarSpinner();
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
    const nuevoInput = {
      value: '',  
      className: 'block w-full max-w-screen-sm rounded-md border-0 mt-2 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6',
      placeholder: 'Ingrese una especialidad'
    };

    this.inputsCreadosEspecialidades.push(nuevoInput);
  }

  onFileSelected(event: any, select : string) : void
  {
    const file = event.target.files[0];
      const imagen = new Blob([file], {
        type: file.type
      });

      if(select == 'primera')
      {
        this.primerFotoCargada = true;
        this.primerImagen = imagen;
      }
      else if(select == 'segunda')
      {
        this.segundoFotoCargada = true;
        this.segundaImagen = imagen;
      }
    
  }

  async mostrarSpinner() : Promise<void>
  {
    this.spinner = true;
  }

  async ocultarSpinner() : Promise<void>
  {
    this.spinner = false;
  }

  segundaFoto(event: any) : void
  {
    const file = event.target.files[0];
    const imagen = new Blob([file], {
      type: file.type
    });

    this.segundaImagen = imagen;

    this.segundoFotoCargada = true;

    console.log(this.segundoFotoCargada);
    
  }
}             
