import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import {Router} from '@angular/router';
import {UserModel} from '../../models/user.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private fb: FormBuilder, private auth: AuthenticationService) {}
  userForm: FormGroup;
  newUser = true; // to toggle login or signup form
  passReset = false;

  formErrors = {
    email: '',
    password: ''
  };

  validationMessages = {
    email: {
      required:      'Email is required.',
      email:         'Email must be a valid email'
    },
    password: {
      required:      'Password is required.',
      pattern:       'Password must be include at one letter and one number.',
      minlength:     'Password must be at least 4 characters long.',
      maxlength:     'Password cannot be more than 40 characters long.',
    }
  };

  ngOnInit(): void {
    this.buildForm();
  }

  toggleForm(): void {
    this.newUser = !this.newUser;
  }

  signup(): void {
//    this.auth.emailSignUp(this.userForm.value);
  }

  login(): void {
    this.auth.signIn(this.userForm.value);
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
    if (!this.userForm) { return; }
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

}
