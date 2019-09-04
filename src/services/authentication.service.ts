import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import * as firebase from 'firebase/app';
import {AngularFireAuth} from '@angular/fire/auth';
import {UserModel} from '../models/user.model';
import {auth} from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private readonly user: Observable<firebase.User>;

  constructor(private afAuth: AngularFireAuth) {
    this.user = afAuth.authState;

    this.afAuth.authState.subscribe(userResponse => {
      if (userResponse) {
        localStorage.setItem('user', JSON.stringify(userResponse));
      } else {
        localStorage.setItem('user', null);
      }
    });

  }

  signIn(user: UserModel) {
    return this.afAuth
      .auth
      .signInWithEmailAndPassword(user.email, user.passWord);
  }

  signUp(user: UserModel) {
    return this.afAuth
      .auth.createUserWithEmailAndPassword(user.email, user.passWord);
  }

  signOut() {
    return this.afAuth
      .auth
      .signOut();
  }

  async sendVerificationEmail() {
    return await this.afAuth.auth.currentUser.sendEmailVerification();
  }

  async sendPasswordResetEmail(passwordResetEmail: string) {
    return await this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail);
  }

  async  signInWithGoogle() {
    return await this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  currentUser() {
    return this.user;
  }

  currentUserDetails() {
    return JSON.parse(localStorage.getItem('user'));
  }
}
