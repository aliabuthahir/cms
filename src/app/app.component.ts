import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {ToolbarService} from '../services/toolbar.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  title = 'AutoGraph';

  private appMessageObserver: Subscription;


  constructor(private snackBar: MatSnackBar,
              private toolBarSvc: ToolbarService) {
  }

  ngOnInit(): void {
    this.appMessageObserver = this.toolBarSvc
      .appMessageCommunicator
      .subscribe(appMessage => {
        this.showMessage(appMessage.message);
      });
  }

  ngAfterViewInit() {
    const message = `Welcome to ${this.title}`;

    this.showMessage(message);
  }

  ngOnDestroy(): void {
    this.appMessageObserver.unsubscribe();
  }


  showMessage(message: string) {
    // 'setTimeout' code hack to avoid snack bar error at view init.
    setTimeout(() => {
      this.snackBar.open(message, 'CLOSE', {
        duration: 5000
      });
    });
  }
}
