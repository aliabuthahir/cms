import {Component, OnInit} from '@angular/core';
import {UploadModel} from '../../models/upload.model';
import {UploadService} from '../../services/upload.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  files: FileList;
  upload: UploadModel;
// State for dropzone CSS toggling
  isHovering: boolean;

  constructor(private uploadSvc: UploadService) {
  }

  ngOnInit() {
  }

  handleFiles(event) {
    this.files = event.target.files;
  }

  uploadFiles() {
    const filesToUpload = this.files;
    const filesIdx = _.range(filesToUpload.length);
    _.each(filesIdx, (Idx) => {
     // console.log(filesToUpload[Idx]);
      this.upload = new UploadModel(filesToUpload[Idx]);
      this.uploadSvc.uploadFile(this.upload);
    });
  }

  toggleHover(event: boolean) {
    this.isHovering = event;
  }
}
