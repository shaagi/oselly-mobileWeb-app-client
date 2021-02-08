import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import {MixpanelService} from '../../mixpanel.service';

@Component({
  selector: 'app-is-auth-header',
  templateUrl: './is-auth-header.component.html',
  styleUrls: ['./is-auth-header.component.css']
})
export class IsAuthHeaderComponent implements OnInit {
  name;
  constructor(private mixpanelService: MixpanelService) { }

  ngOnInit() {
    this.name = firebase.auth().currentUser.displayName;
  }

  mixpanel(eventName: string) {
    this.mixpanelService.track(eventName);
  }

  mixpanelToPending() {
    this.mixpanelService.track('toPending');
  }

  mixpanelStartGame() {
    this.mixpanelService.track('startGameUser');
  }

  mixpanelToFulfilled() {
    this.mixpanelService.track('toFulfilled');
  }

  mixpanelNavBarBrand() {
    this.mixpanelService.track('navBarBrandUser');
  }

  mixpanelToContactUs() {
    this.mixpanelService.track('toContactUsUser');
  }

  mixpanelToHowItWorks() {
    this.mixpanelService.track('toHowItWorksUser');
  }

  mixpanelToProfile() {
    this.mixpanelService.track('toProfile');
  }
}
