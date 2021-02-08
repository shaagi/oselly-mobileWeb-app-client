import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {GamesService} from '../../games.service';
import {SlotsService} from '../../slots.service';
import {NgForm} from '@angular/forms';
import {MixpanelService} from '../../mixpanel.service';
import * as firebase from 'firebase';
import {UsersService} from '../../users.service';
import {Meta, Title} from '@angular/platform-browser';

@Component({
  selector: 'app-member-member-first-screen',
  templateUrl: './member-member-first-screen.component.html',
  styleUrls: ['./member-member-first-screen.component.css']
})
export class MemberMemberFirstScreenComponent implements OnInit, OnDestroy {
  @ViewChild('numberOfPpl', { static: false }) noOfPpl: NgForm;

  getGameInfoSub: Subscription;

  member;
  memberString: String;
  memberRefined: String;
  title;

  gameId;

  countDownDate;
  countInterval;
  now;
  distance;

  maxPplAllowed;
  minPplAllowed;

  userPaymentInfoLinked;
  checkIfUserPaidSub: Subscription;
  closeModal;

  gameClosed;

  noOfPplWithHostIncludingHost;
  noOfSemihostsInterested;
  NoOfMembersInterested;
  TotalNoOfPplInterested;

  constructor(private route: ActivatedRoute,
              private gameServiceAfs: GamesService,
              private slotsService: SlotsService,
              private mixpanelService: MixpanelService,
              private router: Router,
              private usersService: UsersService,
              private titleService: Title,
              private metaService: Meta) { }

  ngOnInit() {
    this.closeModal = false;
    this.userPaymentInfoLinked = false;
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.checkIfUserPaidSub = this.usersService.getUserInfo(user.email).subscribe(data => {
          if (data[0].data.givenPaymentInfo === true) {
            this.userPaymentInfoLinked = true;
          } else {
            this.userPaymentInfoLinked = false;
          }
        });
      }
    });

    this.route.queryParams.subscribe((queryParams: Params) => {
      const memberAndGameQParam = queryParams['memberAndGame'];
      this.member = memberAndGameQParam.substr(0, memberAndGameQParam.indexOf('0se11y'));
      this.memberRefined = this.gameServiceAfs.addSpacesToMemberName(this.member);
      this.title = this.memberRefined + ' has invited you to play basketball | Oselly';
      this.titleService.setTitle(this.title);
      this.metaService.updateTag({name: 'twitter:title', content: this.title});
      this.metaService.updateTag({name: 'twitter:image:alt', content: this.title});
      this.metaService.updateTag({property: 'og:image:alt', content: this.title});
      this.metaService.updateTag({property: 'og:title', content: this.title});
      this.metaService.updateTag({name: 'title', content: this.title});

      const pos = memberAndGameQParam.search('0se11y') + 6;
      this.gameId = memberAndGameQParam.substring(pos);

      this.gameServiceAfs.getGame(this.gameId); // this line of code might be unnecessary

      this.getGameInfoSub = this.gameServiceAfs.game.subscribe((game) => {
        if (game === undefined) { // booking failed and its now in the 'bookingsFailed' collection
          this.gameClosed = true;
        } else {
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
        }

      });
    });
  }

  mixpanel(eventName: string) {
    this.mixpanelService.track(eventName);
  }

  directToHowItWorks() {
    this.mixpanelService.track('howItWorksMemberMemberFirstScreen');
    // this.router.navigate(['/', 'howItWorks'], {fragment: 'howItWorks'});
    this.router.navigate(['/howItWorksMember']);
  }

  imSure() {
    this.mixpanelService.track('memberMemberFirstScreenImInImSure');
    this.closeModal = true;
  }

  ngOnDestroy() {
    this.titleService.setTitle('Oselly Basketball');
    this.metaService.removeTag(`name='twitter:title'`);
    this.metaService.removeTag(`name='twitter:image:alt'`);
    this.metaService.removeTag(`property='og:image:alt'`);
    this.metaService.removeTag(`property='og:title'`);
    this.metaService.removeTag(`name='title'`);

    if (this.getGameInfoSub === undefined) {
    } else {
      this.getGameInfoSub.unsubscribe();
    }
    clearInterval(this.countInterval);

    if (this.checkIfUserPaidSub !== undefined) {
      this.checkIfUserPaidSub.unsubscribe();
    }
  }

}
