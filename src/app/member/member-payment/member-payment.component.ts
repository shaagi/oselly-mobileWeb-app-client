import {Component, OnDestroy, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';
import * as firebase from 'firebase';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {GamesService} from '../../games.service';
import {UsersService} from '../../users.service';
import {Subscription} from 'rxjs';
import {MixpanelService} from '../../mixpanel.service';

declare const Stripe;
const stripe: any = Stripe(environment.stripeKey); // put this in a service

@Component({
  selector: 'app-member-payment',
  templateUrl: './member-payment.component.html',
  styleUrls: ['./member-payment.component.css']
})
export class MemberPaymentComponent implements OnInit, OnDestroy {

  private card: any;
  gameId;
  userEmail;
  checkIfUserPaidSub: Subscription;

  getGameInfoSub: Subscription;
  minPplAllowed;
  maxPplAllowed;

  getPaymentResultSub: Subscription;
  userUid;
  userDisplayNameNoSpaces;

  errorMessage;
  error = false;
  loading = false;

  constructor(private route: ActivatedRoute,
              private gamesServiceAfs: GamesService,
              private router: Router,
              private usersService: UsersService,
              private mixpanelService: MixpanelService) { }

  ngOnInit() {
    this.userEmail = null;

    this.route.queryParams.subscribe((queryParams: Params) => {
      this.gameId = queryParams['game'];
      this.gamesServiceAfs.getGame(this.gameId); // this line of code might be unnecessary
      this.getGameInfoSub = this.gamesServiceAfs.game.subscribe((game) => {
        this.minPplAllowed = game.min;
        this.maxPplAllowed = game.max;
        });
    });

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.userEmail = user.email;
        this.userUid = user.uid;
        this.userDisplayNameNoSpaces = user.displayName.replace(/\s+/g, '');
        this.checkIfUserPaidSub = this.usersService.getUserInfo(user.email).subscribe(data => {
          if (data[0].data.givenPaymentInfo === true) {
            this.route.queryParams.subscribe(
              (queryParams: Params) => {
                this.gameId = queryParams['game'];
                this.gamesServiceAfs.addSemiHostToGame(this.gameId, this.userEmail);
                this.router.navigate(['/memberInviteOthers'], { queryParams: {member: this.userDisplayNameNoSpaces, game: this.gameId}});
              }
            );
          }
        });
      }
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
    this.mixpanelService.track('semiHostPaymentFormSubmit');

    stripe.createToken(this.card)
      .then((token) => {
        console.log('Token: ', token);

        this.loading = true;

        this.route.queryParams.subscribe((queryParams: Params) => {
          this.gameId = queryParams['game'];

          if (token.token.id !== undefined) {
            this.getPaymentResultSub = this.gamesServiceAfs.uponGivingPaymentInfoNew(this.userEmail, token.token.id, this.userUid).subscribe(res => {
              if (res === true) {
                this.loading = false;
                this.gamesServiceAfs.addSemiHostToGame(this.gameId, this.userEmail);
                this.router.navigate(['/memberInviteOthers'], { queryParams: {member: this.userDisplayNameNoSpaces, game: this.gameId}});
                console.log('payment info loaded successfully');
              } else {
                this.loading = false;
                this.error = true;
                this.errorMessage = res.error.message;
              }
            });
          }
        });

      })
      .catch((error) => {
        console.log('Error: ', error);
      });
  }

  ngOnDestroy() {
    if (this.checkIfUserPaidSub !== undefined) {
      this.checkIfUserPaidSub.unsubscribe();
    }
    if (this.getGameInfoSub !== undefined) {
      this.getGameInfoSub.unsubscribe();
    }
    if (this.getPaymentResultSub !== undefined) {
      this.getPaymentResultSub.unsubscribe();
    }
  }

}
