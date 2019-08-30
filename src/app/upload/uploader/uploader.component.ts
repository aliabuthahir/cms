import {Component, OnInit, ViewChild} from '@angular/core';
import {ToolbarService} from '../../../services/toolbar.service';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss']
})
export class UploaderComponent implements OnInit {

  isHovering: boolean;

  @ViewChild('fileChooser', {static: true})
  fileChooser;
  statusMessage = 'No';


  constructor(private toolBarSvc: ToolbarService) {
  }

  ngOnInit() {
  }

  handleFiles(event) {
    const files: File[] = [];
    const filesSelected = event.target.files;

    for (let i = 0; i < filesSelected.length; i++) {
      files.push(filesSelected.item(i));
    }

    if (files.length > 0) {
      this.statusMessage = `${files.length}`;
      this.toolBarSvc.openFilesToUpload(files);
    } else {
      this.statusMessage = 'No';
    }
  }

  toggleHover(event: boolean) {
    this.isHovering = event;
  }
}
