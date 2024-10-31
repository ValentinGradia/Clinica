import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Firestore, collection,addDoc,getDoc,getDocs,updateDoc, collectionData, doc, deleteDoc, where, query } from '@angular/fire/firestore';
import { IAdmin } from '../interfaces/iadmin';
import { IEspecialista } from '../interfaces/iespecialista';
import { IPaciente } from '../interfaces/ipaciente';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private firestore: Firestore) { }

  guardarEspecialista(e : IEspecialista) : void
  {
    const col = collection(this.firestore, 'Especialistas');
    addDoc(col,{nombre: e.nombre, apellido:e.apellido, edad:e.edad, dni:e.dni, especialidad:e.especialidad,
      correo:e.correo, contrasenia:e.contrasenia, aprobado: false //aca iria la imagen
    });
  }

  guardarPaciente(p : IPaciente) : void
  {
    const col = collection(this.firestore, 'Pacientes');
    addDoc(col,{nombre: p.nombre, apellido:p.apellido, edad:p.edad, dni:p.dni, obraSocial:p.obraSocial,
      correo:p.correo, contrasenia:p.contrasenia, //aca iria la imagen
    });
  }

  guardarAdmin(a : IAdmin) : void
  {
    const col = collection(this.firestore, 'Administradores');
    addDoc(col,{nombre: a.nombre, apellido:a.apellido, edad:a.edad, dni:a.dni,
      correo:a.correo, contrasenia:a.contrasenia //aca iria la imagen
    });
  }

  traerEspecialistas(noAprobados: boolean) : Observable<IEspecialista[]>
  {
    const col = collection(this.firestore, 'Especialistas');

    const especialistas = noAprobados ? query(col,where('aprobado','==',false)) : col;

    return collectionData(especialistas, { idField: 'id' }) as Observable<IEspecialista[]>
  }

  traerPacientes() : Observable<any>
  {
    const col = collection(this.firestore, 'Pacientes');
    const obvervable = collectionData(col);
    

    return obvervable; //hacer el subsrcribe desde el componente
  }

  traerAdmins() : Observable<any>
  {
    const col = collection(this.firestore, 'Administradores');
    const obvervable = collectionData(col);
    

    return obvervable; //hacer el subsrcribe desde el componente
  }
}
