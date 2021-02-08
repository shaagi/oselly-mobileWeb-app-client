import {Component, OnDestroy, OnInit} from '@angular/core';
import {MixpanelService} from '../../mixpanel.service';
import moment from 'moment';
import 'moment-timezone';
import {SlotsService} from '../../slots.service';
import {EMPTY, from, Observable, Subject, Subscription} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import {map, tap} from 'rxjs/operators';
import {Router} from '@angular/router';

interface Slot {
  startTime: any;
  endTime: any;
  courtRef?: any;
  gymRef?: any;
  gymName?: string;
  startTimeForSorting?: any;
  endTimeForNextStep?: any;
  startTimeForNextStep?: any;
}

@Component({
  selector: 'app-slots',
  templateUrl: './slots.component.html',
  styleUrls: ['./slots.component.css']
})
export class SlotsComponent implements OnInit, OnDestroy {

  selectedMonth;
  day1;
  day2;
  day3;
  day4;
  date1;
  date2;
  date3;
  date4;

  selectedDateMoment;
  currDateMoment;

  dateSelected;
  selectedDuration = 1;


  displaySlotsFormatted: Slot[] = [];

  getCurrDayBookingsSub: Subscription;
  getBookingsSelectDateSub: Subscription;
  getBookingsSelectDurationSub: Subscription;
  getCourtsToGenerateTodaysAvailableTimesSub: Subscription;

  headedToPastDay = false;
  headedToPastMonth = false;
  cannotDisplayPastError = false;

  constructor(private mixpanelService: MixpanelService,
              private slotsService: SlotsService,
              private afs: AngularFirestore,
              private router: Router) { }

  ngOnInit() {
    this.currDateMoment = moment(new Date()).add(2, 'days').tz('America/Toronto');
    this.selectedDateMoment = this.currDateMoment;
    this.headedToPastDay = true;
    this.headedToPastMonth = true;

    this.selectedMonth = this.currDateMoment.format('MMMM');

    if (moment(this.selectedDateMoment).format('MMMM') !== moment(this.selectedDateMoment).add(3, 'days').format('MMMM')) {
      this.selectedMonth = moment(this.selectedDateMoment).format('MMMM') + '-' +  moment(this.selectedDateMoment).add(3, 'days').format('MMMM');
    }

    this.day1 = this.currDateMoment.format('ddd'); // moment(this.currDateMoment).subtract(1, 'days').format('ddd');
    this.date1 = moment(this.currDateMoment).format('D'); // moment(this.currDateMoment).subtract(1, 'days').format('D');

    this.day2 = moment(this.currDateMoment).add(1, 'days').format('ddd');
    this.date2 = moment(this.currDateMoment).add(1, 'days').format('D');

    this.day3 = moment(this.currDateMoment).add(2, 'days').format('ddd');
    this.date3 = moment(this.currDateMoment).add(2, 'days').format('D');

    this.day4 = moment(this.currDateMoment).add(3, 'days').format('ddd');
    this.date4 = moment(this.currDateMoment).add(3, 'days').format('D');

    this.dateSelected = this.date1;

    // const now = new Date();
    // const oneDayFromNowMoment = moment(new Date()).add(1, 'days');
    // const startOfTomorrow = moment(oneDayFromNowMoment).startOf('day').toDate();

    const twoDaysFromTodayStartOfDay = moment(this.currDateMoment).startOf('day').toDate();
    const threeDaysFromTodayStartOfDay = moment(this.currDateMoment).add(1, 'days').startOf('day').toDate();
    const threeDaysFromTodayStartOfDayPlus2Hours = moment(this.currDateMoment).add(1, 'days').startOf('day')
      .add(2, 'hours').toDate();

    // const testObs = new Observable((observer: any) => {
    //   observer.next();
    // });

    this.getCurrDayBookingsSub = this.slotsService.getBookings(twoDaysFromTodayStartOfDay, threeDaysFromTodayStartOfDayPlus2Hours).pipe(
      map(bookingsArray => {
        console.log(twoDaysFromTodayStartOfDay);
        console.log(threeDaysFromTodayStartOfDay);
        console.log(threeDaysFromTodayStartOfDayPlus2Hours);
        let firestoreSlots: Slot[] = [];
        let i;
        for (i in bookingsArray) {
          if (moment.unix(bookingsArray[i].time.startTime.seconds).tz('America/Toronto').isDST() === false) {
            console.log('is not daylight saving');
            const newFirestoreSlot: Slot = {
              startTime: moment.unix(bookingsArray[i].time.startTime.seconds).add(1, 'hours'),
              endTime: moment.unix(bookingsArray[i].time.endTime.seconds).add(1, 'hours'),
              courtRef: bookingsArray[i].court,
            };
            firestoreSlots.push(newFirestoreSlot);
          } else {
            const newFirestoreSlot: Slot = {
              startTime: moment.unix(bookingsArray[i].time.startTime.seconds),
              endTime: moment.unix(bookingsArray[i].time.endTime.seconds),
              courtRef: bookingsArray[i].court,
            };
            firestoreSlots.push(newFirestoreSlot);
          }
        }
        console.log(firestoreSlots);
        return firestoreSlots;
      }),
    )
      .subscribe(firestoreSlots => {
        const slotStartTime = moment(twoDaysFromTodayStartOfDay);
        const durationInHours = 1;
        this.generateAvailableTimes(slotStartTime, firestoreSlots, threeDaysFromTodayStartOfDay, durationInHours);
      });


    // const obs = new Observable();
    //
    // obs.flatMap(...).flatMap(...).finalize(...).subscribe();
    //
    // obs.pipe(
    //   flatMap(),
    //   flatMap(),
    //   finalize()
    // ).subscribe();
    //
    // this.afs.collection('courts').get().pipe(
    //   flatMap((snapshot: QuerySnapshot) => {
    //
    //   })
    // ).subscribe(
    //   (data) => console.log('Data: ', data),
    //   (err: FirebaseError) => console.error('Erro: ', err)
    // );

  }

