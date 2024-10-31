import { Injectable } from '@angular/core';
import { Firestore, collection,addDoc,getDoc,getDocs,updateDoc, collectionData, doc, deleteDoc,setDoc } from '@angular/fire/firestore';
import { Storage,ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private firestore: Firestore, private storage: Storage) { }

  async subir(imagen: Blob)
  {
    const col = collection(this.firestore, '');

    const documento = doc(col);
    let empleado = {id: documento.id, nombre:'Agus', imagen}


    const storageRef = ref(this.storage, "imagenes/" + "imagen.jpg");

    await uploadBytes(storageRef, imagen);

    const url = await getDownloadURL(storageRef);

    // empleado.imagen = url

    // setDoc(documento, {...empleado})
  }
}
