import { Component, OnInit } from '@angular/core';
import {ToolbarService} from '../../services/toolbar.service';
import {AppMessageModel} from '../../models/app-message.model';

@Component({
  selector: 'app-pagenotfound404',
  templateUrl: './pagenotfound404.component.html',
  styleUrls: ['./pagenotfound404.component.scss']
})
export class Pagenotfound404Component implements OnInit {

  constructor(private toolBarSvc: ToolbarService) { }

  ngOnInit() {
    const message = new AppMessageModel(
      'The Page your are looking for could not be found!',
      'error');
    this.toolBarSvc
      .appMessageCommunicator
      .next(message);
    }

}
