import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {SlotsService} from '../slots.service';
import {Subscription} from 'rxjs';
import {GamesService} from '../games.service';
import {AngularFirestore} from '@angular/fire/firestore';
import {flatMap, map, tap} from 'rxjs/operators';

@Component({
  selector: 'app-gym-name-and-pic',
  templateUrl: './gym-name-and-pic.component.html',
  styleUrls: ['./gym-name-and-pic.component.css']
})
export class GymNameAndPicComponent implements OnInit, OnDestroy {

  gameId;
  gymName;
  gymPicFileName;
  startTimeSeconds;
  endTimeSeconds;
  gymAddress;

  getGameInfoSub: Subscription;
  getGymNameAndPicViaGameIdSub: Subscription;
  getSlotInfoViaCourtIdSub: Subscription;
  getSlotInfoViaMemberAndGameIdSub: Subscription;

  constructor(private route: ActivatedRoute, private slotsService: SlotsService, private gameServiceAfs: GamesService, private afs: AngularFirestore) { }

  ngOnInit() {
    this.route.queryParams.subscribe((queryParams: Params) => {
      if (queryParams['game'] !== undefined) {
        this.loadViaGameId();
      } else if (queryParams['slot'] !== undefined) {
        this.loadViaSlot();
      } else if (queryParams['memberAndGame'] !== undefined) {
        this.loadViaMemberAndGame();
      }
    });
  }

  loadViaMemberAndGame() {
    this.getSlotInfoViaMemberAndGameIdSub = this.route.queryParams.pipe(
      map(res => {
        const qParamString = res.memberAndGame;
        const pos = qParamString.search('0se11y') + 6;
        return qParamString.substring(pos);
      }),
      flatMap(gameId => this.afs.collection('bookings').doc(gameId).get()),
      map(docSnapshot => docSnapshot.data()),
      flatMap(game => {
        this.startTimeSeconds = game.time.startTime.seconds;
        this.endTimeSeconds = game.time.endTime.seconds;
        return this.afs.collection('courts').doc(game.court.id).get();
      }),
      map(courtDocSnapshot => courtDocSnapshot.data())
    ).subscribe(courtData => {
      this.gymPicFileName = 'assets/' + courtData.gymPicFileName;
      this.gymName = courtData.gymFullName;
      this.gymAddress = courtData.gymAddress;
    });
  }

  loadViaSlot() {
    this.getSlotInfoViaCourtIdSub = this.route.queryParams.pipe(
      map(res => {
        const qParamString = res.slot;
        this.startTimeSeconds = qParamString.substring(0, 10);
        this.endTimeSeconds = qParamString.substring(qParamString.length - 10, qParamString.length);
        return qParamString.substring(10, qParamString.length - 10);
      }),
      flatMap(courtId => this.afs.collection('courts').doc(courtId).get()),
      map(res => res.data()),
    ).subscribe(courtData => {
      this.gymPicFileName = 'assets/' + courtData.gymPicFileName;
      this.gymName = courtData.gymFullName;
      this.gymAddress = courtData.gymAddress;
    });
  }

  loadViaGameId() {
    this.getGymNameAndPicViaGameIdSub = this.route.queryParams.pipe(
      map(res => res.game),
      flatMap(gameId => this.afs.collection('bookings').doc(gameId).get()),
      map(docSnapshot => docSnapshot.data()),
      flatMap(game => {
        this.startTimeSeconds = game.time.startTime.seconds;
        this.endTimeSeconds = game.time.endTime.seconds;
        return this.afs.collection('courts').doc(game.court.id).get();
      }),
      map(courtDocSnapshot => courtDocSnapshot.data())
    ).subscribe(courtData => {
      this.gymPicFileName = 'assets/' + courtData.gymPicFileName;
      this.gymName = courtData.gymFullName;
      this.gymAddress = courtData.gymAddress;
    });
  }


  getImage() {
    // 'url(assets/FletchersGym.JPG)'
    return 'url(' + this.gymPicFileName + ')';
  }

  ngOnDestroy() {
    if (this.getSlotInfoViaCourtIdSub !== undefined) {this.getSlotInfoViaCourtIdSub.unsubscribe(); }
    if (this.getGymNameAndPicViaGameIdSub !== undefined) {this.getGymNameAndPicViaGameIdSub.unsubscribe(); }
    if (this.getSlotInfoViaMemberAndGameIdSub !== undefined) {this.getSlotInfoViaMemberAndGameIdSub.unsubscribe(); }
  }

}
