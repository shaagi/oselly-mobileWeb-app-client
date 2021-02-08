import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {UsersService} from '../users.service';
import * as firebase from 'firebase';
import {MixpanelService} from '../mixpanel.service';
import {map, tap} from 'rxjs/operators';
import {AngularFirestore} from '@angular/fire/firestore';
import {ActivatedRoute, Params} from '@angular/router';

interface PendingGame {
  startTimeSeconds: any;
  endTimeSeconds: any;
  gameId: string;
}

@Component({
  selector: 'app-pending-games',
  templateUrl: './pending-games.component.html',
  styleUrls: ['./pending-games.component.css']
})
export class PendingGamesComponent implements OnInit, OnDestroy {

  getUsersPendingGamesIds: Subscription;
  getPendingGameTimings: Subscription;
  checkIfJustCancelledGame: Subscription;
  pendingGames: PendingGame[] = [];
  justCancelledGame = false;

  constructor(private usersService: UsersService, private mixpanelService: MixpanelService,
              private afs: AngularFirestore, private route: ActivatedRoute) {}

  ngOnInit() {
    firebase.auth().onAuthStateChanged(
      (user) => {
        if (user) {
          this.getUsersPendingGamesIds = this.usersService.getUserInfo(user.email).pipe(
            map(res => res[0].data.pendingGames),
          ).subscribe(pendingGameIds => this.makePendingGameObjects(pendingGameIds));
        } else {

        }
      }
    );

    this.checkIfJustCancelledGame = this.route.queryParams.subscribe((queryParams: Params) => {
      if (queryParams['cancelledGame'] !== undefined) {
        this.justCancelledGame = true;
      }
    });
  }

  makePendingGameObjects(gameIds: string[]) {
    this.pendingGames = [];
    let i;
    for (i in gameIds) {
      this.getPendingGameTimings = this.afs.collection('bookings').doc(gameIds[i]).get().pipe(
        tap(res => {
          const newPendingGameObj: PendingGame = {
            startTimeSeconds: res.data().time.startTime.seconds,
            endTimeSeconds: res.data().time.endTime.seconds,
            gameId: res.id,
          };
          this.pendingGames.push(newPendingGameObj);
        })
      ).subscribe();
    }
  }

  mixpanel(eventName: string) {
    this.mixpanelService.track(eventName);
  }

  ngOnDestroy() {
    if (this.getUsersPendingGamesIds !== undefined) {
      this.getUsersPendingGamesIds.unsubscribe();
    }
    if (this.getPendingGameTimings !== undefined) {
      this.getPendingGameTimings.unsubscribe();
    }
    if (this.checkIfJustCancelledGame !== undefined) {
      this.checkIfJustCancelledGame.unsubscribe();
    }
  }

}