  generateAvailableTimes(slotStartTime: any, firestoreSlots: Slot[], startOfTomorrow, durationInHours: number) {
   this.getCourtsToGenerateTodaysAvailableTimesSub = this.afs.collection('courts').get().pipe(
      tap(res => {
        if (slotStartTime.isBefore(moment())) {
          slotStartTime = moment().add(1, 'hours').startOf('hour');
        }
      }),
      map(res => res.docs),
      map(queryDocSnapshotArray => {
        const closedSlotsAndRawSlots: {closedSlots: Slot[], rawSlots: Slot[]}[] = [];
        const originalSlotStartTime = slotStartTime;

        let i;

        for (i in queryDocSnapshotArray) {
          const rawSlotsThisCourt: Slot[] = [];
          const closedSlotsThisCourt: Slot[] = [];

          let j;
          for (j in queryDocSnapshotArray[i].data().closedHours) {
            const timeBlock: Slot = {
              startTime: moment(slotStartTime).tz('America/Toronto').startOf('day').add(queryDocSnapshotArray[i].data().closedHours[j].start , 'hours'),
              endTime: moment(slotStartTime).tz('America/Toronto').startOf('day').add(queryDocSnapshotArray[i].data().closedHours[j].end , 'hours'),
            };
            closedSlotsThisCourt.push(timeBlock);
          }

          closedSlotsAndRawSlots.push({closedSlots: closedSlotsThisCourt, rawSlots: []});

          while (moment(slotStartTime).isBefore(startOfTomorrow)) {
            const newSlot: Slot = {
              startTime: slotStartTime,
              endTime: moment(slotStartTime).add(durationInHours, 'hours'),
              courtRef: queryDocSnapshotArray[i].ref,
              gymName: queryDocSnapshotArray[i].data().gymName,
            };
            rawSlotsThisCourt.push(newSlot);
            slotStartTime = moment(slotStartTime).add(0.5, 'hours');
          }

          closedSlotsAndRawSlots[i].rawSlots = rawSlotsThisCourt;
          slotStartTime = originalSlotStartTime;
        }

        return closedSlotsAndRawSlots;
      }),
      map( closedSlotsAndRawSlots => {
        const courtArrayOfSlotsArrays = [];
        let i;
        let j;
        let k;

        for (i in closedSlotsAndRawSlots) {
          const closedTimeBlocks = closedSlotsAndRawSlots[i].closedSlots;
          const eliminatedSlots: Slot[] = [];
          const displaySlots: Slot[] = [];

          for (j in closedSlotsAndRawSlots[i].rawSlots) {
            for (k in closedTimeBlocks) {
              if (
                closedSlotsAndRawSlots[i].rawSlots[j].startTime.isSame(closedTimeBlocks[k].startTime)
                ||
                closedSlotsAndRawSlots[i].rawSlots[j].endTime.isBetween(closedTimeBlocks[k].startTime, closedTimeBlocks[k].endTime)
                ||
                closedSlotsAndRawSlots[i].rawSlots[j].startTime.isBetween(closedTimeBlocks[k].startTime, closedTimeBlocks[k].endTime)
              ) {
                eliminatedSlots.push(closedSlotsAndRawSlots[i].rawSlots[j]);
              } else if (displaySlots.includes(closedSlotsAndRawSlots[i].rawSlots[j]) === false) {
                displaySlots.push(closedSlotsAndRawSlots[i].rawSlots[j]);
              }
            }

            let m;
            let n;

            for (m in displaySlots) {
              for (n in eliminatedSlots) {
                if (displaySlots[m] === eliminatedSlots[n]) {
                  delete displaySlots[m];
                }
              }
            }
          }

          courtArrayOfSlotsArrays.push(displaySlots);
        }
        return courtArrayOfSlotsArrays;
      }),
      map(courtArrayOfSlotsArrays => {
        const displaySlotsFormatted: Slot[] = [];

        let i;
        let j;
        let k;

        for (i in courtArrayOfSlotsArrays) {
          const eliminatedSlots: Slot[] = [];
          const displaySlots: Slot[] = [];

          for (j in courtArrayOfSlotsArrays[i]) {
            if (firestoreSlots.length === 0) {
              displaySlots.push(courtArrayOfSlotsArrays[i][j]);
            } else {
              for (k in firestoreSlots) {
                if (
                  (courtArrayOfSlotsArrays[i][j].startTime.isSame(firestoreSlots[k].startTime)
                    && courtArrayOfSlotsArrays[i][j].courtRef.path === firestoreSlots[k].courtRef.path)
                  ||
                  (courtArrayOfSlotsArrays[i][j].endTime.isBetween(firestoreSlots[k].startTime, firestoreSlots[k].endTime)
                    && courtArrayOfSlotsArrays[i][j].courtRef.path === firestoreSlots[k].courtRef.path)
                  ||
                  (courtArrayOfSlotsArrays[i][j].startTime.isBetween(firestoreSlots[k].startTime, firestoreSlots[k].endTime)
                    && courtArrayOfSlotsArrays[i][j].courtRef.path === firestoreSlots[k].courtRef.path)
                  ||
                  (courtArrayOfSlotsArrays[i][j].endTime.isSame(firestoreSlots[k].endTime)
                    && courtArrayOfSlotsArrays[i][j].courtRef.path === firestoreSlots[k].courtRef.path)
                  ||
                  (firestoreSlots[k].startTime.isBetween(courtArrayOfSlotsArrays[i][j].startTime, courtArrayOfSlotsArrays[i][j].endTime)
                    && courtArrayOfSlotsArrays[i][j].courtRef.path === firestoreSlots[k].courtRef.path)
                  ||
                  (firestoreSlots[k].endTime.isBetween(courtArrayOfSlotsArrays[i][j].startTime, courtArrayOfSlotsArrays[i][j].endTime)
                    && courtArrayOfSlotsArrays[i][j].courtRef.path === firestoreSlots[k].courtRef.path)
                ) {
                  eliminatedSlots.push(courtArrayOfSlotsArrays[i][j]);
                } else if (displaySlots.includes(courtArrayOfSlotsArrays[i][j]) === false) {
                  displaySlots.push(courtArrayOfSlotsArrays[i][j]);
                }
              }
            }

            let l;
            let m;

            for (l in displaySlots) {
              for (m in eliminatedSlots) {
                if (displaySlots[l] === eliminatedSlots[m]) {
                  delete displaySlots[l];
                }
              }
            }
          }

          let n;

          for (n in displaySlots) {
            const newSlot: Slot = {
              startTime: displaySlots[n].startTime.tz('America/Toronto').format('h:mm A'),
              endTime: displaySlots[n].endTime.tz('America/Toronto').format('h:mm A'),
              gymName: displaySlots[n].gymName, // displaySlots[n].courtRef.id,
              startTimeForSorting: displaySlots[n].startTime,
              endTimeForNextStep: displaySlots[n].endTime.unix(),
              startTimeForNextStep: displaySlots[n].startTime.unix(),
              courtRef: displaySlots[n].courtRef.id,
            };
            displaySlotsFormatted.push(newSlot);
          }
        }
        return displaySlotsFormatted;
      }),
      map(displaySlotsFormattedUnordered => { // order by time first
        return displaySlotsFormattedUnordered.sort((slot1, slot2) => {
          if (moment(slot1.startTimeForSorting).isBefore(slot2.startTimeForSorting)) {
            return -1;
          }
          return 0;
        });
      }),
      map(displaySlotsOrderedByStartNotGymName => { // order by gym name 2nd
        return displaySlotsOrderedByStartNotGymName.sort((slot1, slot2) => {
          return slot1.gymName.localeCompare(slot2.gymName);
        });
      }),
      map(displaySlotsThatDontRemoveSameTimeSameGymSlots => { // remove slots where a gym has multiple courts available at same time
        const displaySlotsOutput: Slot[] = [];
        let i;
        for (i = 0; i < displaySlotsThatDontRemoveSameTimeSameGymSlots.length; i++) {
          if (displaySlotsThatDontRemoveSameTimeSameGymSlots[i + 1] === undefined) { // last one in the array doesnt have a next one to compare
            displaySlotsOutput.push(displaySlotsThatDontRemoveSameTimeSameGymSlots[i]); // so just add it
          } else if (displaySlotsThatDontRemoveSameTimeSameGymSlots[i + 1].gymName === displaySlotsThatDontRemoveSameTimeSameGymSlots[i].gymName
            && displaySlotsThatDontRemoveSameTimeSameGymSlots[i + 1].startTime === displaySlotsThatDontRemoveSameTimeSameGymSlots[i].startTime
            && displaySlotsThatDontRemoveSameTimeSameGymSlots[i + 1].endTime === displaySlotsThatDontRemoveSameTimeSameGymSlots[i].endTime) {
            // do nothing
          } else {
            displaySlotsOutput.push(displaySlotsThatDontRemoveSameTimeSameGymSlots[i]);
          }
        }
        return displaySlotsOutput;
      }),
      map(displaySlotsWithoutRepeatSlotsButSortedByGymName => { // now that repeat slots are gone, sort by time again
        return displaySlotsWithoutRepeatSlotsButSortedByGymName.sort((slot1, slot2) => {
          if (moment(slot1.startTimeForSorting).isBefore(slot2.startTimeForSorting)) {
            return -1;
          }
          return 0;
        });
      }),
    )
      .subscribe(displaySlotsFormattedUnordered => {
      this.displaySlotsFormatted = displaySlotsFormattedUnordered.reverse();
    });
  }

