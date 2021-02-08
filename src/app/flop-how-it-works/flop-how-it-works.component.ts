import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import {GamesService} from '../games.service';
import {AngularFirestore} from '@angular/fire/firestore';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'app-flop-how-it-works',
  templateUrl: './flop-how-it-works.component.html',
  styleUrls: ['./flop-how-it-works.component.css']
})
export class FlopHowItWorksComponent implements OnInit {

  constructor(private _location: Location, private gamesServiceAfs: GamesService,
              private afs: AngularFirestore) { }

  ngOnInit() {
  }

  back() {
    this._location.back();
  }

  listReservations() { // keep this incase you need to put reservations back on
    this.gamesServiceAfs.listReservations().subscribe(data => {
      console.log(data);
    });
  }

  countBookings() { // keep this incase you need to do the above and check how many you put on
    let bookings = 0;
    this.afs.collection('bookings').get().pipe(
      tap(data => {
        data.forEach(bookingDoc => {
          bookings = bookings + 1;
        });
      })
    ).subscribe(data => {
      console.log('there are ' + bookings + 'in the collection');
    });
  }

}
