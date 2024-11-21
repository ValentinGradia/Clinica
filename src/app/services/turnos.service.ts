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

  async traerTurnosEspecialista(idEspecialista: string)
  {
    var col = collection(this.firestore, Colecciones.TURNOS);

    var queryTurno = query(col,where('idEspecialista','==',idEspecialista));

    var resp = await getDocs(queryTurno);

    const turnos = resp.docs.map(doc => ({
      id: doc.id,          
      ...doc.data()        
    }));

    return turnos;
  }

  actualizarTurno(turno: ITurno): void
  {
    const col = collection(this.firestore, Colecciones.TURNOS);
    const documento = doc(col,turno.id);
    if(turno.primerDatoDinamico && turno.segundoDatoDinamico && turno.tercerDatoDinamico)
    {

      const plainObject = Object.fromEntries(turno.primerDatoDinamico!);
      const plainObject2 = Object.fromEntries(turno.segundoDatoDinamico!);
      const plainObject3 = Object.fromEntries(turno.tercerDatoDinamico!);

      const turnoActualizado = {
        ...turno,
        primerDatoDinamico: plainObject,
        segundoDatoDinamico: plainObject2,
        tercerDatoDinamico: plainObject3
      }
      updateDoc(documento,turnoActualizado);
    }
    else
    {

      updateDoc(documento,{...turno});
    }
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
      dia: turno.dia,
      hora: turno.hora
    });
  }
}