  mixpanel(eventName: string) {
    this.mixpanelService.track(eventName);
  }

  monthRightArrow() {
    this.mixpanelService.track('monthRightArrow');

    this.selectedDateMoment = moment(this.selectedDateMoment).add(1, 'months');

    this.selectedMonth = this.selectedDateMoment.format('MMMM');

    this.selectedDateMoment = moment(this.selectedDateMoment).startOf('month').add(1, 'days');
    this.headedToPastDay = this.selectedDateMoment.isSameOrBefore(moment().add(2, 'days'));
    this.headedToPastMonth = this.selectedDateMoment.isSameOrBefore(moment().add(2, 'days'), 'month');

    this.day1 = moment(this.selectedDateMoment).subtract(1, 'days').format('ddd');
    this.date1 = moment(this.selectedDateMoment).subtract(1, 'days').format('D');

    this.day2 = this.selectedDateMoment.format('ddd');
    this.date2 = moment(this.selectedDateMoment).format('D');

    this.day3 = moment(this.selectedDateMoment).add(1, 'days').format('ddd');
    this.date3 = moment(this.selectedDateMoment).add(1, 'days').format('D');

    this.day4 = moment(this.selectedDateMoment).add(2, 'days').format('ddd');
    this.date4 = moment(this.selectedDateMoment).add(2, 'days').format('D');

    this.dateSelected = this.date1;

    this.selectDate(this.dateSelected);
  }

