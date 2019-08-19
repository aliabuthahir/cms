import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import * as firebase from "firebase/app";
import {AngularFireAuth} from "@angular/fire/auth";

import {Observable} from "rxjs";
import {map, take} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGaurdService implements CanActivate {
  user: Observable<firebase.User>;

  constructor(private afAuth: AngularFireAuth, private router: Router) {
    this.user = afAuth.authState;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.user.pipe(map((auth) => {
      if (!auth) {
        this.router.navigateByUrl('/login');
        return false;
      }
      return true;
    })).pipe(take(1));
  }
}
