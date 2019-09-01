import {Component, OnInit, ViewChild} from '@angular/core';
import {UploadModel} from '../../models/upload.model';
import {UploadService} from '../../services/upload.service';
import * as _ from 'lodash';
import {ToolbarService} from '../../services/toolbar.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  @ViewChild('autoUpload', {static: true})
  autoUpload

  constructor(private uploadSvc: UploadService,
              private toolBarSvc: ToolbarService) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.toolBarSvc
      .getAutoUploadFilesObserver()
      .next(this.autoUpload.checked);
  }

  toggleRightSideNav() {
    this.toolBarSvc.toggleRightSideNav();
  }

  enableAutoUpload() {
    this.toolBarSvc
      .getAutoUploadFilesObserver()
      .next(!this.autoUpload.checked);
  }
}
