import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import * as firebase from 'firebase/app';
import {AngularFireAuth} from '@angular/fire/auth';
import {UserModel} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private readonly user: Observable<firebase.User>;

  constructor(private afAuth: AngularFireAuth) {
    this.user = afAuth.authState;
  }

  signIn(user: UserModel) {
    return this.afAuth
      .auth
      .signInWithEmailAndPassword(user.email, user.passWord);
  }

  signUp(user: UserModel) {
    console.log('inside sign up..!!..');
    console.log(user.email);
    console.log(user.passWord);

    return this.afAuth
      .auth.createUserWithEmailAndPassword(user.email, user.passWord);
  }

  signOut() {
    return this.afAuth
      .auth
      .signOut();
  }

  currentUser() {
    return this.user;
  }
}
