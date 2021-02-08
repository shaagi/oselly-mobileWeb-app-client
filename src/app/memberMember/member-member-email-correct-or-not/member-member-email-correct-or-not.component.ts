import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import * as firebase from 'firebase';
import {MixpanelService} from '../../mixpanel.service';
import {UsersService} from '../../users.service';

@Component({
  selector: 'app-member-member-email-correct-or-not',
  templateUrl: './member-member-email-correct-or-not.component.html',
  styleUrls: ['./member-member-email-correct-or-not.component.css']
})
export class MemberMemberEmailCorrectOrNotComponent implements OnInit {

  gameId;
  member;

  emailAssociatedWithUsersAccount;

  constructor(private route: ActivatedRoute, private mixpanelService: MixpanelService,
              private usersService: UsersService, private router: Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe((queryParams: Params) => {
      this.gameId = queryParams['game'];
      this.member = queryParams['member'];
    });

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.emailAssociatedWithUsersAccount = user.email;
      }
    });
  }

  yes() {
    this.mixpanelService.track('yesICheckThisEmailRegularlyMemberMember');

    this.usersService.loadConsumerPreferredEmail(firebase.auth().currentUser.uid, this.emailAssociatedWithUsersAccount)
      .then(data => {
        console.log('worked fine it seems');
        console.log(data);
        this.router.navigate(['/member-member-payment'], { queryParams: {member: this.member, game: this.gameId}});
        // this.router.navigate(['/member-payment'], {queryParams: {game: this.gameId}});
      })
      .catch(err => {
        console.log(err);
      });
  }

  no() {
    this.mixpanelService.track('noDontCheckThisEmailRegularlyMemberMember');
    this.router.navigate(['/memberMemberEnterCorrectEmail'], { queryParams: {member: this.member, game: this.gameId}});
  }

}
