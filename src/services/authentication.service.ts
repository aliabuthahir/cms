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

  // signUpEmailUser(credentials: EmailPasswordCredentials): firebase.Promise<FirebaseAuthState> {
  //   return this.af.auth.createUser(credentials)
  //     .then(() => console.log("success"))
  //     .catch(error => console.log(error));
  // }

  signIn(user: UserModel) {
    return this.afAuth
      .auth
      .signInWithEmailAndPassword(user.email, user.passWord);
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
