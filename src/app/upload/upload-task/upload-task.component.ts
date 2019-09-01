
import {Component, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import {AngularFireStorage, AngularFireUploadTask} from '@angular/fire/storage';
import {AngularFirestore} from '@angular/fire/firestore';
import {finalize, tap} from 'rxjs/operators';
import {Observable, Subject, Subscription} from 'rxjs';

@Component({
  selector: 'app-upload-task',
  templateUrl: './upload-task.component.html',
  styleUrls: ['./upload-task.component.scss']
})
export class UploadTaskComponent implements OnInit {
  @Input() file: File;
  task: AngularFireUploadTask;
  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: string;
  isUploadCompleted: Subject<boolean> = new Subject<boolean>();

  @ViewChild('progress', {static: true})
  progressBar;
  progressBarsubscription: Subscription;

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

  constructor(private storage: AngularFireStorage, private db: AngularFirestore) {
  }

  ngOnInit() {
    this.isUploadCompleted.next(false);
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
    this.startUpload();
  }

  ngDoCheck(): void {
    this.listenForProgressChange();
  }

  startUpload() {
    const path = `/uploads`;
    const ref = this.storage.ref(path);
    this.task = this.storage.upload(path, this.file);
    this.percentage =this.task.percentageChanges();
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
            console.log('percentage completedc....' + percentage);

            this.isUploadCompleted.next(true);
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
}
