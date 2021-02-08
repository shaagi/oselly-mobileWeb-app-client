import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import {MixpanelService} from '../../mixpanel.service';

@Component({
  selector: 'app-gym-header',
  templateUrl: './gym-header.component.html',
  styleUrls: ['./gym-header.component.css']
})
export class GymHeaderComponent implements OnInit {
  email;

  constructor(private mixpanelService: MixpanelService) { }

  ngOnInit() {
    this.email = firebase.auth().currentUser.email;
  }

  mixpanelToProfile() {
    this.mixpanelService.track('toProfileGym');
  }

  mixpanelToSchedule() {
    this.mixpanelService.track('toScheduleGym');
  }

  mixpanelToContact() {
    this.mixpanelService.track('toContactGym');
  }

}
