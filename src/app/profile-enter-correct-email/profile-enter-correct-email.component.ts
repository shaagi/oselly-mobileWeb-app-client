import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {EmailValidator} from '../member/email-matcher';
import {UsersService} from '../users.service';
import * as firebase from 'firebase';
import {Router} from '@angular/router';
import {MixpanelService} from '../mixpanel.service';

@Component({
  selector: 'app-profile-enter-correct-email',
  templateUrl: './profile-enter-correct-email.component.html',
  styleUrls: ['./profile-enter-correct-email.component.css']
})
export class ProfileEnterCorrectEmailComponent implements OnInit {

  enterEmailForm: FormGroup;

  constructor(private fb: FormBuilder, private usersService: UsersService,
              private router: Router, private mixpanelService: MixpanelService) { }

  ngOnInit() {
    this.enterEmailForm = this.fb.group({
      email: [
        '',
        [Validators.required, Validators.email]
      ],
      confirmEmail: [
        '',
        [
          Validators.required,
          Validators.email,
          EmailValidator('email'),
        ]
      ]
    });
  }

  onSubmit() {
    this.mixpanelService.track('submitEmailProfileEnterCorrectEmail');

    console.log(this.enterEmailForm);
    console.log(this.enterEmailForm.get('confirmEmail').value);

    if (firebase.auth().currentUser) {
      console.log('user');
      this.usersService.loadConsumerPreferredEmail(firebase.auth().currentUser.uid, this.enterEmailForm.get('confirmEmail').value)
        .then(data => {
          console.log('worked fine it seems');
          console.log(data);
          return this.router.navigate(['/profile']);
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      console.log('not user');
    }
  }

}
