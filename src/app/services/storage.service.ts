import { Injectable } from '@angular/core';
import { Firestore, collection,addDoc,getDoc,getDocs,updateDoc, collectionData, doc, deleteDoc,setDoc } from '@angular/fire/firestore';
import { Storage,ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private firestore: Firestore, private storage: Storage) { }

  async subir(imagen: Blob, nombreImagen: string) : Promise<string>
  {

    const storageRef = ref(this.storage, "imagenes/" + `${nombreImagen}.jpg`);

    await uploadBytes(storageRef, imagen);

    const url = await getDownloadURL(storageRef);

    return url;
  }
}
