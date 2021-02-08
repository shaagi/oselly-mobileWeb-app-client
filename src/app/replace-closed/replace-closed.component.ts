import { Component, OnInit } from '@angular/core';
import {MixpanelService} from '../mixpanel.service';

@Component({
  selector: 'app-replace-closed',
  templateUrl: './replace-closed.component.html',
  styleUrls: ['./replace-closed.component.css']
})
export class ReplaceClosedComponent implements OnInit {

  constructor(private mixpanelService: MixpanelService) { }

  ngOnInit() {
  }

  mixpanel(eventName: string) {
    this.mixpanelService.track(eventName);
  }

}
