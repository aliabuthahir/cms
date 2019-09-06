import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AngularFireUploadTask} from '@angular/fire/storage';
import {Observable, Subject, Subscription} from 'rxjs';
import * as firebase from 'firebase';

@Component({
  selector: 'app-image-detail',
  templateUrl: './image-detail.component.html',
  styleUrls: ['./image-detail.component.scss']
})
export class ImageDetailComponent implements OnInit {
  @Input()
  imageModel;

  @Input() file: File;
  private task: AngularFireUploadTask;
  private percentage: Observable<number>;
  private snapshot: Observable<any>;
  private downloadURL: string;
  private isDownloadCompleted: Subject<boolean> = new Subject<boolean>();
  private isUploadCancelled: Subject<boolean> = new Subject<boolean>();

  @Input()
  private enableAutoUpload = 'false';

  @ViewChild('image', {static: true})
  image: ElementRef;

  @ViewChild('progress', {static: true})
  progressBar;

  @ViewChild('preview', {static: true})
  preview;

  private progressBarsubscription: Subscription;
  private isAutoUploadSubscription: Subscription;
//  private isStatusClosed: Subject<boolean> = new Subject<boolean>();

  private uploadCancelObserver: Subscription;
  previewFieldName = 'preview';

  private units = [
    'bytes',
    'KB',
    'MB',
    'GB',
    'TB',
    'PB'
  ];
  private fileName = 'Not Available';
  private fileType = 'Not Available';
  private fileSize = 'Not Available';
  private playPauseIcon = 'cloud_download';
  NOT_STARTED = 'NOT STARTED';
  STARTED = 'STARTED';
  PAUSED = 'PAUSED';
  COMPLETED = 'COMPLETED';
  CANCELLED = 'CANCELLED';

  START = 'Start Upload';
  PAUSE = 'Pause Upload';
  RESUME = 'Resume Upload';

  playPauseToolTip = this.START;

  private isFileUploadStarted = this.NOT_STARTED;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
   // this.handleFileDowmload();
  }

  handleFileDelete() {
    const storageRef = firebase.storage().ref('new_uploads');

    // Create a reference to the file to delete
    const desertRef = storageRef.child(this.imageModel.name);

// Delete the file
    desertRef.delete().then(() => {
      // File deleted successfully
    }).catch(error => {
      // Uh-oh, an error occurred!
    });
  }
}
