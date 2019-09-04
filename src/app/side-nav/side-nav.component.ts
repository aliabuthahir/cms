import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable, Subject, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import {trigger, state, style, transition, animate, keyframes} from '@angular/animations';
import {NavigationStart, Router} from '@angular/router';
import {AuthenticationService} from '../../services/authentication.service';
import * as firebase from 'firebase/app';
import {ToolbarService} from '../../services/toolbar.service';
import {AppMessageModel} from '../../models/app-message.model';
import {MatBottomSheet} from '@angular/material/bottom-sheet';

const toDesktop = keyframes([
  style({
    transform: 'translateY(-100px)',
    opacity: 0,
    offset: 0
  }),
  style({
    transform: 'translateY(-80px)',
    opacity: 0.2,
    offset: 0.2
  }),
  style({
    transform: 'translateY(-60px)',
    opacity: 0.4,
    offset: 0.4
  }),
  style({
    transform: 'translateY(-40px)',
    opacity: 0.6,
    offset: 0.6
  }),
  style({
    transform: 'translateY(-20px)',
    opacity: 0.8,
    offset: 0.8
  })
]);

const toHandSet = keyframes([
  style({
    transform: 'translateY(0px)',
    opacity: 1,
    offset: 0
  }),
  style({
    transform: 'translateY(-20px)',
    opacity: 0.8,
    offset: 0.2
  }),
  style({
    transform: 'translateY(-40px)',
    opacity: 0.6,
    offset: 0.4
  }),
  style({
    transform: 'translateY(-60px)',
    opacity: 0.4,
    offset: 0.6
  }),
  style({
    transform: 'translateY(-80px)',
    opacity: 0.2,
    offset: 0.8
  })
]);


