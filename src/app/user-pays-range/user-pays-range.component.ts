import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {Subscription} from 'rxjs';
import {flatMap, map} from 'rxjs/operators';
import {AngularFirestore} from '@angular/fire/firestore';
import moment from 'moment';

@Component({
  selector: 'app-user-pays-range',
  templateUrl: './user-pays-range.component.html',
  styleUrls: ['./user-pays-range.component.css']
})
export class UserPaysRangeComponent implements OnInit, OnDestroy {

  userPaysIfMinPpl;
  minPpl;
  userPaysIfMaxPpl;
  maxPpl;
  slotCost;
  duration;
  getBothUserPaysValueViaGameQParamSub: Subscription;
  getBothUserPaysValueViaMemberAndGameSub: Subscription;

  constructor(private route: ActivatedRoute, private afs: AngularFirestore) { }

  ngOnInit() {
    this.route.queryParams.subscribe((queryParams: Params) => {
      if (queryParams['game'] !== undefined) {
        this.loadViaGameId();
      } else if (queryParams['memberAndGame'] !== undefined) {
        this.loadViaMemberAndGame();
      }
    });
  }

  loadViaMemberAndGame() {
    this.getBothUserPaysValueViaMemberAndGameSub = this.route.queryParams.pipe(
      map(res => {
        const qParamString = res.memberAndGame;
        const pos = qParamString.search('0se11y') + 6;
        return qParamString.substring(pos);
      }),
      flatMap(gameId => this.afs.collection('bookings').doc(gameId).get()),
      map(res => {
        this.minPpl = res.data().min;
        this.maxPpl = res.data().max;
        this.duration = moment.unix(res.data().time.endTime.seconds).diff(moment.unix(res.data().time.startTime.seconds), 'minutes');
        return res.data().court.id;
      }),
      flatMap(courtId => this.afs.collection('courts').doc(courtId).get()),
      map(res => res.data().gym.id),
      flatMap(gymId => this.afs.collection('gyms').doc(gymId).get()),
      map(res => res.data())
    ).subscribe(gymData => {
      if (this.duration === 60) {
        this.slotCost = gymData.cost60Min;
      } else if (this.duration === 90) {
        this.slotCost = gymData.cost90Min;
      } else if (this.duration === 120) {
        this.slotCost = gymData.cost120Min;
      }

      this.userPaysIfMinPpl = (this.slotCost / this.minPpl).toFixed(2);
      this.userPaysIfMaxPpl = (this.slotCost / this.maxPpl).toFixed(2);
    });
  }

  loadViaGameId() {
    this.getBothUserPaysValueViaGameQParamSub = this.route.queryParams.pipe(
      map(res => res.game),
      flatMap(gameId => this.afs.collection('bookings').doc(gameId).get()),
      map(res => {
        this.minPpl = res.data().min;
        this.maxPpl = res.data().max;
        this.duration = moment.unix(res.data().time.endTime.seconds).diff(moment.unix(res.data().time.startTime.seconds), 'minutes');
        return res.data().court.id;
      }),
      flatMap(courtId => this.afs.collection('courts').doc(courtId).get()),
      map(res => res.data().gym.id),
      flatMap(gymId => this.afs.collection('gyms').doc(gymId).get()),
      map(res => res.data())
    ).subscribe(gymData => {
      if (this.duration === 60) {
        this.slotCost = gymData.cost60Min;
      } else if (this.duration === 90) {
        this.slotCost = gymData.cost90Min;
      } else if (this.duration === 120) {
        this.slotCost = gymData.cost120Min;
      }

      this.userPaysIfMinPpl = (this.slotCost / this.minPpl).toFixed(2);
      this.userPaysIfMaxPpl = (this.slotCost / this.maxPpl).toFixed(2);
    });
  }

  ngOnDestroy() {
    if (this.getBothUserPaysValueViaGameQParamSub !== undefined) {
      this.getBothUserPaysValueViaGameQParamSub.unsubscribe();
    }

    if (this.getBothUserPaysValueViaMemberAndGameSub !== undefined) {
      this.getBothUserPaysValueViaMemberAndGameSub.unsubscribe();
    }
  }
}
