import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Calendar, OptionsInput} from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import {NgForm} from '@angular/forms';
import moment from 'moment';
import {AngularFirestore} from '@angular/fire/firestore';
import {UsersService} from '../users.service';
import * as firebase from 'firebase';
import {Subscription} from 'rxjs';
import {ExtendedEventSourceInput} from '@fullcalendar/core/structs/event-source';
import {ActivatedRoute} from '@angular/router';
import {flatMap, map, takeWhile, tap} from 'rxjs/operators';


@Component({
  selector: 'app-gym-schedule-view',
  templateUrl: './gym-schedule-view.component.html',
  styleUrls: ['./gym-schedule-view.component.css']
})



export class GymScheduleViewComponent implements OnInit, OnDestroy {
  @ViewChild('createEvent', { static: true }) createEvent: NgForm;
  @ViewChild('chooseCourt', { static: true }) chooseCourt: NgForm;

  defaultDate; // = '2011-09-29';
  defaultStartTime;
  defaultEndTime;
  defaultCourt; // = '2nd Court';

  events = []; // = [{ id: '2', resourceId: 'c', start: '2019-04-18T05:00:00-04:00', end: '2019-04-18T22:00:00-04:00', title: 'event 2' }];
  selectedResource; // = [{ id: 'c', title: '2nd Court', }]; // eventColor: 'orange'

  calendar;

  userUid;
  courts = [];
  authStateChangedSub: firebase.Unsubscribe;
  getUsersCourtsSub: Subscription;
  getCourtsBookingsSub: Subscription;

  constructor(private afs: AngularFirestore, private usersService: UsersService, private route: ActivatedRoute) { }


 //  displayableTimes = ['12:00AM', '12:30AM', '1:00AM', '1:30AM', '2:00AM', '2:30AM', '3:00AM', '3:30AM', '4:00AM',
 // '4:30AM', '5:00AM', '5:30AM', '6:00AM', '6:30AM', '7:00AM', '7:30AM', '8:00AM', '8:30AM', '9:00AM', '9:30AM',
 // '10:00AM', '10:30AM', '11:00AM', '11:30AM', '12:00PM', '12:30PM', '1:00PM', '1:30PM', '2:00PM', '2:30PM', '3:00PM',
 // '3:30PM', '4:00PM', '4:30PM', '5:00PM', '5:30PM', '6:00PM', '6:30PM', '7:00PM', '7:30PM', '8:00PM', '8:30PM',
 // '9:00PM', '9:30PM', '10:00PM', '10:30PM', '11:00PM', '11:30PM'];

