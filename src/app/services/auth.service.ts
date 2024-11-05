import { inject, Injectable, signal } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, Unsubscribe, User, UserCredential } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject,Observable } from 'rxjs';
import { UsuarioService } from './usuario.service';
import { IAdmin } from '../interfaces/iadmin';
import { IEspecialista } from '../interfaces/iespecialista';
import { IPaciente } from '../interfaces/ipaciente';
import { Colecciones } from '../enums/colecciones';
import { Firestore, collection,addDoc,getDoc,getDocs,updateDoc, collectionData, doc, deleteDoc, where, query } from '@angular/fire/firestore';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth : Auth, private router : Router, private firestore: Firestore) {
  }

  correoUsuarioObservable = new BehaviorSubject<string | null>(null);//tipo de observable
  usuarioActual : IEspecialista | IAdmin | IPaciente | null = null;
  tipoUsuario : string = '';
  correoUsuario$ = this.correoUsuarioObservable.asObservable(); //para poder tener los metodos de un observable y exponerlo a otros componentes

  async setearCorreo(email : string)
  {
    //metodo next asigno el email al objeto
    this.correoUsuarioObservable.next(email);
    await this.buscarCorreo(email).then((data) => {
      this.usuarioActual = data;
    })
  }

  limpiarCorreo()
  {
    this.correoUsuarioObservable.next(null);
  }

  async buscarCorreo(correo: string): Promise<IEspecialista | IAdmin | IPaciente> {
    var col = collection(this.firestore, Colecciones.ESPECIALISTAS);

    var queryEspecialista = query(col, where('correo', '==', correo));

    var especialista = await getDocs(queryEspecialista);

    if (!especialista.empty) {
      this.tipoUsuario = 'Especialista';
      return especialista.docs[0].data() as IEspecialista;
    } else {
      var col = collection(this.firestore, Colecciones.PACIENTES);

      var pacienteQuery = query(col, where('correo', '==', correo));

      var paciente = await getDocs(pacienteQuery);

      if (!paciente.empty) {
        this.tipoUsuario = 'Paciente';
        return paciente.docs[0].data() as IPaciente;
      } else {
        var col = collection(this.firestore, Colecciones.ADMINISTRADORES);

        var adminQuery = query(col, where('correo', '==', correo));
  
        var admin = await getDocs(adminQuery);

        this.tipoUsuario = 'Administrador';
        return admin.docs[0].data() as IAdmin;
      }
    }
  }


  async registrarUsuario(correo : string, contrasenia : string)
  {
    try
    {
      var data = await createUserWithEmailAndPassword(this.auth,correo,contrasenia)
      return data.user;
    }
    catch(error)
    {
      return null;
    }
  }

  async loguearUsuario(correo : string, contrasenia : string) : Promise<User | null>
  {
    try
    {
      var data = await signInWithEmailAndPassword(this.auth,correo,contrasenia)
      return data.user;
    }
    catch(error)
    {
      return null;
    }

  }
}
