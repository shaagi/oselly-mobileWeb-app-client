import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {GamesService} from '../games.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-booking-expiry-timer',
  templateUrl: './booking-expiry-timer.component.html',
  styleUrls: ['./booking-expiry-timer.component.css']
})
export class BookingExpiryTimerComponent implements OnInit, OnDestroy {

  gameId;
  countDownDate;
  countInterval;
  now;
  distance;
  daysLeft;
  hoursLeft;
  minutesLeft;
  secondsLeft;
  secondsLeftRefined;
  minutesLeftRefined;
  gettingCountDownInfo: Subscription;

  constructor(private route: ActivatedRoute, private gamesServiceAfs: GamesService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(
      (queryParams: Params) => {
        // this.member = queryParams['member'];
        if (queryParams['memberAndGame'] === undefined) {
          this.gameId = queryParams['game'];
        } else {
          const memberAndGameQParam = queryParams['memberAndGame'];
          const pos = memberAndGameQParam.search('0se11y') + 6;
          this.gameId = memberAndGameQParam.substring(pos);
        }

        this.gamesServiceAfs.getGame(this.gameId);
        // console.log('this is what were sending to firebase as the inviter' + this.member);
        this.gettingCountDownInfo = this.gamesServiceAfs.game.subscribe( // unsub to this it was giving problems if you touched anything on firebase
          (game) => {
            this.countDownDate = (game.date.seconds * 1000);

            this.countInterval = setInterval(() => {
              console.log('something');
              this.now = new Date().getTime();
              this.distance = this.countDownDate - this.now;

              this.daysLeft = Math.floor(this.distance / (1000 * 60 * 60 * 24));
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
                console.log('countDown timer has hit zero');
              }

            }, 1000);

          }
        );
      });
  }

  ngOnDestroy() {
    if (this.gettingCountDownInfo !== undefined) {
      this.gettingCountDownInfo.unsubscribe();
    }
    clearInterval(this.countInterval);
  }

}
