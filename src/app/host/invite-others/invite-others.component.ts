import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import * as firebase from 'firebase';
import {GamesService} from '../../games.service';
import {Subscription} from 'rxjs';
import {SlotsService} from '../../slots.service';
import {NgForm} from '@angular/forms';
import {MixpanelService} from '../../mixpanel.service';
import {ShareService} from '../../share.service';
import {ToastrService} from 'ngx-toastr';
import copy from 'clipboard-copy';


@Component({
  selector: 'app-invite-others',
  templateUrl: './invite-others.component.html',
  styleUrls: ['./invite-others.component.css']
})
export class InviteOthersComponent implements OnInit, OnDestroy {
  @ViewChild('numberOfPpl', { static: false }) noOfPpl: NgForm;

  getGameInfoSub: Subscription;
  getHostSub: Subscription;

  gameId;
  maxPplAllowed;
  minPplAllowed;
  gameClosed;

  countDownDate;
  countInterval;
  now;
  distance;

  hostName;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private gamesServiceAfs: GamesService,
              private slotsService: SlotsService,
              private mixpanelService: MixpanelService,
              private shareService: ShareService,
              private toastr: ToastrService) { }

  ngOnInit() {
    this.route.queryParams.subscribe((queryParams: Params) => {
      this.gameId = queryParams['game'];

      // check if game is closed
      this.gamesServiceAfs.getGame(this.gameId);
      this.getGameInfoSub = this.gamesServiceAfs.game.subscribe(data => {
        this.gameClosed = false;
        if (data.maxPplReached === true) {
          this.gameClosed = true;
        }
        this.maxPplAllowed = data.max;
        this.minPplAllowed = data.min;

        this.countDownDate = (data.date.seconds * 1000);

        this.countInterval = setInterval(() => {
          console.log('something');
          this.now = new Date().getTime();
          this.distance = this.countDownDate - this.now;

          if (this.distance < 0) {
            clearInterval(this.countInterval);
            console.log('countDown timer has hit zero');
          }

          }, 1000);

        this.getHostSub = this.gamesServiceAfs.getHost(this.gameId).subscribe((host: any[]) => {
          this.hostName = host[0].data.name;
          this.getHostSub.unsubscribe();
        });
      });
    });
  }


  shareWhatsapp() {
    this.mixpanelService.track('hostWhatsappToInvite');
    this.shareService.whatsapp(window.location.origin + '/memberFirstScreen?' + 'game=' + this.gameId);
  }

  shareMessenger() {
    // this.shareService.messenger(window.location.href);
    this.shareService.messenger(window.location.origin + '/memberFirstScreen?' + 'game=' + this.gameId);
  }

  getShareLink() {
    this.mixpanelService.track('hostCopyLinkToInvite');
    copy(window.location.origin + '/memberFirstScreen?' + 'game=' + this.gameId)
      .then(data => {
        console.log('it worked');
        return this.toastr.success('Link copied to clipboard');
      }).catch(err => {
        console.log(err);
        return this.toastr.error('copy didnt work, please open this page in Chromse/Safari and try again');
    });
  }


  mixpanel(eventName: string) {
    this.mixpanelService.track(eventName);
  }

  ngOnDestroy() {
    if (this.getGameInfoSub === undefined) {
    } else {
      this.getGameInfoSub.unsubscribe();
    }

    if (this.getHostSub === undefined) {
    } else {
      this.getHostSub.unsubscribe();
    }

    clearInterval(this.countInterval);

  }
}
