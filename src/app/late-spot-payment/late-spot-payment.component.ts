import { Component, OnInit } from '@angular/core';
import {environment} from '../../environments/environment';

declare const Stripe;
const stripe: any = Stripe(environment.stripeKey); // put this in a service

@Component({
  selector: 'app-late-spot-payment',
  templateUrl: './late-spot-payment.component.html',
  styleUrls: ['./late-spot-payment.component.css']
})
export class LateSpotPaymentComponent implements OnInit {
  private card: any;

  constructor() { }

  ngOnInit() {
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

}
