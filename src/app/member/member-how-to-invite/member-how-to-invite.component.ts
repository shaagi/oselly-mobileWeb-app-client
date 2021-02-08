import {Component, OnDestroy, OnInit} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {MixpanelService} from '../../mixpanel.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {GamesService} from '../../games.service';
import {ShareService} from '../../share.service';
import copy from 'clipboard-copy';

@Component({
  selector: 'app-member-how-to-invite',
  templateUrl: './member-how-to-invite.component.html',
  styleUrls: ['./member-how-to-invite.component.css']
})
export class MemberHowToInviteComponent implements OnInit, OnDestroy {

  getGameInfoSub: Subscription;

  member;
  memberRefined: String;

  gameId;

  countDownDate;
  countInterval;
  now;
  distance;

  maxPplAllowed;
  minPplAllowed;

  gameClosed;
  inviteUrl;

  noOfPplWithHostIncludingHost;
  noOfSemihostsInterested;
  NoOfMembersInterested;
  TotalNoOfPplInterested;

  displayPendingGamesMessage = false;

  constructor(private toastr: ToastrService, private mixpanelService: MixpanelService,
              private route: ActivatedRoute, private gameServiceAfs: GamesService,
              private shareService: ShareService, private router: Router,) { }

  ngOnInit() {
    this.route.queryParams.subscribe((queryParams: Params) => {
      this.member = queryParams['member'];
      this.memberRefined = this.gameServiceAfs.addSpacesToMemberName(this.member);
      this.gameId = queryParams['game'];
      this.inviteUrl = window.location.origin + '/memberMemberFirstScreen?' + 'memberAndGame=' + this.member + '0se11y' + this.gameId;

      this.gameServiceAfs.getGame(this.gameId); // this line of code might be unnecessary

      this.getGameInfoSub = this.gameServiceAfs.game.subscribe((game) => {
        this.maxPplAllowed = game.max;
        this.minPplAllowed = game.min;

        const currDate = new Date();
        console.log('currDate is: ' + currDate);
        console.log('expiry date is: ' + currDate);
        if (currDate > game.date.toDate()) {
          this.gameClosed = true;
        } else {
          this.gameClosed = false;
        }

        this.countDownDate = (game.date.seconds * 1000);

        this.countInterval = setInterval(() => {
          console.log('something');
          this.now = new Date().getTime();
          this.distance = this.countDownDate - this.now;

          if (this.distance < 0) {
            clearInterval(this.countInterval);
            console.log('countDown timer has hit zero');
            this.gameClosed = true;
          }

          }, 1000);

        this.gameServiceAfs.getHost(this.gameId).subscribe((host: any[]) => {
          this.noOfPplWithHostIncludingHost = host.length; // rn this will equal one as I havent added the 'bringing my bro with me' functionality
          this.gameServiceAfs.getSemiHosts(this.gameId).subscribe((semiHosts: any[]) => {
            this.noOfSemihostsInterested = semiHosts.length;
            this.gameServiceAfs.getMembers(this.gameId).subscribe((members: any[]) => {
              this.NoOfMembersInterested = members.length;
              this.TotalNoOfPplInterested = this.NoOfMembersInterested + this.noOfSemihostsInterested + this.noOfPplWithHostIncludingHost;
              if (this.TotalNoOfPplInterested === this.maxPplAllowed) {
                this.gameClosed = true;
              } else {}
            });
          });
        });
      });
    });
  }

  getShareLink() {
    this.mixpanelService.track('semiHostCopyLinkToInvite');
    copy(this.inviteUrl)
      .then(data => {
        console.log('it worked');
        setTimeout(() => {
          this.displayPendingGamesMessage = true;
        }, 10000);
        return this.toastr.success('Link copied to clipboard');
      }).catch(err => {
        console.log(err);
        return this.toastr.error('copy didnt work, please open this page in Chromse/Safari and try again');
    });
  }

  shareWhatsapp() {
    setTimeout(() => {
      this.displayPendingGamesMessage = true;
    }, 10000);
    this.mixpanelService.track('semiHostWhatsappToInvite');
    this.shareService.whatsapp(this.inviteUrl);
  }

  shareMessenger() {
    this.shareService.messenger(this.inviteUrl);
  }

  toPendingGames() {
    this.mixpanelService.track('semiHostToPendingAfterInviteButtonClick');
    this.router.navigate(['/pendingGames']);
  }

  mixpanel(eventName: string) {
    this.mixpanelService.track(eventName);
  }

  ngOnDestroy() {
    if (this.getGameInfoSub === undefined) {
    } else {
      this.getGameInfoSub.unsubscribe();
    }
    clearInterval(this.countInterval);
  }

}
