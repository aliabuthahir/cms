import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-info-card',
  templateUrl: './info-card.component.html',
  styleUrls: ['./info-card.component.scss']
})
export class InfoCardComponent implements OnInit {
  @Input()
  private title = 'Not Available';
  @Input()
  private msg = 'Not Available';

  constructor() {
  }

  ngOnInit() {
  }

}
