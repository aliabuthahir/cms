import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ToolbarService} from '../../services/toolbar.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('autoUpload', {static: true})
  autoUpload;

  autoUploadSubscription: Subscription;

  constructor(private toolBarSvc: ToolbarService) {
  }

  ngOnInit(): void {
    this.autoUploadSubscription = this.toolBarSvc
      .autoUploadCommunicator
      .subscribe(autoUploadStatus => {
        console.log('sdfdsfdsf' + autoUploadStatus);
        this.autoUpload.checked = autoUploadStatus;
        console.log('sdfdsfdsf' + this.autoUpload.checked);
      });
  }

  ngAfterViewInit() {
    this.toolBarSvc
      .autoUploadFilesObserver
      .next(this.autoUpload.checked);
  }

  ngOnDestroy(): void {
    this.autoUploadSubscription.unsubscribe();
  }

  toggleRightSideNav() {
    this.toolBarSvc.toggleRightSideNav();
  }

  enableAutoUpload() {
    this.toolBarSvc
      .autoUploadFilesObserver
      .next(!this.autoUpload.checked);
    this.toolBarSvc
      .toolBarCommunicator
      .next(!this.autoUpload.checked);
  }
}
