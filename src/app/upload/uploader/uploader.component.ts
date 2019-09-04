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
    const filesSelected = event.target.files;
    const files = new Array();
    for (let i = 0; i < filesSelected.length; i++) {
      files.push(filesSelected.item(i));
    }
    console.log('1111START: Inside file chooser');
    console.log(filesSelected);
    console.log(files);
    console.log('11111End: Inside file chooser');

    if (files.length > 0) {
      console.log('22222START: Inside file sending');

      this.statusMessage = `${files.length}`;
      this.toolBarSvc
        .rightSideNavObserver
        .next(files);
      console.log('22222End: Inside file sending ');
    } else {
      this.statusMessage = 'No';
    }
  }


  toggleHover(event: boolean) {
    this.isHovering = event;
  }
}