  monthLeftArrow() {
    this.mixpanelService.track('monthLeftArrow');

    this.selectedDateMoment = moment(this.selectedDateMoment).subtract(1, 'months');

    this.selectedMonth = this.selectedDateMoment.format('MMMM');

    this.selectedDateMoment = moment(this.selectedDateMoment).endOf('month').subtract(2, 'days');
    this.headedToPastDay = this.selectedDateMoment.isSameOrBefore(moment().add(2, 'days'));
    this.headedToPastMonth = this.selectedDateMoment.isSameOrBefore(moment().add(2, 'days'), 'month');

    this.day1 = moment(this.selectedDateMoment).subtract(1, 'days').format('ddd');
    this.date1 = moment(this.selectedDateMoment).subtract(1, 'days').format('D');

    this.day2 = this.selectedDateMoment.format('ddd');
    this.date2 = moment(this.selectedDateMoment).format('D');

    this.day3 = moment(this.selectedDateMoment).add(1, 'days').format('ddd');
    this.date3 = moment(this.selectedDateMoment).add(1, 'days').format('D');

    this.day4 = moment(this.selectedDateMoment).add(2, 'days').format('ddd');
    this.date4 = moment(this.selectedDateMoment).add(2, 'days').format('D');

    this.dateSelected = this.date4;

    this.selectDate(this.dateSelected);
  }

