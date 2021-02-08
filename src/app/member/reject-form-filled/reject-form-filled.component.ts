import { Component, OnInit } from '@angular/core';
import {MixpanelService} from '../../mixpanel.service';

@Component({
  selector: 'app-reject-form-filled',
  templateUrl: './reject-form-filled.component.html',
  styleUrls: ['./reject-form-filled.component.css']
})
export class RejectFormFilledComponent implements OnInit {

  constructor(private mixpanelService: MixpanelService) { }

  ngOnInit() {
  }

  mixpanel(eventName: string) {
    this.mixpanelService.track(eventName);
  }

}
