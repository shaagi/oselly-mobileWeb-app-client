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
import {flatMap, map} from 'rxjs/operators';
import {AngularFirestore} from '@angular/fire/firestore';

@Component({
  selector: 'app-member-interested-invite',
  templateUrl: './member-interested-invite.component.html',
  styleUrls: ['./member-interested-invite.component.css']
})
export class MemberInterestedInviteComponent implements OnInit, OnDestroy {
  @ViewChild('numberOfPpl', { static: false }) noOfPpl: NgForm;

  gettingGameExpiry: Subscription;

  member;
  hostFirstName;

  gameId;
  NoOfMembersInterested;
  TotalNoOfPplInterested;
  maxPplAllowed;
  gameClosed;
  noOfPplWithHostIncludingHost;
  noOfSemihostsInterested;
  minPplAllowed;
  pplNeededToHitMin;
  pplNeededToHitMax;
  enoughPplIn;

  countDownDate;
  countInterval;
  now;
  distance;
  hoursLeft;
  minutesLeft;
  secondsLeft;
  secondsLeftRefined;
  minutesLeftRefined;

  constructor(private route: ActivatedRoute,
              private gameServiceAfs: GamesService,
              private slotsService: SlotsService,
              private mixpanelService: MixpanelService,
              private shareService: ShareService,
              private router: Router,) { }

  ngOnInit() {
    this.gameClosed = false;

    this.route.queryParams.subscribe((queryParams: Params) => {
      this.member = queryParams['member'];
      this.gameId = queryParams['game'];
      this.gameServiceAfs.getGame(this.gameId); // this line of code might be unnecessary

      this.gettingGameExpiry = this.gameServiceAfs.game.subscribe(game => {
        this.maxPplAllowed = game.max;
        this.minPplAllowed = game.min;
        console.log(game.enoughPplInterested);
        this.enoughPplIn = game.enoughPplInterested;

        this.countDownDate = (game.date.seconds * 1000);

        this.countInterval = setInterval(() => {
          console.log('something');
          this.now = new Date().getTime();
          this.distance = this.countDownDate - this.now;

          this.hoursLeft = Math.floor((this.distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          this.minutesLeft = Math.floor((this.distance % (1000 * 60 * 60)) / (1000 * 60));
          this.secondsLeft = Math.floor((this.distance % (1000 * 60)) / 1000);

          if (this.secondsLeft < 10) {
            this.secondsLeftRefined = '0' + this.secondsLeft;
          } else {
            this.secondsLeftRefined = this.secondsLeft;
          }

          if (this.minutesLeft < 10) {
            this.minutesLeftRefined = '0' + this.minutesLeft;
          } else {
            this.minutesLeftRefined = this.minutesLeft;
          }

          if (this.distance < 0) {
            clearInterval(this.countInterval);
            this.gameClosed = true;
            console.log('countDown timer has hit zero');
          }

          }, 1000);


        this.gameServiceAfs.getHost(this.gameId).subscribe((host: any[]) => {
          this.noOfPplWithHostIncludingHost = host.length; // rn this will equal one as I havent added the 'bringing my bro with me' functionality
          const fullName = host[0].data.name.split(' ');
          this.hostFirstName = fullName[0];
          this.gameServiceAfs.getSemiHosts(this.gameId).subscribe((semiHosts: any[]) => {
            this.noOfSemihostsInterested = semiHosts.length;
            this.gameServiceAfs.getMembers(this.gameId).subscribe((members: any[]) => {
              this.NoOfMembersInterested = members.length;
              this.TotalNoOfPplInterested = this.NoOfMembersInterested + this.noOfSemihostsInterested + this.noOfPplWithHostIncludingHost;
              this.pplNeededToHitMin = this.minPplAllowed - this.TotalNoOfPplInterested;
              this.pplNeededToHitMax = this.maxPplAllowed - this.TotalNoOfPplInterested;
              if (this.TotalNoOfPplInterested === this.maxPplAllowed) {
                this.gameClosed = true;
              } else {}
            });
          });
        });
      });
    });
  }

  toHowToInvitePage() {
    this.mixpanelService.track('inviteFriendsMemberInterestedInviteButton');
    this.router.navigate(['/memberHowToInvite'], {queryParams: {member: this.member, game: this.gameId}});
  }

  toPendingGames() {
    this.mixpanelService.track('semiHostToPendingRefusalToInvite');
    this.router.navigate(['/pendingGames']);
  }

  ngOnDestroy() {
    if (this.gettingGameExpiry === undefined) {
    } else {
      this.gettingGameExpiry.unsubscribe();
    }

    clearInterval(this.countInterval);

  }

}
