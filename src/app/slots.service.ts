import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';

interface Slot {
  startTime: any;
  endTime: any;
  available: boolean;
  gymName: string;
  cost: number;
  address: string;
  gymPicFileName;
}
interface DateStr {
  dateString: string;
}
@Injectable()
export class SlotsService {

  slotDoc: AngularFirestoreDocument<Slot>;
  slot: Observable<Slot>;

  constructor(private afs: AngularFirestore) {}

  getSlot(slotId: string) {
    this.slotDoc = this.afs.collection('slots').doc(slotId);
    this.slot = this.slotDoc.valueChanges();
  }

  markSlotAsUnavailable(slotId: string) {
    this.afs.collection('slots').doc(slotId).update({'available': false});
  }

  getBookings(time1, time2): Observable<any> {
    return this.afs.collection('bookings', ref => ref.where(`time.startTime`, '>=', time1).where('time.startTime', '<', time2)).snapshotChanges()
      .pipe(
        map(bookingObjArray => {
          let i;
          let resArray = [];
          for (i in bookingObjArray) {
            resArray.push(bookingObjArray[i].payload.doc.data());
          }
          return resArray;
        }),
      );
  }



}
