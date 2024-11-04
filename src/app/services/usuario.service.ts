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
      correo:e.correo, contrasenia:e.contrasenia, estado: e.estado
    });
  }

  guardarPaciente(p : IPaciente) : void
  {
    const col = collection(this.firestore, 'Pacientes');
    addDoc(col,{nombre: p.nombre, apellido:p.apellido, edad:p.edad, dni:p.dni, obraSocial:p.obraSocial,
      correo:p.correo, contrasenia:p.contrasenia,primerFoto: p.primerFoto, segundaFoto: p.segundaFoto 
    });
  }

  guardarAdmin(a : IAdmin) : void
  {
    const col = collection(this.firestore, 'Administradores');
    addDoc(col,{nombre: a.nombre, apellido:a.apellido, edad:a.edad, dni:a.dni,
      correo:a.correo, contrasenia:a.contrasenia, foto: a.foto
    });
  }

  traerEspecialistas() : Observable<IEspecialista[]>
  {
    const col = collection(this.firestore, 'Especialistas');

    return collectionData(col, { idField: 'id' }) as Observable<IEspecialista[]>
  }

  //Con este metodo lo que hacemos es buscar el correo para ver de que tipo de usuario pertenece (PARA LA AUTENTICACION)
  async buscarCorreo(correo : string) : Promise<string>
  {
    var col = collection(this.firestore, 'Especialistas');

    var queryEspecialista = query(col,where('correo','==',correo));

    var especialista = await getDocs(queryEspecialista);

    if(!especialista.empty)
    {
      return 'Especialista'
    }
    else
    {
      var col = collection(this.firestore, 'Pacientes');

      var pacienteQuery = query(col,where('correo','==',correo));

      var paciente = await getDocs(pacienteQuery);

      if(!paciente.empty)
      {
        return 'Paciente';
      }
      else{
        return 'Admin';
      }
    }

  }

  aprobarEspecialista(id : string) : void
  {
    const col = collection(this.firestore, 'Especialistas');
    const documento = doc(col,id)
    updateDoc(documento,{
      estado: "aprobado"
    });
  }

  actualizarEspecialista(especialista: IEspecialista): void
  {
    const col = collection(this.firestore, 'Especialistas');
    const documento = doc(col,especialista.id);
    updateDoc(documento,{...especialista});
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
