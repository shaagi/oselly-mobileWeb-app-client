import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {Subscription} from 'rxjs';
import {MixpanelService} from '../mixpanel.service';
import {GamesService} from '../games.service';
import {flatMap, map} from 'rxjs/operators';
import moment from 'moment';
import {AngularFirestore} from '@angular/fire/firestore';

@Component({
  selector: 'app-replace-info',
  templateUrl: './replace-info.component.html',
  styleUrls: ['./replace-info.component.css']
})
export class ReplaceInfoComponent implements OnInit, OnDestroy {

  getSpotBuyersSub: Subscription;
  getGameIdSub: Subscription;
  gethostSub: Subscription;
  getSemiHostsSub: Subscription;
  getMembersSub: Subscription;
  getSpotSellers: Subscription;
  tempGameId;
  noOfPplInGame = 0;
  hostFireStore; // might be unnecessary
  semiHosts;
  members;
  illPay;
  sellerUid;
  seller;
  getSlotCostViaGameIdSub: Subscription;
  duration;
  slotCost;
  spotBuyers;

  getGameInfoSub: Subscription;
  countDownDate;
  countInterval;
  now;
  distance;
  hoursLeft;
  minutesLeft;
  secondsLeft;
  secondsLeftRefined;
  minutesLeftRefined;

  constructor(private mixpanelService: MixpanelService,
              private route: ActivatedRoute,
              private gameServiceAfs: GamesService,
              private afs: AngularFirestore) { }

  ngOnInit() {
    this.getGameIdSub = this.route.queryParams.subscribe((queryParams: Params) => {
      this.tempGameId = queryParams['game'];
      this.sellerUid = queryParams['seller'];

      this.gameServiceAfs.getGame(this.tempGameId); // this line of code might be unnecessary

      this.getGameInfoSub = this.gameServiceAfs.game.subscribe( // unsub to this it was giving problems if you touched anything on firebase
        (game) => {
          const currDate = new Date();
          console.log('currDate is: ' + currDate);
          console.log('expiry date is: ' + currDate);
          // if (currDate > game.finalizeByDate.toDate()) {
          //   this.replaceClosed = true;
          // }

          this.countDownDate = (game.finalizeByDate.seconds * 1000);

          this.countInterval = setInterval(() => {
            console.log('something');
            this.now = new Date().getTime();
            this.distance = this.countDownDate - this.now;

            this.hoursLeft = Math.floor((this.distance / (1000 * 60 * 60)));
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
              // this.replaceClosed = true;
            }

          }, 1000);

        }
      );

      this.gethostSub = this.gameServiceAfs.getHost(this.tempGameId).subscribe((host: any[]) => {
        this.noOfPplInGame = 1;
      });

      this.getSemiHostsSub = this.gameServiceAfs.getSemiHosts(this.tempGameId).subscribe((semiHosts: any[]) => {
        this.semiHosts = [];
        for (let semiHostIndexVal in semiHosts) {
          this.semiHosts.push(semiHosts[semiHostIndexVal].data.name);
        }
        this.noOfPplInGame = this.noOfPplInGame + this.semiHosts.length;
      });

      this.getMembersSub = this.gameServiceAfs.getMembers(this.tempGameId).subscribe((members: any[]) => {
        this.members = [];
        for (let indexVal in members) {
          this.members.push(members[indexVal].data.name);
        }
        this.noOfPplInGame = this.noOfPplInGame + this.members.length;
      });

      this.getSpotBuyersSub = this.gameServiceAfs.getSpotBuyers(this.tempGameId).subscribe((spotBuyers: any[]) => {
        this.spotBuyers = [];
        for (let indexVal in spotBuyers) {
          this.spotBuyers.push(spotBuyers[indexVal].data.name);
        }
        this.noOfPplInGame = this.noOfPplInGame + this.spotBuyers.length;
      });

      this.getSpotSellers = this.gameServiceAfs.getSpotSellers(this.tempGameId).subscribe((spotSellers: any[]) => {
        for (let indexVal in spotSellers) {
          if (this.sellerUid === spotSellers[indexVal].id) {
            this.seller = spotSellers[indexVal].data.name;
          }
        }
      });
    });

    this.getSlotCostViaGameIdSub = this.route.queryParams.pipe(
      map(res => res.game),
      flatMap(gameId => this.afs.collection('bookings').doc(gameId).get()),
      map(res => {
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
      this.illPay = (this.slotCost / this.noOfPplInGame).toFixed(2);
    });
  }

  ngOnDestroy() {
    if (this.getGameIdSub !== undefined) {
      this.getGameIdSub.unsubscribe();
    }
    if (this.getSpotBuyersSub !== undefined) {
      this.getSpotBuyersSub.unsubscribe();
    }
    if (this.gethostSub !== undefined) {
      this.gethostSub.unsubscribe();
    }
    if (this.getSemiHostsSub !== undefined) {
      this.getSemiHostsSub.unsubscribe();
    }
    if (this.getMembersSub !== undefined) {
      this.getMembersSub.unsubscribe();
    }
    if (this.getSlotCostViaGameIdSub !== undefined) {
      this.getSlotCostViaGameIdSub.unsubscribe();
    }
    if (this.getSpotSellers !== undefined) {
      this.getSpotSellers.unsubscribe();
    }

    if (this.getGameInfoSub !== undefined) {
      this.getGameInfoSub.unsubscribe();
    }
  }

}
