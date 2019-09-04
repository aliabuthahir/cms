import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import {Router} from '@angular/router';
import {UserModel} from '../../models/user.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToolbarService} from '../../services/toolbar.service';
import {AppMessageModel} from '../../models/app-message.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  constructor(private fb: FormBuilder,
              private authSvc: AuthenticationService,
              private router: Router,
              private toolBarSvc: ToolbarService) {
  }

  userForm: FormGroup;
  newUser = false; // to toggle login or signup form
  passReset = false;
  errorMsg = '';
  signInMsg = 'Sign In Existing User';
  signUpButtonText = 'SIGN IN';
  @ViewChild('pwd', {static: true})
  passwordField;
  showHidePassWordIcon = 'visibility';

  formErrors = {
    email: '',
    password: ''
  };

  validationMessages = {
    email: {
      required: 'Email is required.',
      email: 'Email must be a valid email'
    },
    password: {
      required: 'Password is required.',
      pattern: 'Password must include atleast one letter and one number.',
      minlength: 'Password must be atleast 4 characters long.',
      maxlength: 'Password cannot be more than 40 characters long.',
    }
  };

  ngOnInit(): void {
    this.toolBarSvc.enableSignInPage(true);
    this.buildForm();
  }

  ngOnDestroy(): void {
    this.toolBarSvc.enableSignInPage(false);
  }

  signUpForm(): void {
    this.newUser = true;
    this.signInMsg = 'Register New User';

    this.signUpButtonText = 'SIGN UP';
  }

  signInForm(): void {
    this.newUser = false;
    this.signInMsg = 'Sign In Existing User';
    this.signUpButtonText = 'SIGN IN';
  }

  public login(): void {
    const userModel = new UserModel();
    userModel.email = this.userForm.value.email;
    userModel.passWord = this.userForm.value.password;

    if (!this.newUser) {
      this.authSvc.signIn(userModel)
        .then(() => {
          this.router.navigate(['/gallery']);
        })
        .catch(() => {
          this.errorMsg = 'Your Login Attempt Failed! Retry again!';
          const message = new AppMessageModel(this.errorMsg, 'error');
          this.toolBarSvc
            .appMessageCommunicator
            .next(message);
          setTimeout(() => {
            this.errorMsg = '';
          }, 2000);
        });
    } else if (this.newUser) {
      this.authSvc.signUp(userModel)
        .then(() => {
          this.router.navigate(['/signupsuccess']);
        })
        .catch(() => {
          this.errorMsg = 'Your Attempt to sign up a new user Failed! Retry again!';
          const message = new AppMessageModel(this.errorMsg, 'error');
          this.toolBarSvc
            .appMessageCommunicator
            .next(message);
          setTimeout(() => {
            this.errorMsg = '';
          }, 2000);
        });
    }
  }

//  resetPassword() {
  // this.auth.resetPassword(this.userForm.value.email)
  //   .then(() => this.passReset = true);
//  }

  buildForm(): void {
    this.userForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]
      ],
      password: ['', [
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(6),
        Validators.maxLength(25)
      ]
      ],
    });

    this.userForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged(); // reset validation messages
  }

  // Updates validation state on form changes.
  onValueChanged(data?: any) {
    if (!this.userForm) {
      return;
    }
    const form = this.userForm;
    // tslint:disable-next-line:forin
    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        // tslint:disable-next-line:forin
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  showHidePassword() {
    if (this.showHidePassWordIcon === 'visibility') {
      this.passwordField.nativeElement.type = 'text';
      this.showHidePassWordIcon = 'visibility_off';
    } else {
      this.passwordField.nativeElement.type = 'password';
      this.showHidePassWordIcon = 'visibility';
    }
  }
}
