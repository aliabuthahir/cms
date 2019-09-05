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
  private toolBarObserver: Subscription;

  private isAutoUploadEnabled = 'false';
  private totalFilesUploaded = 0;
  private isRightDrawerAlreadyOpen = false;

//  private bottomSheetMsg = new BottomSheetModel();


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
            this.totalFilesUploaded = 0;
            this.filesToUpload = value;
            this.rightSideDrawer.open();
          }
        }
      );
    this.rightSideDrawer.openedStart.subscribe(() => {
      this.isRightDrawerAlreadyOpen = false;
    });

    // Auto close right side drawer.
    this.drawer.openedStart.subscribe(() => {
      if (this.rightSideDrawer.isOpen) {
        this.isRightDrawerAlreadyOpen = true;
      }
      this.rightSideDrawer.close();
    });

    // Auto open right side drawer.
    this.drawer.closedStart.subscribe(() => {
      if (this.isRightDrawerAlreadyOpen
        && this.totalFilesUploaded < this.filesToUpload.length) {
        this.rightSideDrawer.open();
      }
    });

    this.isAutoUploadSubscription = this
      .toolBarSvc
      .autoUploadFilesObserver
      .subscribe(isAutoUploadEnabled => {
        this.isAutoUploadEnabled = isAutoUploadEnabled ? 'true' : 'false';
      });


    this.totalFilesUploadedObserver = this.toolBarSvc
      .totalFilesStatusObserver
      .subscribe(isFileUploadCompleted => {
        this.totalFilesUploaded++;

        // this.bottomSheetMsg.totalFiles = this.filesToUpload.length;
        // this.bottomSheetMsg.totalFilesUploaded = this.totalFilesUploaded;
        /*
                  this.bottomSheet.open(BottomMessageComponent, {
                    data: {'totalFiles': this.filesToUpload.length,
                    'totalFilesUploaded': this.totalFilesUploaded},
                    restoreFocus: true
                  });*/
        // this.toolBarSvc
        //   .bottomSheetCommunicator
        //   .next(this.bottomSheetMsg);

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
      });

    this.toolBarObserver = this.toolBarSvc
      .toolBarCommunicator
      .subscribe(autoUploadStatus => {
        this.autoUpload.checked = autoUploadStatus;
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
    this.toolBarSvc
      .autoUploadFilesObserver
      .next(!this.autoUpload.checked);
    this.toolBarSvc
      .autoUploadCommunicator.next(!this.autoUpload.checked);

    // this.isAutoUploadEnabled = !this.autoUpload.checked ? 'true' : 'false';
    // this.toolBarSvc.autoUploadCommunicator.next(!this.autoUpload.checked);
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
