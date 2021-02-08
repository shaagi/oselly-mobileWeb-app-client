import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {MixpanelService} from '../../mixpanel.service';

@Component({
  selector: 'app-just-booked',
  templateUrl: './just-booked.component.html',
  styleUrls: ['./just-booked.component.css']
})
export class JustBookedComponent implements OnInit {

  constructor(private router: Router, private mixpanelService: MixpanelService) { }

  ngOnInit() {
  }

  routeToSlots() {
    this.mixpanelService.track('justBookedCheckOtherSlots');
    this.router.navigate(['/slots']);
  }

}
