import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {UploadService} from '../../services/upload.service';
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

  constructor(private uploadSvc: UploadService,
              private toolBarSvc: ToolbarService) {
  }

  ngOnInit(): void {
    this.autoUploadSubscription = this.toolBarSvc
      .autoUploadCommunicator
      .subscribe(autoUploadStatus => {
        this.autoUpload.checked = autoUploadStatus;
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
  }
}
