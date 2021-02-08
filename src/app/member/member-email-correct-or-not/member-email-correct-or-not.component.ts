import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {MixpanelService} from '../../mixpanel.service';
import * as firebase from 'firebase';
import {UsersService} from '../../users.service';

@Component({
  selector: 'app-member-email-correct-or-not',
  templateUrl: './member-email-correct-or-not.component.html',
  styleUrls: ['./member-email-correct-or-not.component.css']
})
export class MemberEmailCorrectOrNotComponent implements OnInit {

  gameId;
  emailAssociatedWithUsersAccount;

  constructor(private mixpanelService: MixpanelService, private router: Router,
              private route: ActivatedRoute, private usersService: UsersService) { }

  ngOnInit() {
    this.route.queryParams.subscribe((queryParams: Params) => {
      this.gameId = queryParams['game'];
    });

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.emailAssociatedWithUsersAccount = user.email;
      }
    });
  }

  yes() {
    this.mixpanelService.track('yesICheckThisEmailRegularlySemiHost');

    this.usersService.loadConsumerPreferredEmail(firebase.auth().currentUser.uid, this.emailAssociatedWithUsersAccount)
      .then(data => {
        console.log('worked fine it seems');
        console.log(data);
        this.router.navigate(['/member-payment'], {queryParams: {game: this.gameId}});
      })
      .catch(err => {
        console.log(err);
      });
  }

  no() {
    this.mixpanelService.track('noDontCheckThisEmailRegularlySemiHost');
    this.router.navigate(['/memberEnterCorrectEmail'], {queryParams: {game: this.gameId}});
  }

}
