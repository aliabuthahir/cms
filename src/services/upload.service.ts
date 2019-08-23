import {Injectable} from '@angular/core';
import {GalleryImageModel} from '../models/gallery-image.model';
import {AngularFireModule} from '@angular/fire';
import {AngularFireDatabase} from '@angular/fire/database';
import {FirebaseListObservable} from '@angular/fire/database-deprecated';
import * as firebase from 'firebase';
import {UploadModel} from '../models/upload.model';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private basePath = '/uploads';
  private uploads: FirebaseListObservable<GalleryImageModel[]>;

  constructor(private ngFire: AngularFireModule,
              private db: AngularFireDatabase) {
  }

  uploadFile(upload: UploadModel) {
    const storageRef = firebase.storage.ref();
    const uploadTask = storageRef
      .child(`${this.basePath}/${upload.file.name}`)
      .put(upload.file);
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      () => {

      }
    );
  }
}
