import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Firestore, collection,addDoc,getDoc,getDocs,updateDoc, collectionData, doc, deleteDoc, where, query } from '@angular/fire/firestore';
import { Colecciones } from '../enums/colecciones';
import { ITurno } from '../interfaces/iturno';

@Injectable({
  providedIn: 'root'
})
export class TurnosService {

  constructor(private firestore: Firestore) { }
  

  async traerTurnosPaciente(idPaciente: string)
  {
    var col = collection(this.firestore, Colecciones.TURNOS);

    var queryTurno = query(col,where('idPaciente','==',idPaciente));

    var resp = await getDocs(queryTurno);

    const turnos = resp.docs.map(doc => ({
      id: doc.id, //id del documento de firebase          
      ...doc.data()        
    }));

    return turnos;
  }

  actualizarTurno(turno: ITurno): void
  {
    const col = collection(this.firestore, Colecciones.TURNOS);
    const documento = doc(col,turno.id);
    updateDoc(documento,{...turno});
  }
}
