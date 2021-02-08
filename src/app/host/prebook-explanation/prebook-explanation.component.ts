import {Component, OnDestroy, OnInit} from '@angular/core';
import {map} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import * as firebase from 'firebase';
import {GamesService} from '../../games.service';
import {MixpanelService} from '../../mixpanel.service';

@Component({
  selector: 'app-prebook-explanation',
  templateUrl: './prebook-explanation.component.html',
  styleUrls: ['./prebook-explanation.component.css']
})
export class PrebookExplanationComponent implements OnInit, OnDestroy {

  startTimeSeconds;
  decisionDeadline;
  getDecisionDeadlineSub: Subscription;
  authStateChangedUnsub: firebase.Unsubscribe;
  addGameSub: Subscription;
  userEmail;

  constructor(private route: ActivatedRoute, private gamesServiceAfs: GamesService,
              private mixpanelService: MixpanelService) { }

  ngOnInit() {
    this.getDecisionDeadlineSub = this.route.queryParams.pipe(
      map(res => {
        const qParamString = res.slot;
        this.startTimeSeconds = Number(qParamString.substring(0, 10));
        return this.decisionDeadline = this.startTimeSeconds - 86400;
      }),
    ).subscribe();

    this.authStateChangedUnsub = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.userEmail = user.email;
        console.log(this.userEmail);
      }
    });
  }

  userAlreadyPaid(hostEmail: string) {
    this.addGameSub = this.route.queryParams.pipe(
      map(res => {
        const qParamString = res.slot;
        const startTimeSeconds = parseInt(qParamString.substring(0, 10), 10);
        const endTimeSeconds = parseInt(qParamString.substring(qParamString.length - 10, qParamString.length), 10);
        const min = parseInt(res.min, 10);
        const max = parseInt(res.max, 10);
        const courtId = qParamString.substring(10, qParamString.length - 10);

        if (min === 1) {
          return {
            min: min,
            max: max,
            startTime: startTimeSeconds,
            endTime: endTimeSeconds,
            hostEmail: hostEmail,
            courtId: courtId,
            enoughPplIn: true,
          };
        } else {
          return {
            min: min,
            max: max,
            startTime: startTimeSeconds,
            endTime: endTimeSeconds,
            hostEmail: hostEmail,
            courtId: courtId,
            enoughPplIn: false,
          };
        }
      }),
    ).subscribe(game => {
      this.gamesServiceAfs.addGame(game.min, game.max, game.startTime, game.endTime, game.enoughPplIn, game.hostEmail, game.courtId);
    });
  }

  initiateBooking() {
    this.mixpanelService.track('initiateBookingPrebookExplanation');
    this.userAlreadyPaid(this.userEmail);
  }

  ngOnDestroy() {
    this.getDecisionDeadlineSub.unsubscribe();

    if (this.addGameSub !== undefined) {
      this.addGameSub.unsubscribe();
    }
  }

}
