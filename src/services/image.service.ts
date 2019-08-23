import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {GalleryImageModel} from '../models/gallery-image.model';

import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFireDatabase} from '@angular/fire/database';
import 'firebase/storage';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private uid: string;

  constructor(private afAuth: AngularFireAuth, private db: AngularFireDatabase) {
    this.afAuth.authState.subscribe(auth => {
      if (auth !== undefined && auth !== null) {
        this.uid = auth.uid;
      }
    });
  }

  getImages(): Observable<GalleryImageModel[]> {
    let result: Observable<GalleryImageModel[][]>;
    result = this.db
      .list<GalleryImageModel[]>('/uploads')
      .valueChanges();
    let data: Observable<GalleryImageModel[]>;
    [data] = result[0];
    return data;
  }

  getImage(key: string) {
    return firebase.database()
      .ref('/uploads' + key)
      .once('value')
      .then(snap => snap.val());
  }
}
