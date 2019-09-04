import {AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, ViewChild} from '@angular/core';
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
  @Input()
  private enableAutoUpload = 'false';

  @ViewChild('progress', {static: true})
  progressBar;
  private progressBarsubscription: Subscription;
  private isAutoUploadSubscription: Subscription;
  private isStatusClosed: Subject<boolean> = new Subject<boolean>();

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

  private isFileUploadStarted = 'Not Started';

  constructor(private storage: AngularFireStorage,
              private db: AngularFirestore,
              private toolBarSvc: ToolbarService) {
  }

  ngOnInit() {
    this.isUploadCompleted.next(false);

    console.log('4444444START: Inside file upload task');

    console.log(this.file);
    console.log('enableAutoUpload' + this.enableAutoUpload);
    console.log('4444444END: Inside file upload task');

    this.isAutoUploadSubscription = this
      .toolBarSvc
      .autoUploadFilesObserver
      .subscribe(isAutoUploadEnabled => {
        this.enableAutoUpload = isAutoUploadEnabled ? 'true' : 'false';
        console.log('555555START: Inside file upload task - Auto upload');
        console.log(this.enableAutoUpload);
        console.log('555555END: Inside file upload task - Auto upload');

        if (this.enableAutoUpload === 'true') {
          if (this.isFileUploadStarted === 'Not Started') {
            this.isStatusClosed.next(false);
            this.startUpload();
            this.isFileUploadStarted = 'Started';
            this.playPauseIcon = 'paused';
          } else if (this.isFileUploadStarted === 'Paused') {
            this.task.resume();
            this.isFileUploadStarted = 'Started';
            this.playPauseIcon = 'pause';
          }
        } else if (this.enableAutoUpload === 'false') {
          if (this.isFileUploadStarted === 'Started') {
            this.task.pause();
            this.isFileUploadStarted = 'Paused';
            this.playPauseIcon = 'play_arrow';
          }
        }
      });

    // this.isUploadCompleted.next(true);

    this.listenForProgressChange();

    const fileName = this.file.name;
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
    if (this.enableAutoUpload === 'true') {
      this.handleFileUpload();
    }
  }

  startUpload() {
    const path = `uploads/${Date.now()}_${this.file.name}`;
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
          .collection('uploads')
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
            this.isFileUploadStarted = 'Completed';
            this.isUploadCompleted.next(true);
            this.file = undefined;
            this.toolBarSvc
              .totalFilesStatusObserver
              .next(true);

            setTimeout(() => {
              this.isStatusClosed.next(true);
            }, 5000);
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
    if (this.isFileUploadStarted === 'Not Started') {
      this.isStatusClosed.next(false);
      this.startUpload();
      this.isFileUploadStarted = 'Started';
      this.playPauseIcon = 'paused';
    } else if (this.isFileUploadStarted === 'Started') {
      this.task.pause();
      this.isFileUploadStarted = 'Paused';
      this.playPauseIcon = 'play_arrow';
    } else if (this.isFileUploadStarted === 'Paused') {
      this.task.resume();
      this.isFileUploadStarted = 'Started';
      this.playPauseIcon = 'pause';
    }
  }

  handleFileUploadCancel() {
    this.task.cancel();
    this.isFileUploadStarted = 'Cancelled';
  }
}