  dayLeftArrow() {
    this.mixpanelService.track('dayLeftArrow');

    this.selectedDateMoment = moment(this.selectedDateMoment).subtract(4, 'days');
    this.headedToPastDay = this.selectedDateMoment.isSameOrBefore(moment().add(2, 'days'));
    this.headedToPastMonth = this.selectedDateMoment.isSameOrBefore(moment().add(2, 'days'), 'month');

    this.day1 = this.selectedDateMoment.format('ddd'); // moment(this.selectedDateMoment).subtract(1, 'days').format('ddd');
    this.date1 = moment(this.selectedDateMoment).format('D'); // moment(this.selectedDateMoment).subtract(1, 'days').format('D');

    this.day2 = moment(this.selectedDateMoment).add(1, 'days').format('ddd');
    this.date2 = moment(this.selectedDateMoment).add(1, 'days').format('D');

    this.day3 = moment(this.selectedDateMoment).add(2, 'days').format('ddd');
    this.date3 = moment(this.selectedDateMoment).add(2, 'days').format('D');

    this.day4 = moment(this.selectedDateMoment).add(3, 'days').format('ddd');
    this.date4 = moment(this.selectedDateMoment).add(3, 'days').format('D');

    this.dateSelected = this.date2;

    if (moment(this.selectedDateMoment).format('MMMM') !== moment(this.selectedDateMoment).add(3, 'days').format('MMMM')) {
      this.selectedMonth = moment(this.selectedDateMoment).format('MMMM') + '-' +  moment(this.selectedDateMoment).add(3, 'days').format('MMMM');
    }

    if (
      moment(this.selectedDateMoment).format('MMMM') === moment(this.selectedDateMoment).add(3, 'days').format('MMMM')
    ) {
      this.selectedMonth = moment(this.selectedDateMoment).format('MMMM');
    }

    this.selectDate(this.dateSelected);
  }

