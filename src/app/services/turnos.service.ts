import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Firestore, collection,addDoc,getDoc,getDocs,updateDoc, collectionData, doc, deleteDoc, where, query } from '@angular/fire/firestore';
import { Colecciones } from '../enums/colecciones';
import { ITurno } from '../interfaces/iturno';
import { EstadoTurno } from '../enums/estadoTurno';

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

  async traerTurnosEspecialista(idEspecialista: string) : Promise<ITurno[]>
  {
    var col = collection(this.firestore, Colecciones.TURNOS);

    var queryTurno = query(col,where('idEspecialista','==',idEspecialista));

    var resp = await getDocs(queryTurno);

    const turnos = resp.docs.map(doc => ({
      id: doc.id,          
      ...doc.data()        
    }));

    return turnos as ITurno[];
  }

  actualizarTurno(turno: ITurno): void
  {
    const col = collection(this.firestore, Colecciones.TURNOS);
    const documento = doc(col,turno.id);

    updateDoc(documento,{...turno});
    
  }


  async traerTurnosFinalizados(idEspecialista: string)
  {
    var col = collection(this.firestore, Colecciones.TURNOS);

    var queryTurno = query(
      col,
      where('idEspecialista', '==', idEspecialista),
      where('historiaClinica', '==', true)
    );

    var resp = await getDocs(queryTurno);

    const turnos = resp.docs.map(doc => ({
      id: doc.id,          
      ...doc.data()        
    }));

    return turnos;
  }

  traerTurnos(): Observable<ITurno[]> {
    const col = collection(this.firestore, Colecciones.TURNOS);
    const obvervable = collectionData(col);

    return obvervable; 
  }

  agregarTurno(turno : ITurno) : void
  {
    const col = collection(this.firestore, Colecciones.TURNOS);
    addDoc(col, {
      idPaciente: turno.idPaciente, 
      idEspecialista: turno.idEspecialista,
      especialidad: turno.especialidad,
      estado: turno.estado,
      nombreEspecialista: turno.nombreEspecialista,
      apellidoEspecialista: turno.apellidoEspecialista,
      nombrePaciente: turno.nombrePaciente,
      fotoPaciente: turno.fotoPaciente,
      dia: turno.dia,
      hora: turno.hora
    });
  }
}
