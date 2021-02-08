import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {EmailValidator} from '../email-matcher';
import * as firebase from 'firebase';
import {UsersService} from '../../users.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {MixpanelService} from '../../mixpanel.service';

@Component({
  selector: 'app-member-enter-correct-email',
  templateUrl: './member-enter-correct-email.component.html',
  styleUrls: ['./member-enter-correct-email.component.css']
})
export class MemberEnterCorrectEmailComponent implements OnInit {

  enterEmailForm: FormGroup;
  gameId;

  constructor(private fb: FormBuilder, private usersService: UsersService,
              private router: Router, private route: ActivatedRoute,
              private mixpanelService: MixpanelService) { }

  ngOnInit() {
    this.route.queryParams.subscribe((queryParams: Params) => {
      this.gameId = queryParams['game'];
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
    this.mixpanelService.track('submitCorrectEmailSemiHost');

    console.log(this.enterEmailForm);
    console.log(this.enterEmailForm.get('confirmEmail').value);

    if (firebase.auth().currentUser) {
      console.log('user');
      this.usersService.loadConsumerPreferredEmail(firebase.auth().currentUser.uid, this.enterEmailForm.get('confirmEmail').value)
        .then(data => {
          console.log('worked fine it seems');
          console.log(data);
          return this.router.navigate(['/member-payment'], {queryParams: {game: this.gameId}});
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      console.log('not user');
    }
  }

}