@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css'],
  animations: [
    trigger('sidenavAnimate', [
      state('expanded', style({
        width: '200px'
      })),
      state('collapsed', style({
        width: `60px`
      })),
      transition('*=>expanded', animate(400)),
      transition('void=>collapsed', animate(400)),
      transition('expanded<=>collapsed', animate(400))
    ]),
    trigger('toolBarAnimate', [
      state('desktop', style({
        transform: 'translateY(0px)',
        opacity: 1
      })),
      state('handset', style({
        transform: 'translateY(-100px)',
        opacity: 0
      })),
      transition('*=>desktop', animate(1000, toDesktop)),
      transition('desktop=>handset', animate(1000, toHandSet)),
    ]),
    trigger('navButtonAnimate', [
      state('handset', style({
        transform: 'translateY(0px)',
        opacity: 1
      })),
      state('desktop', style({
        transform: 'translateY(-100px)',
        opacity: 0
      })),
      transition('*=>handset', animate(1000, toDesktop)),
      transition('handset=>desktop', animate(1000, toHandSet)),
    ]),
    trigger('menuAnimate', [
      state('closed', style({
        transform: 'rotate(0)'
      })),
      state('open', style({
        transform: 'rotate(180deg)'
      })),
      transition('*=>open', animate(400, keyframes([
        style({
          transform: 'rotate(0)',
          offset: 0
        }),
        style({
          transform: 'rotate(-36deg)',
          offset: 0.2
        }),
        style({
          transform: 'rotate(-72deg)',
          offset: 0.4
        }),
        style({
          transform: 'rotate(-108deg)',
          offset: 0.6
        }),
        style({
          transform: 'rotate(-144deg)',
          offset: 0.8
        })]))),
      transition('open=>closed', animate(400, keyframes([
        style({
          transform: 'rotate(-180deg)',
          offset: 0
        }),
        style({
          transform: 'rotate(-144deg)',
          offset: 0.2
        }),
        style({
          transform: 'rotate(-108deg)',
          offset: 0.4
        }),
        style({
          transform: 'rotate(-72deg)',
          offset: 0.6
        }),
        style({
          transform: 'rotate(-36deg)',
          offset: 0.8
        })
      ])))
    ])
  ]
})
export class SideNavComponent implements OnInit, OnDestroy {
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => {
        const value = result.matches;
        value ? this.displayMode = 'handset' : this.displayMode = 'desktop';
        return value;
      })
    );

  @Input()
  title = 'test title';
  @Input()
  description = 'test desccription';
  @ViewChild('drawer', {static: true})
  drawer;
  @ViewChild('rightDrawer', {static: true})
  rightSideDrawer;
  @ViewChild('autoUpload', {static: true})
  autoUpload;

  state = 'opened';
  displayMode = '';
  menuState = '';
  private filesToUpload = new Array();
  private fileUploadStatusMsg = 'No files selected for Upload';
  private fileUploadStatusIcon = 'info';

  private subscription: Subscription;
  private user: Observable<firebase.User>;
  private isSignUpPage: Subject<boolean>;
  private isRightSideNavOpen: Subscription;
  private isAutoUploadSubscription: Subscription;
  private totalFilesUploadedObserver: Subscription;
  private isAutoUploadEnabled = 'false';
  private totalFilesUploaded = 0;
  private isRightDrawerAlreadyOpen = false;

  constructor(private breakpointObserver: BreakpointObserver,
              private authSvc: AuthenticationService,
              private router: Router,
              private toolBarSvc: ToolbarService,
              private bottomSheet: MatBottomSheet) {
    this.user = authSvc.currentUser();
    this.subscription = router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (!router.navigated) {
          this.displayMode = '';
        }
      }
    });
  }

  ngOnInit(): void {
    this.isSignUpPage = this.toolBarSvc.getObserver();
    this.isRightSideNavOpen = this.toolBarSvc
      .rightSideNavObserver
      .subscribe((value) => {
          if (typeof value === 'boolean') {
            this.rightSideDrawer.toggle();
          } else {
            console.log('33333START: Inside file reciever');

            this.totalFilesUploaded = 0;
            this.filesToUpload = value;
            this.fileUploadStatusMsg
              = `${this.filesToUpload.length} Files have been selected for Upload`;
            this.rightSideDrawer.open();

            const message = new AppMessageModel(this.fileUploadStatusMsg,
              this.fileUploadStatusIcon);
            this.toolBarSvc
              .appMessageCommunicator
              .next(message);
            console.log(this.isAutoUploadEnabled);

            console.log(this.filesToUpload);
            console.log(this.rightSideDrawer.opened);

            console.log('3333END: Inside file reciever');

          }
        }
      );
    this.rightSideDrawer.openedChange.subscribe(() => {
      if (this.rightSideDrawer.opened) {
        this.isRightDrawerAlreadyOpen = false;
      }
    });

    // Auto open or close right side drawer.
    this.drawer.openedChange.subscribe(() => {
      if (this.drawer.opened) {
        if (this.rightSideDrawer.opened) {
          this.isRightDrawerAlreadyOpen = true;
        }
        this.rightSideDrawer.close();
      } else if (this.isRightDrawerAlreadyOpen) {
        if (this.totalFilesUploaded < this.filesToUpload.length) {
          this.rightSideDrawer.open();
          const message = new AppMessageModel(
            this.fileUploadStatusMsg,
            this.fileUploadStatusIcon);
          this.toolBarSvc
            .appMessageCommunicator
            .next(message);
        } else {
          this.fileUploadStatusMsg = 'No files selected for Upload';
        }
      }
    });


    this.isAutoUploadSubscription = this
      .toolBarSvc
      .autoUploadFilesObserver
      .subscribe(isAutoUploadEnabled => {
        console.log('6666666TART: Inside Auto upload');

        this.isAutoUploadEnabled = isAutoUploadEnabled ? 'true' : 'false';
        this.autoUpload.checked = isAutoUploadEnabled;
        console.log(this.isAutoUploadEnabled);
        console.log('6666666End: Inside Auto upload');
      });

    this.totalFilesUploadedObserver = this.toolBarSvc
      .totalFilesStatusObserver
      .subscribe(isFileUploadCompleted => {
        this.totalFilesUploaded++;
        this.fileUploadStatusMsg
          = 'File Upload in Progress...';

        if (this.totalFilesUploaded >= this.filesToUpload.length) {
          this.filesToUpload = new Array();

          this.fileUploadStatusMsg
            = 'All Files have been Succesfully Uploaded to Cloud';

          const message = new AppMessageModel(this.fileUploadStatusMsg,
            'success');
          this.toolBarSvc
            .appMessageCommunicator
            .next(message);
          this.rightSideDrawer.close();
        }
        // TODO: add code to show bottom up slider message.
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.isRightSideNavOpen.unsubscribe();
    this.isAutoUploadSubscription.unsubscribe();
    this.totalFilesUploadedObserver.unsubscribe();
  }

  signOut() {
    this.authSvc
      .signOut()
      .then(onResolve => {
        this.drawer.close();
        this.router.navigate(['/signin']);
        const message = new AppMessageModel(
          'You have been successfully Signed Out!',
          'success'
        );
        this.toolBarSvc
          .appMessageCommunicator
          .next(message);
      });
  }

  changeAutoUploadStatus() {
    this.isAutoUploadEnabled = !this.autoUpload.checked ? 'true' : 'false';
    console.log('this.isAutoUploadEnabled' + this.isAutoUploadEnabled);
    this.toolBarSvc.autoUploadCommunicator.next(!this.autoUpload.checked);
  }

  toggleNavBarState() {
    if (this.drawer.opened) {
      this.state === 'opened'
        ? this.state = 'expanded'
        : this.state === 'expanded'
        ? this.state = 'collapsed'
        : this.state === 'collapsed'
          ? this.drawer.close() : this.state = 'opened';
    } else {
      this.drawer.open();
      this.state = 'opened';
    }
  }
}
