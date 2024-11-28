import { Injectable } from '@angular/core';
import { observable, Observable } from 'rxjs';
import { Firestore, collection,addDoc,getDoc,getDocs,updateDoc, collectionData, doc, deleteDoc, where, query } from '@angular/fire/firestore';
import { IAdmin } from '../interfaces/iadmin';
import { IEspecialista } from '../interfaces/iespecialista';
import { IPaciente } from '../interfaces/ipaciente';
import { Colecciones } from '../enums/colecciones';
import { Usuario } from '../interfaces/iusuario';

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
      foto: e.foto
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
      foto: p.foto,
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

  guardarUsuario(a: Usuario): void {
    const col = collection(this.firestore, Colecciones.INGRESOS);
    addDoc(col, {
      nombre: a.nombre,
      apellido: a.apellido,
      edad: a.edad,
      dni: a.dni,
      correo: a.correo,
      ingreso : Date.now()
    });
  }

  traerEspecialistasAprobados(): Observable<IEspecialista[]> {
    const col = collection(this.firestore, Colecciones.ESPECIALISTAS);

    const especialistaQuery = query(col,(where('estado','==','aprobado')));

    return collectionData(especialistaQuery, { idField: 'id' }) as Observable<
      IEspecialista[]
    >;
  }


  traerEspecialistasPendientes(): Observable<IEspecialista[]> {
    const col = collection(this.firestore, Colecciones.ESPECIALISTAS);

    const especialistaQuery = query(col,(where('estado','==','pendiente')));

    return collectionData(especialistaQuery, { idField: 'id' }) as Observable<
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

  async obtenerPacientes(): Promise<IPaciente[]> {
    const col = collection(this.firestore, Colecciones.PACIENTES);

    const resp = await getDocs(col);

    const pacientes =  resp.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return pacientes as IPaciente[];
  }

  async traerEsepecialistas(): Promise<IEspecialista[]> {
    const col = collection(this.firestore, Colecciones.ESPECIALISTAS);

    const resp = await getDocs(col);

    const especialistas =  resp.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return especialistas as IEspecialista[];
  }

  
  async traerEspecialista(id : string): Promise<IEspecialista> {
    const col = collection(this.firestore, Colecciones.ESPECIALISTAS);

    const especialistaQuery = query(col,(where('id','==',id)));

    const querySnapshot = await getDocs(especialistaQuery);

    const especialista : IEspecialista = querySnapshot.docs[0].data() as IEspecialista;

    return especialista;
  }

  async traerAdmins(): Promise<IAdmin[]> {
    const col = collection(this.firestore, Colecciones.ADMINISTRADORES);

    const resp = await getDocs(col);

    const admins =  resp.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return admins as IAdmin[];
  }

  traerIngresos(): Observable<Usuario[]> {
    const col = collection(this.firestore, Colecciones.INGRESOS);
    const obvervable = collectionData(col);

    return obvervable; 
  }
 
}
