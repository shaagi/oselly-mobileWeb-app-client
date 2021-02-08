import { Component, OnInit } from '@angular/core';
import {MixpanelService} from '../../mixpanel.service';

@Component({
  selector: 'app-game-closed',
  templateUrl: './game-closed.component.html',
  styleUrls: ['./game-closed.component.css']
})
export class GameClosedComponent implements OnInit {

  constructor(private mixpanelService: MixpanelService) { }

  ngOnInit() {
  }

  mixpanel(eventName: string) {
    this.mixpanelService.track(eventName);
  }
}
