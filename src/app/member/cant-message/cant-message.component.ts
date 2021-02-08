import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {GamesService} from '../../games.service';
import {MixpanelService} from '../../mixpanel.service';

@Component({
  selector: 'app-cant-message',
  templateUrl: './cant-message.component.html',
  styleUrls: ['./cant-message.component.css']
})
export class CantMessageComponent implements OnInit {

  constructor(private router: Router, private gameServiceAfs: GamesService, private mixpanelService: MixpanelService) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    this.mixpanelService.track('saidNoInsteadOfSilenceAndHitSubmitOnCantForm');

    this.gameServiceAfs.cantFormSubmit(form.value.contactInfo);
    this.router.navigate(['/rejectFormFilled']);
  }

  // mixpanel() {
  //   // this.mixpanelService.track(eventName);
  //   // this.mixpanelService.track('saidNoInsteadOfSilenceAndHitSubmitOnCantForm');
  // }
}
