import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {GamesService} from '../../games.service';
import {SlotsService} from '../../slots.service';
import {Subscription} from 'rxjs';
import {MixpanelService} from '../../mixpanel.service';
import {flatMap, map, tap} from 'rxjs/operators';
import moment from 'moment';
import 'moment-timezone';
import {AngularFirestore} from '@angular/fire/firestore';

@Component({
  selector: 'app-min-max-choice',
  templateUrl: './min-max-choice.component.html',
  styleUrls: ['./min-max-choice.component.css']
})
export class MinMaxChoiceComponent implements OnInit, OnDestroy {
  @ViewChild('numberOfPpl', { static: false }) noOfPpl: NgForm;

  slotCost;
  userPaysIfMinPpl;
  userPaysIfMaxPpl;
  defaultMaxPpl = 12;
  defaultMinPpl = 8;

  slotBooked;
  checkVacancySub: Subscription;
  courtId;

  startTimeSeconds;
  endTimeSeconds;
  duration;

  getSlotCostSub: Subscription;
  qParamString = '';


  constructor( private router: Router,
               private gameServiceAfs: GamesService,
               private slotsService: SlotsService,
               private route: ActivatedRoute,
               private mixpanelService: MixpanelService,
               private afs: AngularFirestore) { }

  ngOnInit() {

    this.getSlotCostSub = this.route.queryParams.pipe(
      map(res => {
        this.qParamString = res.slot;
        this.startTimeSeconds = this.qParamString.substring(0, 10);
        this.endTimeSeconds = this.qParamString.substring(this.qParamString.length - 10, this.qParamString.length);
        this.duration = moment.unix(this.endTimeSeconds).diff(moment.unix(this.startTimeSeconds), 'minutes');
        this.courtId = this.qParamString.substring(10, this.qParamString.length - 10);
        return this.qParamString.substring(10, this.qParamString.length - 10); // courtId
      }),
      flatMap(courtId => this.afs.collection('courts').doc(courtId).get()),
      map(res => res.data().gym.id),
      flatMap(gymId => this.afs.collection('gyms').doc(gymId).get()),
      map(gymDocSnapshot => gymDocSnapshot.data()),
    ).subscribe(gymData => {
      if (this.duration === 60) {
        this.slotCost = gymData.cost60Min;
      } else if (this.duration === 90) {
        this.slotCost = gymData.cost90Min;
      } else if (this.duration === 120) {
        this.slotCost = gymData.cost120Min;
      }

      this.userPaysIfMinPpl = (this.slotCost / this.noOfPpl.value.minPpl).toFixed(2);
      this.userPaysIfMaxPpl = (this.slotCost / this.noOfPpl.value.maxPpl).toFixed(2);
    });

    this.slotBooked = false;

    const slotStartTimeMoment = moment.unix(this.startTimeSeconds);
    const slotEndTimeMoment = moment.unix(this.endTimeSeconds);
    const startOfDayOfSlot = moment(slotStartTimeMoment).tz('America/Toronto').startOf('day').toDate();
    const endOfDayOfSlot = moment(slotEndTimeMoment).tz('America/Toronto').endOf('day').toDate();

    this.checkVacancySub = this.slotsService.getBookings(startOfDayOfSlot, endOfDayOfSlot).pipe(
      map(bookingsArray => {
        let bookingsOnThisCourt = [];
        let i;
        for (i in bookingsArray) {
          if (bookingsArray[i].court.id === this.courtId) {
            bookingsArray[i].time.startTime = moment.unix((bookingsArray[i].time.startTime.seconds));
            bookingsArray[i].time.endTime = moment.unix((bookingsArray[i].time.endTime.seconds));
            bookingsOnThisCourt.push(bookingsArray[i]);
          }
        }
        return bookingsOnThisCourt;
      }),
      tap(bookingsOnThisCourt => {
        let i;
        // console.log(slotStartTimeMoment);
        // console.log(slotEndTimeMoment);
        // console.log(bookingsOnThisCourt);
        for (i in bookingsOnThisCourt) {
          if (
            slotStartTimeMoment.isSame(bookingsOnThisCourt[i].time.startTime)
            || slotEndTimeMoment.isBetween(bookingsOnThisCourt[i].time.startTime, bookingsOnThisCourt[i].time.endTime)
            || slotStartTimeMoment.isBetween(bookingsOnThisCourt[i].time.startTime, bookingsOnThisCourt[i].time.endTime)
            || slotEndTimeMoment.isSame(bookingsOnThisCourt[i].time.endTime)
            || bookingsOnThisCourt[i].time.startTime.isBetween(slotStartTimeMoment, slotEndTimeMoment)
            || bookingsOnThisCourt[i].time.endTime.isBetween(slotStartTimeMoment, slotEndTimeMoment)
          ) {
            console.log('problematic slot is: ');
            console.log(bookingsOnThisCourt[i]);
            this.slotBooked = true;
          }
        }
      }),
    ).subscribe();

  }

  getSlotCost() {
    this.userPaysIfMinPpl = (this.slotCost / this.defaultMinPpl).toFixed(2);
    this.userPaysIfMaxPpl = (this.slotCost / this.defaultMaxPpl).toFixed(2);
  }

  decreaseMin() {
    this.mixpanelService.track('minMaxDecreaseMin');
    this.defaultMinPpl = this.noOfPpl.value.minPpl;
    this.defaultMinPpl = this.defaultMinPpl - 1;
    this.getSlotCost();
  }

  increaseMin() {
    this.mixpanelService.track('minMaxIncreaseMin');
    this.defaultMinPpl = this.noOfPpl.value.minPpl;
    this.defaultMinPpl = this.defaultMinPpl + 1;
    this.getSlotCost();
  }

  decreaseMax() {
    this.mixpanelService.track('minMaxDecreaseMax');
    this.defaultMaxPpl = this.noOfPpl.value.maxPpl;
    this.defaultMaxPpl = this.defaultMaxPpl - 1;
    this.getSlotCost();
  }

  increaseMax() {
    this.mixpanelService.track('minMaxIncreaseMax');
    this.defaultMaxPpl = this.noOfPpl.value.maxPpl;
    this.defaultMaxPpl = this.defaultMaxPpl + 1;
    this.getSlotCost();
  }


  sendMinMaxValues() {
    this.router.navigate(['/bookingSuggestion'], {queryParams: {
      slot: this.qParamString, min: this.noOfPpl.value.minPpl, max: this.noOfPpl.value.maxPpl}
    });
  }

  ngOnDestroy() {
    this.checkVacancySub.unsubscribe();
    if (this.getSlotCostSub !== undefined) {this.getSlotCostSub.unsubscribe(); }

  }

}
