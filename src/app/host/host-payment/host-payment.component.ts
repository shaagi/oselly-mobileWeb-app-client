import {Component, OnDestroy, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';
import * as firebase from 'firebase';
import {MixpanelService} from '../../mixpanel.service';
import {GamesService} from '../../games.service';
import {ActivatedRoute, Params} from '@angular/router';
import {Subscription} from 'rxjs';
import {UsersService} from '../../users.service';
import {map} from 'rxjs/operators';

declare const Stripe;
const stripe: any = Stripe(environment.stripeKey); // put this in a service

@Component({
  selector: 'app-host-payment',
  templateUrl: './host-payment.component.html',
  styleUrls: ['./host-payment.component.css']
})
export class HostPaymentComponent implements OnInit, OnDestroy {
  private card: any;

  checkIfUserPaidSub: Subscription;
  authStateChangedUnsub: firebase.Unsubscribe;
  addGameSub: Subscription;

  errorMessage;
  error = false;
  loadingForPaymentSubmit = false;

  userEmail;

  numberOfOthersNeeded;

  constructor(private mixpanelService: MixpanelService,
              private gamesServiceAfs: GamesService,
              private route: ActivatedRoute,
              private usersService: UsersService) {}

  ngOnInit() {
    this.authStateChangedUnsub = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.userEmail = user.email;
        this.checkIfUserPaidSub = this.usersService.getUserInfo(user.email).subscribe(data => {
          if (data[0].data.givenPaymentInfo === true) {
            this.userAlreadyPaid(user.email);
          }
          this.checkIfUserPaidSub.unsubscribe();
        });
      }
    });

    this.route.queryParams.subscribe((queryParams: Params) => {
      this.numberOfOthersNeeded = Number(queryParams['min']) - 1;
      const startTimeInSeconds = parseInt(queryParams['slot'].substring(0, 10), 10);
      console.log(startTimeInSeconds);
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

  userAlreadyPaid(hostEmail: string) {
    this.addGameSub = this.route.queryParams.pipe(
      map(res => {
        const qParamString = res.slot;
        const startTimeSeconds = parseInt(qParamString.substring(0, 10), 10);
        const endTimeSeconds = parseInt(qParamString.substring(qParamString.length - 10, qParamString.length), 10);
        const min = parseInt(res.min, 10);
        const max = parseInt(res.max, 10);
        const courtId = qParamString.substring(10, qParamString.length - 10);

        if (min === 1) {
          return {
            min: min,
            max: max,
            startTime: startTimeSeconds,
            endTime: endTimeSeconds,
            hostEmail: hostEmail,
            courtId: courtId,
            enoughPplIn: true,
          };
        } else {
          return {
            min: min,
            max: max,
            startTime: startTimeSeconds,
            endTime: endTimeSeconds,
            hostEmail: hostEmail,
            courtId: courtId,
            enoughPplIn: false,
          };
        }
      }),
    ).subscribe(game => {
      this.gamesServiceAfs.addGame(game.min, game.max, game.startTime, game.endTime, game.enoughPplIn, game.hostEmail, game.courtId);
    });
  }

  submitPaymentForm() {
    this.mixpanelService.track('paymentFormSubmitHost');
    this.error = false;

    if (this.card._empty || this.card._invalid) {
      // make this message later if nothings working its obvious to the user they left it empty
    } else {
      stripe.createToken(this.card)
        .then((token) => {
          this.loadingForPaymentSubmit = true;
          console.log('Token: ', token);

          firebase.auth().onAuthStateChanged((user) => {
            if (user) {
              console.log('in authstate changed submit payment form');
              this.gamesServiceAfs.uponGivingPaymentInfoNew(user.email, token.token.id, user.uid).subscribe(res => {
                if (res === true) { // add a way to display card errors on the front end as if user cvc is wrong they dont know
                  console.log('payment info loaded onto user col');
                  this.userAlreadyPaid(user.email);
                } else {
                  console.log('res not equal to true');
                  this.loadingForPaymentSubmit = false;
                  this.error = true;
                  this.errorMessage = res.error.message;
                }
              });
            } else {
              // do nothing here
              this.loadingForPaymentSubmit = false;
            }
          });
        })
        .catch((error) => {
          console.log('Error: ', error);
        });
    }
  }

  ngOnDestroy() {
    if (this.checkIfUserPaidSub !== undefined) {
      this.checkIfUserPaidSub.unsubscribe();
    }

    if (this.addGameSub !== undefined) {
      this.addGameSub.unsubscribe();
    }

    this.authStateChangedUnsub();
  }

}
