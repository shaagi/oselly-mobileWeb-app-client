import {Component, OnDestroy, OnInit} from '@angular/core';
import {MixpanelService} from '../mixpanel.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {GamesService} from '../games.service';
import {Subscription} from 'rxjs';
import * as firebase from 'firebase';
import {UsersService} from '../users.service';

@Component({
  selector: 'app-replace-first-screen',
  templateUrl: './replace-first-screen.component.html',
  styleUrls: ['./replace-first-screen.component.css']
})
export class ReplaceFirstScreenComponent implements OnInit, OnDestroy {

  tempGameId;
  sellerUid;

  getGameInfoSub: Subscription;
  countDownDate;
  countInterval;
  now;
  distance;
  hoursLeft;
  minutesLeft;
  secondsLeft;
  secondsLeftRefined;
  minutesLeftRefined;

  replaceClosed = false;

  getSpotSellers: Subscription;

  userPaymentInfoLinked;
  checkIfUserPaidSub: Subscription;
  closeModal;

  constructor(private mixpanelService: MixpanelService,
              private route: ActivatedRoute,
              private gameServiceAfs: GamesService,
              private usersService: UsersService,
              private router: Router) { }

  ngOnInit() {
    this.closeModal = false;
    this.userPaymentInfoLinked = false;
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.checkIfUserPaidSub = this.usersService.getUserInfo(user.email).subscribe(data => {
          if (data[0].data.givenPaymentInfo === true) {
            this.userPaymentInfoLinked = true;
          } else {
            this.userPaymentInfoLinked = false;
          }
        });
      }
    });

    this.route.queryParams.subscribe((queryParams: Params) => {
      this.tempGameId = queryParams['game'];
      this.sellerUid = queryParams['seller'];

      this.getSpotSellers = this.gameServiceAfs.getSpotSellers(this.tempGameId).subscribe((spotSellers: any[]) => {
        console.log(spotSellers.length);
        if (spotSellers.length === 0) {
          this.replaceClosed = true;
        }
        let matchesOfSpotSellerInLinkAndFirestore = 0;
        for (let indexVal in spotSellers) {
         if (spotSellers[indexVal].id === this.sellerUid) {
            matchesOfSpotSellerInLinkAndFirestore = matchesOfSpotSellerInLinkAndFirestore + 1;
          }
        }
        if (matchesOfSpotSellerInLinkAndFirestore === 0) {
          this.replaceClosed = true;
        }
      });

      this.gameServiceAfs.getGame(this.tempGameId); // this line of code might be unnecessary

      this.getGameInfoSub = this.gameServiceAfs.game.subscribe((game) => {
        const currDate = new Date();
        console.log('currDate is: ' + currDate);
        console.log('expiry date is: ' + currDate);
        if (currDate > game.finalizeByDate.toDate()) {
          this.replaceClosed = true;
        }

        this.countDownDate = (game.finalizeByDate.seconds * 1000);

        this.countInterval = setInterval(() => {
          console.log('something');
          this.now = new Date().getTime();
          this.distance = this.countDownDate - this.now;

          if (this.distance < 0) {
            clearInterval(this.countInterval);
            console.log('countDown timer has hit zero');
            this.replaceClosed = true;
          }
          }, 1000);

      });
    });
  }

  directToHowItWorks() {
    this.mixpanelService.track('howItWorksReplaceFirstScreen');
    this.router.navigate(['/howItWorks']); // perhaps make a how it works for replace as if they click it they see "Step 1: pick a slot.."
  }

  mixpanel(eventName: string) {
    this.mixpanelService.track(eventName);
  }

  imSure() {
    this.mixpanelService.track('replaceFirstScreenImInYesImSure');
    this.closeModal = true;
  }

  ngOnDestroy() {
    this.getGameInfoSub.unsubscribe();
    clearInterval(this.countInterval);
    this.getSpotSellers.unsubscribe();

    if (this.checkIfUserPaidSub !== undefined) {
      this.checkIfUserPaidSub.unsubscribe();
    }
  }

}
