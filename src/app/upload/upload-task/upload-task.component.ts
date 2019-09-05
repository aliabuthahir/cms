import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AngularFireStorage, AngularFireUploadTask} from '@angular/fire/storage';
import {AngularFirestore} from '@angular/fire/firestore';
import {finalize, tap} from 'rxjs/operators';
import {Observable, Subject, Subscription} from 'rxjs';
import {ToolbarService} from '../../../services/toolbar.service';

@Component({
  selector: 'app-upload-task',
  templateUrl: './upload-task.component.html',
  styleUrls: ['./upload-task.component.scss']
})
export class UploadTaskComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() file: File;
  private task: AngularFireUploadTask;
  private percentage: Observable<number>;
  private snapshot: Observable<any>;
  private downloadURL: string;
  private isUploadCompleted: Subject<boolean> = new Subject<boolean>();
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
  private playPauseIcon = 'cloud_upload';
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

  constructor(private storage: AngularFireStorage,
              private db: AngularFirestore,
              private toolBarSvc: ToolbarService) {
  }

  ngOnInit() {
    this.isAutoUploadSubscription = this
      .toolBarSvc
      .autoUploadFilesObserver
      .subscribe(isAutoUploadEnabled => {
        this.enableAutoUpload = isAutoUploadEnabled ? 'true' : 'false';
        if (this.enableAutoUpload === 'true') {
          if (this.isFileUploadStarted === this.NOT_STARTED) {
//            this.isStatusClosed.next(false);
            this.startUpload();
            this.isFileUploadStarted = this.STARTED;
            this.playPauseIcon = 'pause';
            this.playPauseToolTip = this.PAUSE;
          } else if (this.isFileUploadStarted === this.PAUSED) {
            this.task.resume();
            this.isFileUploadStarted = this.STARTED;
            this.playPauseIcon = 'pause';
            this.playPauseToolTip = this.PAUSE;
          }
        } else if (this.enableAutoUpload === 'false') {
          if (this.isFileUploadStarted === this.STARTED) {
            this.task.pause();
            this.isFileUploadStarted = this.PAUSED;
            this.playPauseIcon = 'play_arrow';
            this.playPauseToolTip = this.RESUME;
          }
        }
      });

    this.isUploadCompleted.next(true);
    this.listenForProgressChange();

    const fileName = this.file.name;
    this.previewFieldName = `preview_${fileName}_${Date.now()}`;
    console.log('preview name');
    console.log(this.previewFieldName);
    this.fileName = fileName
      .substr(0, fileName.indexOf('.'))
      .toLocaleUpperCase();
    this.fileType = this.file.type.toLocaleUpperCase();
    this.fileSize = this.getFileSize().toLocaleUpperCase();
  }

  ngOnDestroy() {
    this.isAutoUploadSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    this.isUploadCompleted.next(false);

    const fr = new FileReader();
    fr.onload = (file => {
      return evt => {
        console.log(evt.target.result);
        console.log(file);
// @ts-ignore
        document.getElementById(file).src = evt.target.result;
      };
    })(this.previewFieldName);
    fr.readAsDataURL(this.file);

    /*// Not supported
    else {
      // fallback -- perhaps submit the input to an iframe and temporarily store
      // them on the server until the user's session ends.
    }
*/
    this.isUploadCompleted.next(false);

    if (this.enableAutoUpload === 'true') {
      this.handleFileUpload();
    }
  }

  startUpload() {
    // const path = `new_uploads/${Date.now()}_${this.file.name}`;
    const path = `new_uploads/${this.file.name}`;
    const ref = this.storage.ref(path);
    this.task = this.storage.upload(path, this.file);
    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges().pipe(
      tap(),
      finalize(async () => {
        this.downloadURL = await ref
          .getDownloadURL()
          .toPromise();
        this.db
          .collection('new_uploads')
          .add({downloadURL: this.downloadURL, path});
      }),
    );
  }

  isActive(snapshot) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
  }

  listenForProgressChange() {
    if (this.progressBar) {
      // if (this.progressBarsubscription) {
      //   console.log('');
      //
      //   this.progressBarsubscription.unsubscribe();
      // }


      this.progressBarsubscription = this.progressBar
        .animationEnd
        .subscribe(percentage => {
          if (percentage.value === 100) {
            this.isFileUploadStarted = this.COMPLETED;
            this.isUploadCompleted.next(true);
            this.file = undefined;
            this.toolBarSvc
              .totalFilesStatusObserver
              .next(true);

            /*
                        setTimeout(() => {
                          this.isStatusClosed.next(true);
                        }, 5000);
            */
          }
        });
    }
  }

  getFileSize() {
    // Get File size in B, KB, MB, GB, etc.
    let bytes = this.file.size;
    const precision = 2;
    if (isNaN(parseFloat(String(bytes))) || !isFinite(bytes)) {
      return '?';
    }

    let unit = 0;

    while (bytes >= 1024) {
      bytes /= 1024;
      unit++;
    }

    return bytes.toFixed(+precision) + ' ' + this.units[unit];
  }

  handleFileUpload() {
    if (this.isFileUploadStarted === this.NOT_STARTED) {
//      this.isStatusClosed.next(false);
      this.startUpload();
      this.isFileUploadStarted = this.STARTED;
      this.playPauseIcon = 'pause';
      this.playPauseToolTip = this.PAUSE;
    } else if (this.isFileUploadStarted === this.STARTED) {
      this.task.pause();
      this.isFileUploadStarted = this.PAUSED;
      this.playPauseIcon = 'play_arrow';
      this.playPauseToolTip = this.RESUME;
    } else if (this.isFileUploadStarted === this.PAUSED) {
      this.task.resume();
      this.isFileUploadStarted = this.STARTED;
      this.playPauseIcon = 'pause';
      this.playPauseToolTip = this.PAUSE;
    }
  }

  handleFileUploadCancel() {
    if (this.task) {
      this.task.cancel();
    }
    this.isFileUploadStarted = this.CANCELLED;
    this.playPauseToolTip = this.START;
    this.isUploadCancelled.next(true);
  }
}
