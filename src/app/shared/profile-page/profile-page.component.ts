import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {MixpanelService} from '../../mixpanel.service';
import * as firebase from 'firebase';
import {Subscription} from 'rxjs';
import {UsersService} from '../../users.service';
import {environment} from '../../../environments/environment';

declare const Stripe;
const stripe: any = Stripe(environment.stripeKey);

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit, OnDestroy {

  checkIfGymSub: Subscription;
  getConsumerUserInfoSub: Subscription;
  getConsumerUserInfoForManagingNotifsSub: Subscription;
  isGym = false;
  gymEmail;

  consumerUserEmail;
  managingEmailNotifs = false;
  alteredEmailPrefs = false;
  userUid;
  playerUnsubs;

  constructor(private authService: AuthService, private router: Router,
              private mixpanelService: MixpanelService, private usersService: UsersService,
              private route: ActivatedRoute) { }

  ngOnInit() {

    this.route.queryParams.subscribe((queryParams: Params) => {
      if (queryParams['random'] !== undefined) {
        this.managingEmailNotifs = true;
        this.userUid = queryParams['random'];
      }
    });

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.usersService.getGymInfoUid(user.uid);
        this.checkIfGymSub = this.usersService.gym.subscribe((gym) => {
          // console.log(gym);
          if (gym !== undefined) {
            this.isGym = true;
            this.gymEmail = gym.email;
            // console.log(this.gymEmail);
          }
          this.checkIfGymSub.unsubscribe();

          if (this.isGym === false) {
            this.usersService.getUserInfoUid(user.uid);
            this.getConsumerUserInfoSub = this.usersService.user.subscribe((consumerUser) => {
              // console.log(consumerUser);
              console.log(consumerUser.unsubs);
              this.userUid = user.uid;
              this.playerUnsubs = consumerUser.unsubs;
              if (consumerUser.emailPreferred === undefined) {
                this.consumerUserEmail = consumerUser.email;
              } else {
                this.consumerUserEmail = consumerUser.emailPreferred;
              }
            });
          }
        });
      } else {
        this.isGym = false;
        this.getConsumerUserInfoForManagingNotifsSub = this.usersService.getUserInfoViaUid(this.userUid).subscribe(userData => {
          console.log(userData.unsubs);
          this.playerUnsubs = userData.unsubs;
        });
      }
    });
  }

  connectWithStripe() {
    // window.location.href = 'http://www.w3schools.com';
    const state = 'uniqueToken'; // this is supposed to be a unique token to avoid CSRF attacks, just trust stripe and make it unique

    window.location.href = 'https://connect.stripe.com/express/oauth/authorize?redirect_uri=' + environment.stripeRedirectUri +
      'https://stripe.com/connect/default/oauth/test&client_id=' + environment.stripeClientId +
      '&state={' + state + '}&stripe_user[email]=' + this.gymEmail;
  }

  changeEmail() {
    this.mixpanelService.track('changeEmailProfile');
    this.router.navigate(['/profileEnterCorrectEmail']);
  }

  onLogout() {
    this.mixpanelService.track('logout');
    this.authService.logout();
    this.router.navigate(['/']);
  }

  unsubToGameNotHappeningEmails(wantsUnsub: boolean) {
    this.mixpanelService.track('wantsUnsub' + wantsUnsub + 'ForGameNotHappeningNotifs');
    this.usersService.updateEmailPreferences('gameNotHappening', wantsUnsub, this.userUid);
    this.alteredEmailPrefs = true;
  }

  unsubToGameHappeningEmails(wantsUnsub: boolean) {
    this.mixpanelService.track('wantsUnsub' + wantsUnsub + 'ForGameHappeningNotifs');
    this.usersService.updateEmailPreferences('gameHappening', wantsUnsub, this.userUid);
    this.alteredEmailPrefs = true;
  }

  unsubToReceiptEmails(wantsUnsub: boolean) {
    this.mixpanelService.track('wantsUnsub' + wantsUnsub + 'ForReceiptNotifs');
    this.usersService.updateEmailPreferences('receipt', wantsUnsub, this.userUid);
    this.alteredEmailPrefs = true;
  }

  unsubToSpotForSaleEmails(wantsUnsub: boolean) {
    this.mixpanelService.track('wantsUnsub' + wantsUnsub + 'ForSpotForSaleNotifs');
    this.usersService.updateEmailPreferences('spotForSale', wantsUnsub, this.userUid);
    this.alteredEmailPrefs = true;
  }

  unsubToSpotBoughtEmails(wantsUnsub: boolean) {
    this.mixpanelService.track('wantsUnsub' + wantsUnsub + 'ForSpotBoughtNotifs');
    this.usersService.updateEmailPreferences('spotBought', wantsUnsub, this.userUid);
    this.alteredEmailPrefs = true;
  }

  ngOnDestroy() {
    if (this.checkIfGymSub !== undefined) {
      this.checkIfGymSub.unsubscribe();
    }
    if (this.getConsumerUserInfoSub !== undefined) {
      this.getConsumerUserInfoSub.unsubscribe();
    }
    if (this.getConsumerUserInfoForManagingNotifsSub !== undefined) {
      this.getConsumerUserInfoForManagingNotifsSub.unsubscribe();
    }
  }
}
