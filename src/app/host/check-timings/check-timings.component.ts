import {Component, Injectable, OnDestroy, OnInit} from '@angular/core';
import {GamesService} from '../../games.service';
import * as firebase from 'firebase';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {UsersService} from '../../users.service';
import moment from 'moment';
import {MixpanelService} from '../../mixpanel.service';
import {ShareService} from '../../share.service';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-check-timings',
  templateUrl: './check-timings.component.html',
  styleUrls: ['./check-timings.component.css']
})
export class CheckTimingsComponent implements OnInit, OnDestroy {

  constructor(private gameServiceAfs: GamesService, private mixpanelService: MixpanelService,
              private shareService: ShareService) { }

  testEmailSub: Subscription;
  isMobile;



  ngOnInit() {
    if (this.shareService.isMobilePublic() === true) {
      console.log('is mobile');
      this.isMobile = true;
    } else {
      console.log('is not mobile');
      this.isMobile = false;
    }
  }

  mixpanel() {
    this.mixpanelService.track('toSlotsCheckTimings');
  }

  onGet() {
    this.testEmailSub = this.gameServiceAfs.testEmail().subscribe(data => {
      console.log(data);
    });
  }

  onGet1() {
  }

  ngOnDestroy() {
    if (this.testEmailSub !== undefined) {
      console.log('unsubbed to testEMail sub');
      this.testEmailSub.unsubscribe();
    }
  }

}
