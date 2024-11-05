import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';
import { IEspecialista } from '../../interfaces/iespecialista';
import { FormBuilder, FormsModule, FormGroup, Validators, ReactiveFormsModule,FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { IAdmin } from '../../interfaces/iadmin';
import { SpinnerComponent } from '../spinner/spinner.component';


@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule, ReactiveFormsModule, SpinnerComponent],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit {

  fotoCargada : boolean = false;
  especialistas : Array<IEspecialista> = [];
  mostrarSpinner : boolean = false;

  foto : Blob | null = null;

  storage = inject(StorageService);
  db = inject(UsuarioService);

  protected credenciales !: FormGroup;

  constructor(private usuarios: UsuarioService, private fb: FormBuilder, private auth: AuthService){
    
    this.credenciales = this.fb.group({
      correo: ['',[Validators.required, Validators.email]],
      contrasenia:['',[Validators.required, Validators.minLength(6)]],
      nombre: ['',[Validators.required, Validators.pattern('^[a-zA-ZÀ-ÿ\\s]+$')]],
      apellido: ['',[Validators.required, Validators.pattern('^[a-zA-ZÀ-ÿ\\s]+$')]],
      edad: ['',[Validators.required, Validators.pattern('^[0-9]+$')]],
      dni: ['',[Validators.required, Validators.pattern('^[0-9]+$')]]
    })
  }

  async ngOnInit(): Promise<void> {

    this.mostrarSpinner = true;
    await this.usuarios.traerEspecialistas().subscribe((data) => {
      this.especialistas = data.filter(especialista => especialista.estado === "pendiente");
      this.mostrarSpinner = false;
    });

  }

  get correo(){
    return this.credenciales.get('correo');
  }

  get contrasenia(){
    return this.credenciales.get('contrasenia');
  }

  get nombre(){
    return this.credenciales.get('nombre');
  }

  get apellido(){
    return this.credenciales.get('apellido');
  }

  get edad(){
    return this.credenciales.get('edad');
  }

  get dni(){
    return this.credenciales.get('dni');
  }


  cargarFoto(event : any) : void
  {
    const file = event.target.files[0];
    const imagen = new Blob([file], {
      type: file.type
    });

    this.foto = imagen;

    this.fotoCargada = true;
  }

  async guardarAdmin() : Promise<void>
  {
    if(this.credenciales.valid)
      {
        this.mostrarSpinner = true;
  
        this.auth.registrarUsuario(this.correo?.value,this.contrasenia?.value);
  
        const primerUrl = await this.storage.subir(this.foto!,`foto-${this.nombre?.value}-${this.dni?.value}`);
  
  
        var a : IAdmin = {
          correo : this.correo?.value,
          contrasenia: this.contrasenia?.value,
          nombre: this.nombre?.value,
          apellido: this.apellido?.value,
          dni : this.dni?.value,
          edad: this.edad?.value,
          foto : primerUrl,
        }
  
        this.db.guardarAdmin(a);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Administrador guardado",
          showConfirmButton: false,
          timer: 1500
        });
  
        this.credenciales.reset();
        this.mostrarSpinner = false;
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


  aprobar(especialista: IEspecialista) : void
  {
    this.usuarios.aprobarEspecialista(especialista.id!);
    this.auth.registrarUsuario(especialista.correo,especialista.contrasenia);
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Especialista aprobado",
      showConfirmButton: false,
      timer: 1500
    });
  }

  rechazar(especialista : IEspecialista) : void
  {
    especialista.estado = "rechazado";
    this.usuarios.actualizarEspecialista(especialista);
  }

}
