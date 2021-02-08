import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {MixpanelService} from '../mixpanel.service';
import {ActivatedRoute, Params} from '@angular/router';
import {Subscription} from 'rxjs';
import {flatMap, map} from 'rxjs/operators';
import {AngularFirestore} from '@angular/fire/firestore';
import moment from 'moment';

@Component({
  selector: 'app-user-pays-calculator',
  templateUrl: './user-pays-calculator.component.html',
  styleUrls: ['./user-pays-calculator.component.css']
})
export class UserPaysCalculatorComponent implements OnInit, OnDestroy {
  @ViewChild('numberOfPpl', { static: true }) noOfPpl: NgForm;

  userPays;
  defaultNoOfPpl = 10;
  slotCost;

  getSlotCostViaGameIdSub: Subscription;

  duration;

  constructor(private mixpanelService: MixpanelService,
              private route: ActivatedRoute,
              private afs: AngularFirestore) { }

  ngOnInit() {
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
      this.userPays = (this.slotCost / this.defaultNoOfPpl).toFixed(2);
    });
  }

  numberChanged() {
    this.mixpanelService.track('numberChangedUserPays');
    this.userPays = (this.slotCost / this.noOfPpl.value.totalPpl).toFixed(2);
  }

  decreaseTotal() {
    this.mixpanelService.track('decreaseTotalUserPays');
    this.defaultNoOfPpl = this.noOfPpl.value.totalPpl;
    this.defaultNoOfPpl = this.defaultNoOfPpl - 1;
    this.noOfPpl.value.totalPpl = this.defaultNoOfPpl;
    this.userPays = (this.slotCost / this.defaultNoOfPpl).toFixed(2);
  }

  increaseTotal() {
    this.mixpanelService.track('increaseTotalUserPays');
    this.defaultNoOfPpl = this.noOfPpl.value.totalPpl;
    this.defaultNoOfPpl = this.defaultNoOfPpl + 1;
    this.userPays = (this.slotCost / this.defaultNoOfPpl).toFixed(2);
  }

  ngOnDestroy() {
    if (this.getSlotCostViaGameIdSub !== undefined) {
      this.getSlotCostViaGameIdSub.unsubscribe();
    }
  }
}
