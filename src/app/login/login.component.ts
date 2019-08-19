import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../../services/authentication.service";
import {Router} from '@angular/router';
import {UserModel} from "../../models/user.model";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email: string;
  passWord: string;
  errorMsg: string;

  constructor(private authSvc: AuthenticationService,
              private router: Router,
              private user: UserModel) {
  }

  ngOnInit() {
    this.user.email = this.email;
    this.user.passWord = this.passWord;
  }

  signIn() {
    this.authSvc
      .signIn(this.user)
      .then(resolve => this.router.navigate(['gallery']))
      .catch(error => this.errorMsg = error.message);
  }
}
