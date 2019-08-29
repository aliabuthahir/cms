import {Component, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss']
})
export class UploaderComponent implements OnInit {

  isHovering: boolean;

  actualFiles: FileList;


  files: File[] = [];
  @ViewChild('fileChooser', {static: true})
  fileChooser;
  statusMessage = 'No';


  constructor() {
  }

  ngOnInit() {
  }

  handleFiles(event) {
    this.actualFiles = event.target.files;
    if (this.actualFiles.length > 0) {
      this.statusMessage = `${this.actualFiles.length}`;
    } else {
      this.statusMessage = 'No';
    }
  }

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  onDrop(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      this.files.push(files.item(i));
    }
  }
}
