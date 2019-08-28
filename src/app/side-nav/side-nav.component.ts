import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable, Subject, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import {trigger, state, style, transition, animate, keyframes} from '@angular/animations';
import {NavigationStart, Router} from '@angular/router';
import {AuthenticationService} from '../../services/authentication.service';
import * as firebase from 'firebase/app';
import {AngularFireAuth} from '@angular/fire/auth';
import {ToolbarService} from '../../services/toolbar.service';

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
  state = 'opened';
  displayMode = '';

  subscription: Subscription;
  private user: Observable<firebase.User>;
  private isSignUpPage: Subject<boolean>;

  constructor(private breakpointObserver: BreakpointObserver,
              private authSvc: AuthenticationService,
              private router: Router,
              private toolBarSvc: ToolbarService) {
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
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  signOut() {
    this.authSvc
      .signOut()
      .then(onResolve => this.router.navigate(['/signin']));
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
