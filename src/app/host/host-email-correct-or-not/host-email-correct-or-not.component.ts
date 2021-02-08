import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import * as firebase from 'firebase';
import {MixpanelService} from '../../mixpanel.service';
import {UsersService} from '../../users.service';

@Component({
  selector: 'app-host-email-correct-or-not',
  templateUrl: './host-email-correct-or-not.component.html',
  styleUrls: ['./host-email-correct-or-not.component.css']
})
export class HostEmailCorrectOrNotComponent implements OnInit {

  qParamString;
  min;
  max;

  emailAssociatedWithUsersAccount;

  constructor(private route: ActivatedRoute, private router: Router,
              private mixpanelService: MixpanelService, private usersService: UsersService) { }

  ngOnInit() {
    this.route.queryParams.subscribe((queryParams: Params) => {
      this.qParamString = queryParams['slot'];
      this.min = queryParams['min'];
      this.max = queryParams['max'];
    });

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.emailAssociatedWithUsersAccount = user.email;
      }
    });
  }

  yes() {
    this.usersService.loadConsumerPreferredEmail(firebase.auth().currentUser.uid, this.emailAssociatedWithUsersAccount)
      .then(data => {
        console.log('worked fine it seems');
        console.log(data);
        this.router.navigate(['/hostPayment'], {
          queryParams: {slot: this.qParamString, min: this.min, max: this.max}
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  no() {
    this.mixpanelService.track('noDontCheckThisEmailRegularlyHost');
    this.router.navigate(['/hostEnterCorrectEmail'], {
      queryParams: {slot: this.qParamString, min: this.min, max: this.max}
    });
  }

}
