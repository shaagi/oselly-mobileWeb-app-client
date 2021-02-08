import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/firestore';
import {Injectable, OnDestroy} from '@angular/core';
import {map} from 'rxjs/operators';
import {Observable, Subscription} from 'rxjs';
import * as firebase from 'firebase'; // this gets used by the line below it. dont let the grey colour confuse you
import FieldValue = firebase.firestore.FieldValue;
import {AngularFireFunctions} from '@angular/fire/functions';

interface User {
  name: string;
  email: string;
  givenPaymentInfo: boolean;
  emailPreferred?: string;
  unsubs: string[];
}

interface Gym {
  email: string;
}

@Injectable()
export class UsersService implements OnDestroy {

  userDoc: AngularFirestoreDocument<User>;
  user: Observable<User>;

  gymDoc: AngularFirestoreDocument<Gym>;
  gym: Observable<Gym>;

  constructor(private afs: AngularFirestore, private fns: AngularFireFunctions) {}

  getUserInfo(email: string): Observable<any> {
    return this.afs.collection('users', ref => ref.where('email', '==', email)).snapshotChanges()
      .pipe(map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, data };
        })
      }));
  }

  getUsersDisplayName(uid: string): Observable<any> {
    return this.afs.collection('users').doc(uid).get()
      .pipe(map(docSnapshot => docSnapshot.data().name));
  }

  getUsersCourts(reference: any): Observable<any> {
    return this.afs.collection('courts', ref => ref.where('gym', '==', reference)).snapshotChanges()
      .pipe(map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, data };
        })
      }));
  }

  getCourtsBookings(reference: any): Observable<any> {
    return this.afs.collection('bookings', ref => ref.where('court', '==', reference)).snapshotChanges()
      .pipe(map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, data };
        })
      }));
  }

  getUserInfoUid(uid: string) {
    this.userDoc = this.afs.collection('users').doc(uid);
    this.user = this.userDoc.valueChanges();
  }

  getUserInfoViaUid(uid: string): Observable<any> {
    return this.afs.collection('users').doc(uid).get()
      .pipe(map(docSnapshot => docSnapshot.data()));
  }

  getGymInfoUid (uid: string) {
    this.gymDoc = this.afs.collection('gyms').doc(uid);
    this.gym = this.gymDoc.valueChanges();
  }

  addUser(name: string, email: string, givenPaymentInfo: boolean, userIdFirebase: string) {
    this.afs.collection('users').doc(userIdFirebase).set({'name': name, 'email': email, 'givenPaymentInfo': givenPaymentInfo});
  }

  loginRegUponGivingPaymentInfo(email: string, tokenId: string, userId: string): Observable<any> {
    // this.getUserInfoActuallySendSub.unsubscribe();
    console.log('about to send info to loginRegPaymentInfoGiven in cloud code');
    const callable = this.fns.httpsCallable('loginRegPaymentInfoGiven');
    return callable({tokenId: tokenId, email: email, userId: userId});
  }

  loadConsumerPreferredEmail(uid: string, preferredEmail: string) {
    return this.afs.collection('users').doc(uid).update({
      emailPreferred: preferredEmail
    });
  }

  connectGymAccount(authCodeStripe: string, gymUid: string): Observable<any> {
    const callable = this.fns.httpsCallable('connectGymAccount');
    return callable({authCodeStripe: authCodeStripe, gymUid: gymUid});
  }

  updateEmailPreferences(emailType: string, wantsUnsub: boolean, uid: string) {
    console.log('in usersService function');
    const callable = this.fns.httpsCallable('updateEmailPreferences');
    return callable({emailType: emailType, wantsUnsub: wantsUnsub, userUid: uid});
  }

  ngOnDestroy() {}

}
