import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';
import { StorageService } from '../../services/storage.service';
import Swal from 'sweetalert2';
import { IPaciente } from '../../interfaces/ipaciente';

@Component({
  selector: 'app-cargar-paciente',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './cargar-paciente.component.html',
  styleUrl: './cargar-paciente.component.css'
})
export class CargarPacienteComponent {

  primerFotoCargada : boolean = false;
  segundoFotoCargada : boolean = false;

  @Output() regresar = new EventEmitter<boolean>();

  auth = inject(AuthService)
  db = inject(UsuarioService);
  storage = inject(StorageService);

  primerImagen : Blob | null = null;
  segundaImagen: Blob | null = null;

  spinner: boolean = false;

  protected credentials !: FormGroup;

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


  async guardarPaciente() : Promise<void>
  {
    if(this.credentials.valid)
    {
      this.mostrarSpinner();

      this.auth.registrarUsuario(this.correo?.value,this.contrasenia?.value);

      const primerUrl = await this.storage.subir(this.primerImagen!,`primerFoto-${this.nombre?.value}-${this.dni?.value}`);
      const segundaUrl = await this.storage.subir(this.segundaImagen!, `segundaFoto-${this.nombre?.value}-${this.dni?.value}`);

      var p : IPaciente = {
        correo : this.correo?.value,
        contrasenia: this.contrasenia?.value,
        nombre: this.nombre?.value,
        apellido: this.apellido?.value,
        dni : this.dni?.value,
        edad: this.edad?.value,
        obraSocial: this.obraSocial?.value,
        foto : primerUrl,
        segundaFoto: segundaUrl,
      }

      this.db.guardarPaciente(p);

      this.credentials.reset();
      this.primerFotoCargada = false;
      this.segundoFotoCargada = false;
      this.ocultarSpinner();
      Swal.fire({
        title: "Completado",
        text: "Paciente almacenado con exito",
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

  volver(): void
  {
    this.regresar.emit(true);
  }

  async mostrarSpinner() : Promise<void>
  {
    this.spinner = true;
  }

  async ocultarSpinner() : Promise<void>
  {
    this.spinner = false;
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


}
