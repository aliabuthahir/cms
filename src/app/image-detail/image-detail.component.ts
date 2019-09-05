import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-image-detail',
  templateUrl: './image-detail.component.html',
  styleUrls: ['./image-detail.component.scss']
})
export class ImageDetailComponent implements OnInit {
  @Input()
  imageModel;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
  }

  handleFileDowmload(){

  }
}
