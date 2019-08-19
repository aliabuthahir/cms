import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {GalleryImageModel} from '../models/gallery-image.model';

import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFireDatabase} from '@angular/fire/database';
import 'firebase/storage';

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
    let result: Observable<unknown[]>;
    result = this.db
      .list('/uploads').valueChanges();
    let data: Observable<GalleryImageModel[]>;
    [data] = result[0];
    return data;
  }
}