  dayRightArrow() {
    this.mixpanelService.track('dayRightArrow');

    this.selectedDateMoment = moment(this.selectedDateMoment).add(4, 'days');
    this.headedToPastDay = this.selectedDateMoment.isSameOrBefore(moment().add(2, 'days'));
    this.headedToPastMonth = this.selectedDateMoment.isSameOrBefore(moment().add(2, 'days'), 'month');

    this.day1 = this.selectedDateMoment.format('ddd'); // moment(this.selectedDateMoment).subtract(1, 'days').format('ddd');
    this.date1 = moment(this.selectedDateMoment).format('D'); // moment(this.selectedDateMoment).subtract(1, 'days').format('D');

    this.day2 = moment(this.selectedDateMoment).add(1, 'days').format('ddd');
    this.date2 = moment(this.selectedDateMoment).add(1, 'days').format('D');

    this.day3 = moment(this.selectedDateMoment).add(2, 'days').format('ddd');
    this.date3 = moment(this.selectedDateMoment).add(2, 'days').format('D');

    this.day4 = moment(this.selectedDateMoment).add(3, 'days').format('ddd');
    this.date4 = moment(this.selectedDateMoment).add(3, 'days').format('D');

    this.dateSelected = this.date2;

    if (moment(this.selectedDateMoment).format('MMMM') !== moment(this.selectedDateMoment).add(3, 'days').format('MMMM')) {
      this.selectedMonth = moment(this.selectedDateMoment).format('MMMM') + '-' +  moment(this.selectedDateMoment).add(3, 'days').format('MMMM');
    }

    if (
      moment(this.selectedDateMoment).format('MMMM') === moment(this.selectedDateMoment).add(3, 'days').format('MMMM')
    ) {
      this.selectedMonth = moment(this.selectedDateMoment).format('MMMM');
    }

    this.selectDate(this.dateSelected);
  }

  selectDate(dateSelected: string) {
    this.dateSelected = dateSelected;

    let monthToGetSelectedDaysFirestoreSlots;

    if (this.selectedMonth.includes('-')) {
      if (parseInt(dateSelected, 10) >= 28) {
        monthToGetSelectedDaysFirestoreSlots = this.selectedMonth.substr(0, this.selectedMonth.indexOf('-'));
      } else {
        monthToGetSelectedDaysFirestoreSlots = this.selectedMonth.substr((this.selectedMonth.indexOf('-') + 1), this.selectedMonth.length);
      }
    } else {
      monthToGetSelectedDaysFirestoreSlots = this.selectedMonth;
    }

    const startOfDay = moment().tz('America/Toronto').month(monthToGetSelectedDaysFirestoreSlots).date(parseInt(dateSelected, 10)).startOf('day');
    const startOfNextDay = moment(startOfDay).add(1, 'days');
    const startOfNextDayPlus2Hours = moment(startOfDay).add(1, 'days').add(2, 'hours');

    if (startOfDay.isBefore(moment().add(2, 'days'), 'day')) {
      this.cannotDisplayPastError = true;
      this.displaySlotsFormatted = [];
    } else {
      this.cannotDisplayPastError = false;
      this.getBookingsSelectDateSub = this.slotsService.getBookings(startOfDay.toDate(), startOfNextDayPlus2Hours.toDate()).pipe(
        map(bookingsArray => {
          let firestoreSlots: Slot[] = [];
          let i;
          for (i in bookingsArray) {
            if (moment.unix(bookingsArray[i].time.startTime.seconds).tz('America/Toronto').isDST() === false) {
              console.log('is not daylight saving');
              const newFirestoreSlot: Slot = {
                startTime: moment.unix(bookingsArray[i].time.startTime.seconds).add(1, 'hours'),
                endTime: moment.unix(bookingsArray[i].time.endTime.seconds).add(1, 'hours'),
                courtRef: bookingsArray[i].court,
              };
              firestoreSlots.push(newFirestoreSlot);
            } else {
              const newFirestoreSlot: Slot = {
                startTime: moment.unix(bookingsArray[i].time.startTime.seconds),
                endTime: moment.unix(bookingsArray[i].time.endTime.seconds),
                courtRef: bookingsArray[i].court,
              };
              firestoreSlots.push(newFirestoreSlot);
            }
          }
          console.log(firestoreSlots);
          return firestoreSlots;
        }),
      ).subscribe(firestoreSlots => {
        this.generateAvailableTimes(startOfDay, firestoreSlots, startOfNextDay, this.selectedDuration);
      });
    }
  }


