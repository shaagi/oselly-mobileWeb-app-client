import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth/auth.service';
import {MixpanelService} from '../mixpanel.service';


@Component({
  selector: 'app-gym-login',
  templateUrl: './gym-login.component.html',
  styleUrls: ['./gym-login.component.css']
})
export class GymLoginComponent implements OnInit {


  signinForm: FormGroup;
  // detailForm: FormGroup;

  constructor(public fb: FormBuilder, public auth: AuthService,
              private mixpanelService: MixpanelService) { }

  ngOnInit() {

    this.signinForm = this.fb.group({
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
    });
  }

  get emailSignin() {
    return this.signinForm.get('email');
  }

  get passwordSignin() {
    return this.signinForm.get('password');
  }

  signin() {
    this.mixpanelService.track('signInGymLogin');
    return this.auth.emailSignin(this.emailSignin.value, this.passwordSignin.value);
  }

  mixpanelWantUseOsellyLetUsKnow() {
    this.mixpanelService.track('letUsKnowGymLogin');
  }

}
