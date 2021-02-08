import { Component, OnInit } from '@angular/core';
import {Params, Router} from '@angular/router';

@Component({
  selector: 'app-host-phone-number',
  templateUrl: './host-phone-number.component.html',
  styleUrls: ['./host-phone-number.component.css']
})
export class HostPhoneNumberComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {

  }

  phoneNumberSubmitted() {
    this.router.navigate(['/hostPayment']);
  }

}
