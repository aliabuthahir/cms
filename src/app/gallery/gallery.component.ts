import {Component, OnChanges, OnInit} from '@angular/core';
import {AngularFireStorage} from '@angular/fire/storage';
import {AngularFirestore} from '@angular/fire/firestore';
import * as firebase from 'firebase';
import {ImageModel} from '../../models/image.model';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit, OnChanges {
  images = new Array();

  constructor(private storage: AngularFireStorage,
              private db: AngularFirestore) {
  }

  ngOnInit(): void {
    this.loadImages();
  }

  ngOnChanges(): void {
    this.loadImages();
  }

  loadImages() {
/*
    let storageRef = firebase.storage().ref('new_uploads');
    storageRef.listAll().then(function(result) {
      result.items.forEach(function(imageRef) {
        // And finally display them
        imageRef.getDownloadURL().then(function(url) {
          // TODO: Display the image on the UI
          let imageModel = new ImageModel();
          imageModel.name =imageRef.name;
          imageModel.url=url;
          this.images.push(imageModel);
        }).catch((error)=> {
          // Handle any errors
        });
      });
    }).catch((error) =>{
      // Handle any errors
    });
*/
  }
  scrollHandler(event) {
    console.log('--------------');
    console.log(event);
  }
}
