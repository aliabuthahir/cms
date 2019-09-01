import {Injectable} from '@angular/core';
import {GalleryImageModel} from '../models/gallery-image.model';
import {AngularFireModule} from '@angular/fire';
import {AngularFireDatabase} from '@angular/fire/database';
import {FirebaseListObservable} from '@angular/fire/database-deprecated';
import * as firebase from 'firebase';
import {UploadModel} from '../models/upload.model';
import {AngularFireStorage} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private basePath = '/uploads';
  private uploads: FirebaseListObservable<GalleryImageModel[]>;

  constructor(private ngFire: AngularFireModule,
              private db: AngularFireDatabase,
              private storage: AngularFireStorage) {
  }

  uploadFile(upload: UploadModel) {
//    const storageRef = firebase.storage;
    const storageRef = this.storage.ref(`${this.basePath}`);
    const uploadTask = storageRef
      .child(`/${upload.file.name}`)
      .put(upload.file);
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      snapshot => {
        // state changed observer.
        const percentage = (uploadTask
          .snapshot
          .bytesTransferred / uploadTask
          .snapshot
          .totalBytes) * 100;

        console.log(percentage);

        upload.progress.next(percentage);
      },
      // error observer.
      error => {
        console.error(error);
      },
      // success observer.
      (): any => {
        upload.url = uploadTask.snapshot.downloadURL;
        upload.name = upload.file.name;
        this.saveFileData(upload);
      }
    );
  }

  saveFileData(upload: UploadModel) {
    this.db.list(`${this.basePath}/`).push(upload);
    console.log('File savedL ' + upload.url);
  }
}
