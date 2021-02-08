import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {EmailValidator} from '../../member/email-matcher';
import * as firebase from 'firebase';
import {UsersService} from '../../users.service';
import {MixpanelService} from '../../mixpanel.service';

@Component({
  selector: 'app-member-member-enter-correct-email',
  templateUrl: './member-member-enter-correct-email.component.html',
  styleUrls: ['./member-member-enter-correct-email.component.css']
})
export class MemberMemberEnterCorrectEmailComponent implements OnInit {

  enterEmailForm: FormGroup;
  gameId;
  member;

  constructor(private route: ActivatedRoute, private fb: FormBuilder,
              private usersService: UsersService, private router: Router,
              private mixpanelService: MixpanelService) {}

  ngOnInit() {
    this.route.queryParams.subscribe((queryParams: Params) => {
      this.gameId = queryParams['game'];
      this.member = queryParams['member'];
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
    this.mixpanelService.track('submitCorrectEmailMemberMember');

    console.log(this.enterEmailForm);
    console.log(this.enterEmailForm.get('confirmEmail').value);

    if (firebase.auth().currentUser) {
      console.log('user');
      this.usersService.loadConsumerPreferredEmail(firebase.auth().currentUser.uid, this.enterEmailForm.get('confirmEmail').value)
        .then(data => {
          console.log('worked fine it seems');
          console.log(data);
          return this.router.navigate(['/member-member-payment'], { queryParams: {member: this.member, game: this.gameId}});
          // return this.router.navigate(['/member-payment'], {queryParams: {game: this.gameId}});
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      console.log('not user');
    }
  }

}
