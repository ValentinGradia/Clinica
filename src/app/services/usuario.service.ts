import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Firestore, collection,addDoc,getDoc,getDocs,updateDoc, collectionData, doc, deleteDoc, where, query } from '@angular/fire/firestore';
import { IAdmin } from '../interfaces/iadmin';
import { IEspecialista } from '../interfaces/iespecialista';
import { IPaciente } from '../interfaces/ipaciente';
import { Colecciones } from '../enums/colecciones';
import { User } from '@angular/fire/auth';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  constructor(private firestore: Firestore) {}

  guardarEspecialista(e: IEspecialista): void {
    const col = collection(this.firestore, Colecciones.ESPECIALISTAS);
    addDoc(col, {
      nombre: e.nombre,
      apellido: e.apellido,
      edad: e.edad,
      dni: e.dni,
      especialidad: e.especialidad,
      correo: e.correo,
      contrasenia: e.contrasenia,
      estado: e.estado,
    });
  }

  guardarPaciente(p: IPaciente): void {
    const col = collection(this.firestore, Colecciones.PACIENTES);
    addDoc(col, {
      nombre: p.nombre,
      apellido: p.apellido,
      edad: p.edad,
      dni: p.dni,
      obraSocial: p.obraSocial,
      correo: p.correo,
      contrasenia: p.contrasenia,
      primerFoto: p.primerFoto,
      segundaFoto: p.segundaFoto,
    });
  }

  guardarAdmin(a: IAdmin): void {
    const col = collection(this.firestore, Colecciones.ADMINISTRADORES);
    addDoc(col, {
      nombre: a.nombre,
      apellido: a.apellido,
      edad: a.edad,
      dni: a.dni,
      correo: a.correo,
      contrasenia: a.contrasenia,
      foto: a.foto,
    });
  }

  traerEspecialistas(): Observable<IEspecialista[]> {
    const col = collection(this.firestore, Colecciones.ESPECIALISTAS);

    return collectionData(col, { idField: 'id' }) as Observable<
      IEspecialista[]
    >;
  }

  aprobarEspecialista(id: string): void {
    const col = collection(this.firestore, Colecciones.ESPECIALISTAS);
    const documento = doc(col, id);
    updateDoc(documento, {
      estado: 'aprobado',
    });
  }

  actualizarEspecialista(especialista: IEspecialista): void {
    const col = collection(this.firestore, Colecciones.ESPECIALISTAS);
    const documento = doc(col, especialista.id);
    updateDoc(documento, { ...especialista });
  }

  traerPacientes(): Observable<any> {
    const col = collection(this.firestore, Colecciones.PACIENTES);
    const obvervable = collectionData(col);

    return obvervable; //hacer el subsrcribe desde el componente
  }

  traerAdmins(): Observable<any> {
    const col = collection(this.firestore, Colecciones.ADMINISTRADORES);
    const obvervable = collectionData(col);

    return obvervable; //hacer el subsrcribe desde el componente
  }
}
