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
  private rightSideNavObserver: Subject<boolean> = new Subject<boolean>();
  private isRightsideNavOpen = false;

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
    this.isRightsideNavOpen = !this.isRightsideNavOpen;
    this.rightSideNavObserver.next(this.isRightsideNavOpen);
  }
}
