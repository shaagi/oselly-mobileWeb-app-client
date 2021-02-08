import {Component, OnDestroy, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';
import * as firebase from 'firebase';
import {Params, Router} from '@angular/router';
import {UsersService} from '../../users.service';
import {Subscription} from 'rxjs';
import {MixpanelService} from '../../mixpanel.service';

declare const Stripe;
const stripe: any = Stripe(environment.stripeKey); // put this in a service

@Component({
  selector: 'app-login-reg-payment',
  templateUrl: './login-reg-payment.component.html',
  styleUrls: ['./login-reg-payment.component.css']
})
export class LoginRegPaymentComponent implements OnInit, OnDestroy {

  private card: any;
  checkIfUserPaidSub: Subscription;
  getPaymentResultSub: Subscription;
  userUid;
  userEmail;

  errorMessage;
  error = false;
  loading = false;

  authStateChangedSub: firebase.Unsubscribe;

  constructor(private usersService: UsersService, private router: Router, private mixpanelService: MixpanelService) { }

  ngOnInit() {
    this.authStateChangedSub = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.userUid = user.uid;
        this.userEmail = user.email;
        this.checkIfUserPaidSub = this.usersService.getUserInfo(user.email).subscribe(data => {
          if (data[0].data.givenPaymentInfo === true) {
            this.router.navigate(['/slots']);
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
    this.mixpanelService.track('loginRegPaymentFormSubmit');

    stripe.createToken(this.card)
      .then((token) => {
        console.log('Token: ', token);
        this.loading = true;
        // firebase.auth().onAuthStateChanged((user) => {
        //   if (user) {
        //
        //   } else {
        //     // do nothing here
        //   }
        // });

        if (token.token.id !== undefined) {
          this.getPaymentResultSub = this.usersService.loginRegUponGivingPaymentInfo(this.userEmail, token.token.id, this.userUid).subscribe(
            data => {
              console.log('success: ', data);
              if (data === true) {
                this.loading = false;
                this.router.navigate(['/slots']);
              } else {
                this.loading = false;
                this.error = true;
                console.log(data.error.message);
                this.errorMessage = data.error.message;
              }
            },
            (err) => {
              console.log('error: ', err);
            }
          );
          console.log('went through from client side');
          // this.router.navigate(['/slots']);
        }



      })
      .catch((error) => {
        console.log('Error: ', error);
      });
  }

  ngOnDestroy() {
    if (this.checkIfUserPaidSub !== undefined) {
      this.checkIfUserPaidSub.unsubscribe();
    }
    if (this.getPaymentResultSub !== undefined) {
      this.getPaymentResultSub.unsubscribe();
    }

    this.authStateChangedSub();
  }

}
