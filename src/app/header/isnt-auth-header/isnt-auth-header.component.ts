import { Component, OnInit } from '@angular/core';
import {MixpanelService} from '../../mixpanel.service';

@Component({
  selector: 'app-isnt-auth-header',
  templateUrl: './isnt-auth-header.component.html',
  styleUrls: ['./isnt-auth-header.component.css']
})
export class IsntAuthHeaderComponent implements OnInit {

  constructor(private mixpanelService: MixpanelService) { }

  ngOnInit() {
  }

  // mixpanel(eventName: string) {
  //   this.mixpanelService.track(eventName);
  // }

  mixpanelStartGame() {
    this.mixpanelService.track('startGameNonUser');
  }

  mixpanelContactUs() {
    this.mixpanelService.track('toContactUsNonUser');
  }

  mixpanelToImGym() {
    this.mixpanelService.track('toImAGym');
  }

  mixpanelToHowItWorks() {
    this.mixpanelService.track('toHowItWorksNonUser');
  }

  mixpanelLoginReg() {
    this.mixpanelService.track('loginReg');
  }

  mixpanelNavBarBrand() {
    this.mixpanelService.track('navBarBrandNonUser');
  }

  mixpanelToggle() {
    this.mixpanelService.track('toggleNonUser');
  }
}
