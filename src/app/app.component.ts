import {AfterViewInit, Component} from '@angular/core';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'campusworks';

  constructor(private snackBar: MatSnackBar) {
  }

  ngAfterViewInit() {
    // 'setTimeout' code hack to avoid snack bar error at view init.
    setTimeout(() => {
      const message = `Welcome to ${this.title}`;

      this.snackBar.open(message, 'CLOSE', {
        duration: 3000
      });
    });
  }
}