  selectDuration(durationInHours: number) {
    this.mixpanelService.track('durationSelectedHours' + durationInHours.toString());

    this.selectedDuration = durationInHours;

    let monthToGetSelectedDaysFirestoreSlots;

    if (this.selectedMonth.includes('-')) {
      if (parseInt(this.dateSelected, 10) >= 28) {
        monthToGetSelectedDaysFirestoreSlots = this.selectedMonth.substr(0, this.selectedMonth.indexOf('-'));
      } else {
        monthToGetSelectedDaysFirestoreSlots = this.selectedMonth.substr((this.selectedMonth.indexOf('-') + 1), this.selectedMonth.length);
      }
    } else {
      monthToGetSelectedDaysFirestoreSlots = this.selectedMonth;
    }

    const startOfDay = moment().tz('America/Toronto').month(monthToGetSelectedDaysFirestoreSlots).date(parseInt(this.dateSelected, 10)).startOf('day');
    const startOfNextDay = moment(startOfDay).add(1, 'days');
    const startOfNextDayPlus2Hours = moment(startOfDay).add(1, 'days').add(2, 'hours');

    this.getBookingsSelectDurationSub = this.slotsService.getBookings(startOfDay.toDate(), startOfNextDayPlus2Hours.toDate()).pipe(
      map(bookingsArray => {
        let firestoreSlots: Slot[] = [];
        let i;
        for (i in bookingsArray) {
          if (moment.unix(bookingsArray[i].time.startTime.seconds).tz('America/Toronto').isDST() === false) {
            console.log('is not daylight saving');
            const newFirestoreSlot: Slot = {
              startTime: moment.unix(bookingsArray[i].time.startTime.seconds).add(1, 'hours'),
              endTime: moment.unix(bookingsArray[i].time.endTime.seconds).add(1, 'hours'),
              courtRef: bookingsArray[i].court,
            };
            firestoreSlots.push(newFirestoreSlot);
          } else {
            const newFirestoreSlot: Slot = {
              startTime: moment.unix(bookingsArray[i].time.startTime.seconds),
              endTime: moment.unix(bookingsArray[i].time.endTime.seconds),
              courtRef: bookingsArray[i].court,
            };
            firestoreSlots.push(newFirestoreSlot);
          }
        }
        return firestoreSlots;
      }),
    )
      .subscribe(firestoreSlots => {
        this.generateAvailableTimes(startOfDay, firestoreSlots, startOfNextDay, durationInHours);
      });
  }

  slotClick(slot: Slot) {
    this.mixpanelService.track('slotClicked');

    const queryParam = slot.startTimeForNextStep + slot.courtRef + slot.endTimeForNextStep;
    this.router.navigate(['/minmax'], {queryParams: {slot: queryParam}});
  }

  ngOnDestroy() {
    if (this.getCurrDayBookingsSub !== undefined) {
      this.getCurrDayBookingsSub.unsubscribe();
    }

    if (this.getCourtsToGenerateTodaysAvailableTimesSub !== undefined) {
      this.getCourtsToGenerateTodaysAvailableTimesSub.unsubscribe();
    }

    if (this.getBookingsSelectDateSub !== undefined) {
      this.getBookingsSelectDateSub.unsubscribe();
    }

    if (this.getBookingsSelectDurationSub !== undefined) {
      this.getBookingsSelectDurationSub.unsubscribe();
    }
  }

}
