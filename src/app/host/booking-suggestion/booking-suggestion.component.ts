import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';

@Component({
  selector: 'app-booking-suggestion',
  templateUrl: './booking-suggestion.component.html',
  styleUrls: ['./booking-suggestion.component.css']
})
export class BookingSuggestionComponent implements OnInit {

  qParamString;
  min;
  max;

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe((queryParams: Params) => {
      this.qParamString = queryParams['slot'];
      this.min = queryParams['min'];
      this.max = queryParams['max'];
    });
  }

  next() {
    this.router.navigate(['/signup'], {queryParams: {
        slot: this.qParamString, min: this.min, max: this.max}
    });
  }

}
