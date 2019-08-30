import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToolbarService {
  /* Note: This service has been introduced explicitly to
   avoid hardcore binding to any database sign in/single
   sign-on mechanisms. This service helps to decouple
   the app behavior/UI animations and keep them
   separate from the backend. */

  private signInPageObserver: Subject<boolean> = new Subject<boolean>();
  private rightSideNavObserver: Subject<any> = new Subject<any>();

  constructor() {
  }

  enableSignInPage(value: boolean) {
    this.signInPageObserver.next(value);
  }

  getObserver() {
    return this.signInPageObserver;
  }

  getRightNavObserver() {
    return this.rightSideNavObserver;
  }

  toggleRightSideNav() {
    this.rightSideNavObserver.next(true);
  }

  openFilesToUpload(files: File[]) {
    this.rightSideNavObserver.next(files);
  }
}
