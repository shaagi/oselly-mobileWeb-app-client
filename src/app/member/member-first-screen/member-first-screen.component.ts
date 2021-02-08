import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {from, observable, Subscription} from 'rxjs';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {GamesService} from '../../games.service';
import DocumentData = firebase.firestore.DocumentData;
import {SlotsService} from '../../slots.service';
import {NgForm} from '@angular/forms';
import {MixpanelService} from '../../mixpanel.service';
import * as firebase from 'firebase';
import {UsersService} from '../../users.service';
import {Meta, Title} from '@angular/platform-browser';

@Component({
  selector: 'app-member-first-screen',
  templateUrl: './member-first-screen.component.html',
  styleUrls: ['./member-first-screen.component.css']
})
export class MemberFirstScreenComponent implements OnInit, OnDestroy {
  @ViewChild('numberOfPpl', { static: false }) noOfPpl: NgForm;
  getGameInfoSub: Subscription;
  getHostSub: Subscription;

  tempGameId;

  hostFireStore;
  title;

  countDownDate;
  countInterval;
  now;
  distance;

  maxPplAllowed;
  minPplAllowed;
  gameClosed;

  userPaymentInfoLinked;
  checkIfUserPaidSub: Subscription;
  closeModal;
  constructor( private route: ActivatedRoute,
               private gameServiceAfs: GamesService,
               private slotsService: SlotsService,
               private mixpanelService: MixpanelService,
               private router: Router,
               private usersService: UsersService,
               private titleService: Title,
               private metaService: Meta) {}

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
      // trying firestore start here
      this.route.queryParams.subscribe(
        (queryParams: Params) => {
          this.tempGameId = queryParams['game'];

          this.gameServiceAfs.getGame(this.tempGameId); // this line of code might be unnecessary

          this.getGameInfoSub = this.gameServiceAfs.game.subscribe((game) => {
            console.log(game);
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
              }
            });

          this.getHostSub = this.gameServiceAfs.getHost(this.tempGameId).subscribe((host: any[]) => {
            if (host.length !== 0) {
              this.hostFireStore = host[0].data.name;
              this.title = this.hostFireStore + ' has invited you to play basketball | Oselly';
              this.titleService.setTitle(this.title);
              this.metaService.updateTag({name: 'twitter:title', content: this.title});
              this.metaService.updateTag({name: 'twitter:image:alt', content: this.title});
              this.metaService.updateTag({property: 'og:image:alt', content: this.title});
              this.metaService.updateTag({property: 'og:title', content: this.title});
              this.metaService.updateTag({name: 'title', content: this.title});
            }
          });
        }
      );
    }

  directToHowItWorks() {
    this.mixpanelService.track('howItWorksMemberFirstScreen');
    // this.router.navigate(['/', 'howItWorks'], {fragment: 'howItWorks'});
    this.router.navigate(['/howItWorksSemiHost']);
  }

  mixpanel(eventName: string) {
    this.mixpanelService.track(eventName);
  }

  imSure() {
    this.mixpanelService.track('memberFirstScreenImInYesImSure');
    this.closeModal = true;
  }
  ngOnDestroy() {
    this.titleService.setTitle('Oselly Basketball');
    this.metaService.removeTag(`name='twitter:title'`);
    this.metaService.removeTag(`name='twitter:image:alt'`);
    this.metaService.removeTag(`property='og:image:alt'`);
    this.metaService.removeTag(`property='og:title'`);
    this.metaService.removeTag(`name='title'`);

    this.getGameInfoSub.unsubscribe();
    clearInterval(this.countInterval);

    if (this.getHostSub !== undefined) {
      this.getHostSub.unsubscribe();
    }

    if (this.checkIfUserPaidSub !== undefined) {
      this.checkIfUserPaidSub.unsubscribe();
    }
  }
}
