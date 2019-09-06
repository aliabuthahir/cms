import {Component, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {AngularFireStorage} from '@angular/fire/storage';
import {AngularFirestore} from '@angular/fire/firestore';
import * as firebase from 'firebase';
import {ImageModel} from '../../models/image.model';
import {ToolbarService} from '../../services/toolbar.service';
import {Observable, Subscription} from 'rxjs';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map, share} from 'rxjs/operators';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent
  implements OnInit, OnDestroy, OnChanges {
  private images = new Array();
  private totalColumns = 2;
  private fileDeleteSubscription: Subscription;
  private handsetObserver: Subscription;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      share()
    );

  constructor(private storage: AngularFireStorage,
              private db: AngularFirestore,
              private toolBarSvc: ToolbarService,
              private breakpointObserver: BreakpointObserver) {
  }

  ngOnInit(): void {
    this.handsetObserver = this.isHandset$.subscribe(isHandSet => {
      isHandSet ? this.totalColumns = 1 : this.totalColumns = 2;
    });
    this.fileDeleteSubscription = this.toolBarSvc
      .fileDeleteCommunicator
      .subscribe(imageModel => {
        this.images.splice(this.images.indexOf(imageModel), 1);
      });

    this.loadImages();
  }

  ngOnDestroy(): void {
    this.fileDeleteSubscription.unsubscribe();
  }

  ngOnChanges(): void {
    this.loadImages();
  }

  loadImages() {
    const storageRef = firebase.storage().ref('new_uploads');
    storageRef.listAll().then(result => {
      result.items.forEach(imageRef => {
        // And finally display them
        console.log(imageRef);
        imageRef.getDownloadURL().then(url => {
          // TODO: Display the image on the UI
          const imageModel = new ImageModel();
          imageModel.name = imageRef.name;
          imageModel.url = url;
          this.images.push(imageModel);
        }).catch(error => {
          switch (error.code) {
            case 'storage/object-not-found':
              // File doesn't exist
              break;

            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              break;

            case 'storage/canceled':
              // User canceled the upload
              break;
            case 'storage/unknown':
              // Unknown error occurred, inspect the server response
              break;
          }
        });
      });
    }).catch(error => {
      // Handle any errors
    });
  }

  scrollHandler(event) {
    console.log('--------------');
    console.log(event);
  }

  deleteAllChildren(){
    this.toolBarSvc
      .deleteChildCommunicator
      .next(true);
  }

  getFileMetaData(storageRef, file) {
    // const storageRef = firebase.storage().ref('new_uploads');

    // Create a reference to the file whose metadata we want to retrieve
    const forestRef = storageRef.child('images/forest.jpg');

// Get metadata properties
    forestRef.getMetadata().then(metadata => {
      // Metadata now contains the metadata for 'images/forest.jpg'
    }).catch(error => {
      // Uh-oh, an error occurred!
    });
  }
}



