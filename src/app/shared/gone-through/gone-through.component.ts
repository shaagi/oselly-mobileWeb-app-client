import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {UsersService} from '../../users.service';
import * as firebase from 'firebase';
import {MixpanelService} from '../../mixpanel.service';
import {map, tap} from 'rxjs/operators';
import {AngularFirestore} from '@angular/fire/firestore';

interface FulfilledGame {
  startTimeSeconds: any;
  endTimeSeconds: any;
  gameId: string;
}

@Component({
  selector: 'app-gone-through',
  templateUrl: './gone-through.component.html',
  styleUrls: ['./gone-through.component.css']
})
export class GoneThroughComponent implements OnInit, OnDestroy {

  getUsersFulfilledGamesIds: Subscription;
  getFulfilledGameTimings: Subscription;
  fulfilledGames: FulfilledGame[] = [];

  isLoggedIn = false;

  constructor( private router: Router, private usersService: UsersService,
               private mixpanelService: MixpanelService, private afs: AngularFirestore) {}

  ngOnInit() {
    firebase.auth().onAuthStateChanged(
      (user) => {
        if (user) {
          this.isLoggedIn = true;
          this.getUsersFulfilledGamesIds = this.usersService.getUserInfo(user.email).pipe(
            map(res => res[0].data.fulfilledGames),
          ).subscribe(fulfilledGameIds => this.makeFulfilledGameObjects(fulfilledGameIds));
        } else {

        }
      }
    );
  }

  makeFulfilledGameObjects(gameIds: string[]) {
    gameIds = gameIds.reverse();
    this.fulfilledGames = [];
    let i;
    for (i in gameIds) {
      this.getFulfilledGameTimings = this.afs.collection('bookings').doc(gameIds[i]).get().pipe(
        tap(res => {
          if (res.exists === true) { // only purpose of this is so that the fulfilled games from the old 'games' collection don't throw errors
            const newFulfilledGameObj: FulfilledGame = {
              startTimeSeconds: res.data().time.startTime.seconds,
              endTimeSeconds: res.data().time.endTime.seconds,
              gameId: res.id,
            };
            this.fulfilledGames.push(newFulfilledGameObj);
          }
        })
      ).subscribe();
    }
  }

  mixpanel(eventName: string) {
    this.mixpanelService.track(eventName);
  }

  directToLogin() {
    this.mixpanelService.track('toLoginFromFulfilledGamesPage');
    this.router.navigate(['/login-from-fulfilled']);
  }

  ngOnDestroy() {
    if (this.getUsersFulfilledGamesIds !== undefined) {
      this.getUsersFulfilledGamesIds.unsubscribe();
    }
    if (this.getFulfilledGameTimings !== undefined) {
      this.getFulfilledGameTimings.unsubscribe();
    }
  }

}
