import {Component, OnDestroy, OnInit} from '@angular/core';
import {environment} from '../../environments/environment';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {MixpanelService} from '../mixpanel.service';
import {GamesService} from '../games.service';
import {Subscription} from 'rxjs';
import * as firebase from 'firebase';
import {UsersService} from '../users.service';

declare const Stripe;
const stripe: any = Stripe(environment.stripeKey); // put this in a service

@Component({
  selector: 'app-replace-payment',
  templateUrl: './replace-payment.component.html',
  styleUrls: ['./replace-payment.component.css']
})
export class ReplacePaymentComponent implements OnInit, OnDestroy {

  private card: any;

  errorMessage;
  error = false;
  loading = false;

  gameId;
  sellerUid;

  getPaymentResultSub: Subscription;
  conductReplaceSub: Subscription;
  userEmail;
  userUid;

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

  checkIfUserPaidSub: Subscription;

  replaceClosed = false;

  getSpotSellers: Subscription;

  constructor(private mixpanelService: MixpanelService, private gamesServiceAfs: GamesService,
              private route: ActivatedRoute, private usersService: UsersService,
              private router: Router) { }

  ngOnInit() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.userEmail = user.email;
        this.userUid = user.uid;
        // this.userDisplayName = user.displayName;
        this.checkIfUserPaidSub = this.usersService.getUserInfo(user.email).subscribe(data => {
          if (data[0].data.givenPaymentInfo === true) {
            this.route.queryParams.subscribe((queryParams: Params) => {
              this.gameId = queryParams['game'];
              this.sellerUid = queryParams['seller'];
              this.gamesServiceAfs.conductReplaceClient(this.gameId, this.sellerUid, this.userEmail);
              this.router.navigate(['/goneThrough']);
              });
          }
        });
      }
    });

    this.route.queryParams.subscribe((queryParams: Params) => {
      this.gameId = queryParams['game'];
      this.sellerUid = queryParams['seller'];

      this.getSpotSellers = this.gamesServiceAfs.getSpotSellers(this.gameId).subscribe((spotSellers: any[]) => {
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

      this.gamesServiceAfs.getGame(this.gameId); // this line of code might be unnecessary

      this.getGameInfoSub = this.gamesServiceAfs.game.subscribe((game) => {
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

          // this.hoursLeft = Math.floor((this.distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          this.hoursLeft = Math.floor((this.distance / (1000 * 60 * 60)));
          this.minutesLeft = Math.floor((this.distance % (1000 * 60 * 60)) / (1000 * 60));
          this.secondsLeft = Math.floor((this.distance % (1000 * 60)) / 1000);

          if (this.secondsLeft < 10) {
            this.secondsLeftRefined = '0' + this.secondsLeft;
          } else {
            this.secondsLeftRefined = this.secondsLeft;
          }

          if (this.minutesLeft < 10) {
            this.minutesLeftRefined = '0' + this.minutesLeft;
          } else {
            this.minutesLeftRefined = this.minutesLeft;
          }

          if (this.distance < 0) {
            clearInterval(this.countInterval);
            console.log('countDown timer has hit zero');
            this.replaceClosed = true;
            // this.gameClosed = true;
          }
          }, 1000);

      });
    });

    const elements = stripe.elements();

    // Custom styling can be passed to options when creating an Element.
    const style = {
      base: {
        // Add your base input styles here. For example:
        // fontSize: '16px',
        // color: "#32325d",

        color: '#32325d',
        lineHeight: '18px',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    };

// Create an instance of the card Element.
    this.card = elements.create('card', {style});

// Add an instance of the card Element into the `card-element` <div>.
    this.card.mount('#card-element');

    this.card.addEventListener('change', ({error}) => {
      const displayError = document.getElementById('card-errors');
      if (error) {
        displayError.textContent = error.message;
      } else {
        displayError.textContent = '';
      }
    });
  }

  submitPaymentForm() {
    this.mixpanelService.track('MemberPaymentFormSubmit');

    stripe.createToken(this.card).then((token) => {
      console.log('Token: ', token);
      this.loading = true;

      this.route.queryParams.subscribe((queryParams: Params) => {
        this.sellerUid = queryParams['seller'];
        this.gameId = queryParams['game'];

        if (token.token.id !== undefined) {
          this.getPaymentResultSub = this.gamesServiceAfs.uponGivingPaymentInfoReplace(this.userEmail, token.token.id, this.userUid)
            .subscribe(data => {
              console.log('success: ', data);
              if (data === true) {
                this.gamesServiceAfs.conductReplaceClient(this.gameId, this.sellerUid, this.userEmail);
                this.router.navigate(['/goneThrough']);
              }},
              (err) => {
              console.log('error ', err);
            });
        }
      });
    }).catch((error) => {
      console.log('Error: ', error);
    });
  }

  getDisplay() {
    return this.replaceClosed === true ? 'none' : 'block';
  }

  ngOnDestroy() {
    if (this.checkIfUserPaidSub !== undefined) {
      this.checkIfUserPaidSub.unsubscribe();
    }

    this.getGameInfoSub.unsubscribe();
    clearInterval(this.countInterval);

    if (this.getPaymentResultSub !== undefined) {
      this.getPaymentResultSub.unsubscribe();
    }
    if (this.conductReplaceSub !== undefined) {
      this.conductReplaceSub.unsubscribe();
    }

    this.getSpotSellers.unsubscribe();
  }

}
