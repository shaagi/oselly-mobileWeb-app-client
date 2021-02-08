import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';

@Component({
  selector: 'app-host-email',
  templateUrl: './host-email.component.html',
  styleUrls: ['./host-email.component.css']
})
export class HostEmailComponent implements OnInit {

  qParamString;
  min;
  max;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe((queryParams: Params) => {
      this.qParamString = queryParams['slot'];
      this.min = queryParams['min'];
      this.max = queryParams['max'];
    });
  }

  next() {
    this.router.navigate(['/hostEmailCorrectOrNot'], {
      queryParams: {slot: this.qParamString, min: this.min, max: this.max}
    });
  }

}
