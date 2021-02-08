import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {MixpanelService} from '../../mixpanel.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {EmailValidator} from '../../member/email-matcher';
import * as firebase from 'firebase';
import {UsersService} from '../../users.service';

@Component({
  selector: 'app-host-enter-correct-email',
  templateUrl: './host-enter-correct-email.component.html',
  styleUrls: ['./host-enter-correct-email.component.css']
})
export class HostEnterCorrectEmailComponent implements OnInit {

  enterEmailForm: FormGroup;
  qParamString;
  min;
  max;

  constructor(private route: ActivatedRoute, private router: Router,
              private mixpanelService: MixpanelService, private fb: FormBuilder,
              private usersService: UsersService) { }

  ngOnInit() {
    this.route.queryParams.subscribe((queryParams: Params) => {
      this.qParamString = queryParams['slot'];
      this.min = queryParams['min'];
      this.max = queryParams['max'];
    });

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
    console.log(this.enterEmailForm);
    console.log(this.enterEmailForm.get('confirmEmail').value);

    if (firebase.auth().currentUser) {
      console.log('user');
      this.usersService.loadConsumerPreferredEmail(firebase.auth().currentUser.uid, this.enterEmailForm.get('confirmEmail').value)
        .then(data => {
          console.log('worked fine it seems');
          console.log(data);
          return this.router.navigate(['/hostPayment'], {
            queryParams: {slot: this.qParamString, min: this.min, max: this.max}});
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      console.log('not user');
    }
  }

}
