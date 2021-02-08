import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth/auth.service';

@Component({
  selector: 'app-gym-signup',
  templateUrl: './gym-signup.component.html',
  styleUrls: ['./gym-signup.component.css']
})
export class GymSignupComponent implements OnInit {

  signupForm: FormGroup;

  constructor(public fb: FormBuilder, public auth: AuthService) { }

  ngOnInit() {
    // First Step
    this.signupForm = this.fb.group({
      'email': ['', [
        Validators.required,
        Validators.email
      ]
      ],
      'password': ['', [
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(6),
        Validators.maxLength(25),
        Validators.required
      ]
      ],
      // 'region': ['', [
      // ]
      // ],
    });
  }

  get email() {
    return this.signupForm.get('email');
  }
  get password() {
    return this.signupForm.get('password');
  }

  signup() {
    return this.auth.emailSignUp(this.email.value, this.password.value);
  }

}