  ngOnInit() {
    this.authStateChangedSub = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.userUid = user.uid;

        this.route.queryParams.pipe(
          map(res => res.code),
          takeWhile(code => code !== undefined),
          flatMap(code => this.usersService.connectGymAccount(code, this.userUid))
        ).subscribe();
        this.getCourts();
      }
    });




    const currDateMoment = moment(new Date());
    const formattedDateMoment = moment(currDateMoment).format('YYYY-MM-DD');
    const formattedStartTimeMoment = moment(currDateMoment).format('kk:mm');
    const editedEndTimeMoment = moment(currDateMoment).add(2, 'hours');
    const formattedEditedEndTimeMoment = moment(editedEndTimeMoment).format('kk:mm');

    this.defaultDate = formattedDateMoment;
    this.defaultStartTime = formattedStartTimeMoment;
    this.defaultEndTime = formattedEditedEndTimeMoment;

    this.renderCalendar();

    // document.addEventListener('DOMContentLoaded', function() {
    //   let calendarEl: HTMLElement = document.getElementById('calendar')!;
    //
    //   let calendar = new Calendar(calendarEl, {
    //     schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
    //     plugins: [ interactionPlugin, dayGridPlugin, listPlugin, timeGridPlugin, resourceTimelinePlugin ],
    //     now: '2018-02-07',
    //     editable: true, // enable draggable events
    //     aspectRatio: 1.8,
    //     scrollTime: '00:00', // undo default 6am scrollTime
    //     header: {
    //       left: 'today prev,next',
    //       center: 'title',
    //       right: 'resourceTimelineDay,resourceTimelineThreeDays,timeGridWeek,dayGridMonth,listWeek'
    //     },
    //     defaultView: 'resourceTimelineDay',
    //     views: {
    //       resourceTimelineThreeDays: {
    //         type: 'resourceTimeline',
    //         duration: { days: 3 },
    //         buttonText: '3 day'
    //       }
    //     },
    //     resourceLabelText: 'Rooms',
    //     resources: [
    //       { id: 'a', title: 'Auditorium A' },
    //       { id: 'b', title: 'Auditorium B', eventColor: 'green' },
    //       { id: 'c', title: 'Auditorium C', eventColor: 'orange' },
    //       { id: 'd', title: 'Auditorium D', children: [
    //           { id: 'd1', title: 'Room D1' },
    //           { id: 'd2', title: 'Room D2' }
    //         ] },
    //       { id: 'e', title: 'Auditorium E' },
    //       { id: 'f', title: 'Auditorium F', eventColor: 'red' },
    //       { id: 'g', title: 'Auditorium G' },
    //       { id: 'h', title: 'Auditorium H' },
    //       { id: 'i', title: 'Auditorium I' },
    //       { id: 'j', title: 'Auditorium J' },
    //       { id: 'k', title: 'Auditorium K' },
    //       { id: 'l', title: 'Auditorium L' },
    //       { id: 'm', title: 'Auditorium M' },
    //       { id: 'n', title: 'Auditorium N' },
    //       { id: 'o', title: 'Auditorium O' },
    //       { id: 'p', title: 'Auditorium P' },
    //       { id: 'q', title: 'Auditorium Q' },
    //       { id: 'r', title: 'Auditorium R' },
    //       { id: 's', title: 'Auditorium S' },
    //       { id: 't', title: 'Auditorium T' },
    //       { id: 'u', title: 'Auditorium U' },
    //       { id: 'v', title: 'Auditorium V' },
    //       { id: 'w', title: 'Auditorium W' },
    //       { id: 'x', title: 'Auditorium X' },
    //       { id: 'y', title: 'Auditorium Y' },
    //       { id: 'z', title: 'Auditorium Z' }
    //     ],
    //     events: [
    //       { id: '1', resourceId: 'b', start: '2018-02-07T02:00:00', end: '2018-02-07T07:00:00', title: 'event 1' },
    //       { id: '2', resourceId: 'c', start: '2018-02-07T05:00:00', end: '2018-02-07T22:00:00', title: 'event 2' },
    //       { id: '3', resourceId: 'd', start: '2018-02-06', end: '2018-02-08', title: 'event 3' },
    //       { id: '4', resourceId: 'e', start: '2018-02-07T03:00:00', end: '2018-02-07T08:00:00', title: 'event 4' },
    //       { id: '5', resourceId: 'f', start: '2018-02-07T00:30:00', end: '2018-02-07T02:30:00', title: 'event 5' }
    //     ]
    //   });
    //
    //   calendar.render();
    // });
  }

  renderCalendar() {
    const calendarEl: HTMLElement = document.getElementById('calendar');

    this.calendar = new Calendar(calendarEl, {
      schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
      plugins: [ interactionPlugin, dayGridPlugin, listPlugin, timeGridPlugin, resourceTimelinePlugin ],
      selectable: true,
      businessHours: true,
      now: this.defaultDate, // '2018-02-07',
      editable: true, // enable draggable events
      aspectRatio: 1.8,
      scrollTime: '00:00', // undo default 6am scrollTime
      header: {
        left: 'today prev,next',
        center: 'title',
        right: 'resourceTimelineDay,resourceTimelineThreeDays,timeGridWeek,dayGridMonth,listWeek'
      },
      dateClick: function(info) {
        // alert('clicked ' + info.date);
        document.getElementById('openModalButton').click();

      },
      defaultView: 'timeGridWeek',
      views: {
        resourceTimelineThreeDays: {
          type: 'resourceTimeline',
          duration: { days: 3 },
          buttonText: '3 day'
        }
      },
      resourceLabelText: 'Rooms',
      // resources: [
      //   { id: 'c', title: 'Auditorium C', eventColor: 'orange', businessHours: {
      //       startTime: '10:00',
      //       endTime: '18:00'
      //     }},
      // ],
      resources: this.selectedResource,
      // events: [
      //   { id: '2', resourceId: 'yFEAFA0rsXV4Lk37UMBA', start: '2019-04-16T05:00:00', end: '2019-04-16T22:00:00', title: 'event 2' },
      // ] as ExtendedEventSourceInput
      events: this.events as ExtendedEventSourceInput
    });
    this.calendar.render();
  }

  submitEvent() {
    console.log(this.createEvent.value);
    const testEvent = {id: '4', resourceId: 'c', start: this.createEvent.value.date + 'T' + this.createEvent.value.startTime + ':00',
      end: this.createEvent.value.date + 'T' + this.createEvent.value.endTime + ':00', title: 'event 3'};

    this.events.push(testEvent);

    console.log(this.events);
    this.calendar.destroy();
    this.renderCalendar();
  }

  selectCourt() {
    const selectedCourtName = this.chooseCourt.value.selectedCourt.toString();
    for (const i in this.courts) {
      if (selectedCourtName === this.courts[i].title) {
        this.selectedResource = [this.courts[i]];
      }
    }

    this.getCourtsBookingsSub = this.usersService.getCourtsBookings(this.afs.collection('courts').doc(this.selectedResource[0].id).ref).subscribe(bookings => {
      if (bookings.length === 0) {
        console.log('this court has no bookings');
        this.events = [];
      }
      for (const i in bookings) {
        const momentObjStartTime = moment.unix(bookings[0].data.time.startTime.seconds);
        const startTimeString = moment(momentObjStartTime).format().toString();
        const momentObjEndTime = moment.unix(bookings[0].data.time.endTime.seconds);
        const endTimeString = moment(momentObjEndTime).format().toString();

        this.events = [];
        this.events.push(
          {id: bookings[i].id, resourceId: this.selectedResource[0].id, start: startTimeString, end: endTimeString, title: bookings[i].id}
        );
      }
      this.calendar.destroy();
      this.renderCalendar();
    });
  }

  getCourts() {
    this.getUsersCourtsSub = this.usersService.getUsersCourts(this.afs.collection('gyms').doc(this.userUid).ref).subscribe(courts => {
      for (const indexVal in courts) {
        this.courts.push({ id: courts[indexVal].id, title: courts[indexVal].data.courtName});
      }
      this.defaultCourt = this.courts[0].title;
      this.selectedResource = [this.courts[0]];

      this.getCourtsBookingsSub = this.usersService.getCourtsBookings(this.afs.collection('courts').doc(this.selectedResource[0].id).ref).subscribe(bookings => {
        for (const i in bookings) {
          const momentObjStartTime = moment.unix(bookings[0].data.time.startTime.seconds);
          const startTimeString = moment(momentObjStartTime).format().toString();

          const momentObjEndTime = moment.unix(bookings[0].data.time.endTime.seconds);
          const endTimeString = moment(momentObjEndTime).format().toString();

          this.events.push(
            {id: bookings[i].id, resourceId: this.selectedResource[0].id, start: startTimeString, end: endTimeString, title: bookings[i].id}
            );
        }

        this.calendar.destroy();
        this.renderCalendar();
      });

      // events = [{ id: '2', resourceId: 'c', start: '2019-04-18T05:00:00', end: '2019-04-18T22:00:00', title: 'event 2' }];
      
    });



  }

  ngOnDestroy() {
    this.authStateChangedSub();
    this.getUsersCourtsSub.unsubscribe();
    this.getCourtsBookingsSub.unsubscribe();
  }


}
