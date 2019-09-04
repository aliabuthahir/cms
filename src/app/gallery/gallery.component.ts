import {Component, OnChanges, OnInit} from '@angular/core';
import {ImageService} from '../../services/image.service';
import {Observable, Subscription} from 'rxjs';
import {GalleryImageModel} from '../../models/gallery-image.model';
import {AngularFireStorage} from "@angular/fire/storage";
import {AngularFirestore} from "@angular/fire/firestore";
import * as firebase from "firebase";
import {AngularFireDatabase} from "@angular/fire/database";

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit, OnChanges {
  images: Observable<GalleryImageModel[]>;

  constructor(private imageSvc: ImageService,
              private storage: AngularFireStorage,
              private db: AngularFirestore) {
  }

  ngOnInit(): void {
    var storageRef =     firebase.storage().ref('uploads');

    var childref = storageRef.child('uploads')
      .listAll().then(function(result) {
        result.items.forEach(function(imageRef) {
          // And finally display them
          console.log('child ref---------');
          console.log(imageRef);
          displayImage(imageRef);
        });
      }).catch(function(error) {
        // Handle any errors
      });

// Now we get the references of these images
    storageRef.listAll().then(function(result) {
      result.items.forEach(function(imageRef) {
        // And finally display them
        console.log('image ref---------');
        console.log(imageRef.name);
        displayImage(imageRef);
      });
    }).catch(function(error) {
      // Handle any errors
    });

    function displayImage(imageRef) {
      imageRef.getDownloadURL().then(function(url) {
        // TODO: Display the image on the UI
      }).catch(function(error) {
        // Handle any errors
      });
    }
    // this.images = this.imageSvc.getImages();
  }

  ngOnChanges(): void {
    this.images = this.imageSvc.getImages();
  }
}
