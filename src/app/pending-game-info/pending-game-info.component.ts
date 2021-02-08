import {Component, Injectable, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {GamesService} from '../games.service';
import {SlotsService} from '../slots.service';
import {Subscription} from 'rxjs';
import {NgForm} from '@angular/forms';
import * as firebase from 'firebase';
import {MixpanelService} from '../mixpanel.service';

@Component({
  selector: 'app-pending-game-info',
  templateUrl: './pending-game-info.component.html',
  styleUrls: ['./pending-game-info.component.css']
})
@Injectable()
export class PendingGameInfoComponent implements OnInit, OnDestroy {
  @ViewChild('numberOfPpl', { static: false }) noOfPpl: NgForm;

  getGameInfoSub: Subscription;
  getGameIdSub: Subscription;
  getMembersSub: Subscription;
  getSemiHostsSub: Subscription;
  gethostSub: Subscription;


  tempGameId;
  semiHosts;
  hostFireStore;

  memberInvitees = [];
  semiHostInviters = [];

  countDownDate;
  countInterval;
  now;
  distance;

  maxPplAllowed;
  minPplAllowed;
  enoughPplIn;

  isHost;
  isSemiHost;
  isMember;
  noOfPplWithHostIncludingHost;
  noOfSemihostsInterested;
  noOfMembersInterested;
  totalPplIn = 0;
  pplNeededToHitMin; // = 0;
  pplNeededToHitMax; // = 0;

  constructor(private gameServiceAfs: GamesService,
              private slotsService: SlotsService,
              private route: ActivatedRoute,
              private router: Router,
              private mixpanelService: MixpanelService) { }

  ngOnInit() {
    this.isMember = false;
    this.isSemiHost = false;
    this.isHost = false;
    this.getGameIdSub = this.route.queryParams.subscribe((queryParams: Params) => {
      this.tempGameId = queryParams['game'];

      this.gameServiceAfs.getGame(this.tempGameId); // this line of code might be unnecessary

      this.getGameInfoSub = this.gameServiceAfs.game.subscribe((game) => {
        this.maxPplAllowed = game.max;
        this.minPplAllowed = game.min;
        this.enoughPplIn = game.enoughPplInterested;

        this.countDownDate = (game.date.seconds * 1000);

        this.countInterval = setInterval(() => {
          console.log('something');
          this.now = new Date().getTime();
          this.distance = this.countDownDate - this.now;

          if (this.distance < 0) {
            clearInterval(this.countInterval);
            console.log('countDown timer has hit zero');
          }
          }, 1000);

        this.gameServiceAfs.getHost(this.tempGameId).subscribe((host: any[]) => {
          this.noOfPplWithHostIncludingHost = host.length; // rn this will equal one as I havent added the 'bringing my bro with me' functionality
          this.gameServiceAfs.getSemiHosts(this.tempGameId).subscribe((semiHosts: any[]) => {
            this.noOfSemihostsInterested = semiHosts.length;
            this.gameServiceAfs.getMembers(this.tempGameId).subscribe((members: any[]) => {
              this.noOfMembersInterested = members.length;
              this.totalPplIn = this.noOfMembersInterested + this.noOfSemihostsInterested + this.noOfPplWithHostIncludingHost;
              this.pplNeededToHitMin = this.minPplAllowed - this.totalPplIn;
              this.pplNeededToHitMax = this.maxPplAllowed - this.totalPplIn;
              if (this.totalPplIn === this.maxPplAllowed) {
                // this.gameClosed = true;
                this.router.navigate(['/goneThrough']);
              } else {}
            });
          });
        });
      });
    });

    // check which role user is playing in this pending Game - note: if 2 participants in the game have the same name this will not work
    this.gethostSub = this.gameServiceAfs.getHost(this.tempGameId).subscribe(
      (host: any[]) => {
        this.hostFireStore = host[0].data.name;

        if (this.hostFireStore === firebase.auth().currentUser.displayName) {
          this.isHost = true;
        }
      }
    );

    this.getSemiHostsSub = this.gameServiceAfs.getSemiHosts(this.tempGameId).subscribe(
      (semiHosts: any[]) => {
        this.semiHosts = [];
        for (let semiHostIndexVal in semiHosts) {
          this.semiHosts.push(semiHosts[semiHostIndexVal].data.name);

          if (this.semiHosts.includes(firebase.auth().currentUser.displayName)) {
            this.isSemiHost = true;
          }
        }
      }
    );

    this.getMembersSub = this.gameServiceAfs.getMembers(this.tempGameId)
      .subscribe((members: any[]) => {
        this.semiHostInviters = [];
        this.memberInvitees = [];
        for (let indexVal in members) {
          // console.log(indexVal);
          this.memberInvitees.push(members[indexVal].data.name);
          this.semiHostInviters.push(members[indexVal].data.invitedBy);

          if (this.memberInvitees.includes(firebase.auth().currentUser.displayName)) {
            this.isMember = true;
          }
        }
      });
  }


  cancelBooking() {
    this.mixpanelService.track('yesImSureCancelBooking');
    console.log('about to cancel booking');
    this.gameServiceAfs.cancelBookingForHost(this.tempGameId);
    this.router.navigate(['/pendingGames'], {queryParams: {cancelledGame: this.tempGameId}});
  }

  directToMemberHowToInvite() {
    this.mixpanelService.track('isSemiHostInvitePendingGameInfo');
    this.router.navigate(['/memberHowToInvite'], { queryParams: {member: firebase.auth().currentUser.displayName.replace(/\s+/g, ''), game: this.tempGameId}});
  }

  directToInviteOthers() {
    this.mixpanelService.track('isHostInvitePendingGameInfo');
    this.router.navigate(['/inviteMembers'], { queryParams: {game: this.tempGameId}});
  }

  mixpanel(eventName: string) {
    this.mixpanelService.track(eventName);
  }

  ngOnDestroy() {
    this.getGameInfoSub.unsubscribe();
    this.getGameIdSub.unsubscribe();
    clearInterval(this.countInterval);
  }

}
