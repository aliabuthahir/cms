import {Component, Input, OnChanges, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AngularFireStorage, AngularFireUploadTask} from '@angular/fire/storage';
import {AngularFirestore} from '@angular/fire/firestore';
import {finalize, tap} from 'rxjs/operators';
import {Observable, Subject, Subscription} from 'rxjs';
import {ToolbarService} from "../../../services/toolbar.service";

@Component({
  selector: 'app-upload-task',
  templateUrl: './upload-task.component.html',
  styleUrls: ['./upload-task.component.scss']
})
export class UploadTaskComponent implements OnInit, OnDestroy {
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
  private play_pause_icon = 'cloud_upload';

  private isFileUploadStarted = 'Not Started';

  constructor(private storage: AngularFireStorage,
              private db: AngularFirestore,
              private toolBarSvc: ToolbarService) {
  }

  ngOnInit() {
    this.isUploadCompleted.next(false);

    console.log(this.file);
    console.log('enableAutoUpload'+this.enableAutoUpload);

    this.isAutoUploadSubscription = this
      .toolBarSvc
      .getAutoUploadFilesObserver()
      .subscribe(isAutoUploadEnabled => {
        this.enableAutoUpload = isAutoUploadEnabled ? 'true' : 'false';

        if (this.enableAutoUpload === 'true') {
          if (this.isFileUploadStarted === 'Not Started') {
            this.startUpload();
            this.isFileUploadStarted = 'Started';
            this.play_pause_icon = 'paused'
          } else if (this.isFileUploadStarted === 'Paused') {
            this.task.resume();
            this.isFileUploadStarted = 'Started';
            this.play_pause_icon = 'pause';
          }
        } else if (this.enableAutoUpload === 'false') {
          if (this.isFileUploadStarted === 'Started') {
            this.task.pause();
            this.isFileUploadStarted = 'Paused';
            this.play_pause_icon = 'play_arrow';
          }
        }
      });

    this.listenForProgressChange();

    const fileName = this.file.name;
    this.fileName = fileName
      .substr(0, fileName.indexOf('.'))
      .toLocaleUpperCase();
    this.fileType = fileName
      .substr(fileName.indexOf('.') + 1, fileName.length)
      .toLocaleUpperCase();
    if (!this.fileType) {
      this.fileType = 'Not Available';
    }
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
        this.downloadURL = await ref.getDownloadURL().toPromise();
        this.db.collection('files').add({downloadURL: this.downloadURL, path});
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

            setTimeout(() => {
              //   this.isUploadCompleted.next(false);
            }, 2500);
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
      this.startUpload();
      this.isFileUploadStarted = 'Started';
      this.play_pause_icon = 'paused'
    } else if (this.isFileUploadStarted === 'Started') {
      this.task.pause();
      this.isFileUploadStarted = 'Paused';
      this.play_pause_icon = 'play_arrow';
    } else if (this.isFileUploadStarted === 'Paused') {
      this.task.resume();
      this.isFileUploadStarted = 'Started';
      this.play_pause_icon = 'pause';
    }
  }
}
