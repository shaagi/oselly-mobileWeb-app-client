import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentData} from '@angular/fire/firestore';
import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {from, Observable, Subscription} from 'rxjs';
import {firestore} from 'firebase';
import * as firebase from 'firebase';
import {flatMap, map, tap} from 'rxjs/operators';
import {UsersService} from './users.service';
import {AngularFireFunctions} from '@angular/fire/functions';
import FieldValue = firebase.firestore.FieldValue;
import moment from 'moment';
import {Router} from '@angular/router';

interface Game {
  host: string;
  semiHosts: string[];
  members: {[key: string]: string};
  min: number;
  max: number;
  enoughPplInterested: boolean;
  maxPplReached: boolean;
  date: any;
  signUpByDate: any;
  finalizeByDate: any;
  slotId: string;
}

interface minMax {
  min: number;
  max: number;
}

@Injectable()
export class GamesService implements OnInit, OnDestroy {
  getUserInfoSubAddHost: Subscription;
  getUserInfoSubAddSemiHost: Subscription;
  addMemberToGameSub: Subscription;
  conductReplaceClientSub: Subscription;
  conductReplaceGetSpotSellersName: Subscription;
  conductReplaceCloudSub: Subscription;

  getUserInfoSendInfoToCloudCode: Subscription;
  getUserInfoActuallySendSub: Subscription;

  gameDoc: AngularFirestoreDocument<Game>;
  game: Observable<Game>;

  NoOfMembersInterested;
  TotalNoOfPplInterested;
  minPplAllowed;
  maxPplAllowed;
  enoughPpl;
  maxPplReached;
  noOfPplWithHostIncludingHost;
  noOfSemihostsInterested;

  currDateMoment;
  nextDateMoment;
  nextDate;

  createGameSub: Subscription;
  addSemiHostSub: Subscription;
  addMemberSub: Subscription;
  checkIfTotalPplMaxOrEnoughSub: Subscription;


  constructor(private afs: AngularFirestore, private usersService: UsersService, private fns: AngularFireFunctions, private router: Router) {
  }

  ngOnInit() {
  }

  addGame(min: number, max: number, startTimeSeconds: any, endTimeSeconds: any, enoughPplInterested: boolean, hostEmail: string, courtId: string) {

    const startTimeMoment = moment.unix(startTimeSeconds);
    const decisionDeadline = startTimeMoment.subtract(1, 'days').toDate();

    let uid;
    let email;
    let name;
    let givenPaymentInfo;
    let unsubs;
    let gameId;

    this.createGameSub = this.usersService.getUserInfo(hostEmail).pipe(
      flatMap(data => {
        uid = data[0].id;
        if (data[0].data.emailPreferred !== undefined) {
          email = data[0].data.emailPreferred;
        } else {
          email = data[0].data.email;
        }
        name = data[0].data.name;
        givenPaymentInfo = data[0].data.givenPaymentInfo;
        if (data[0].data.unsubs !== undefined) {
          unsubs = data[0].data.unsubs;
        }
        return  from(this.afs.collection('bookings').add({
          'min': min,
          'max': max,
          'enoughPplInterested': enoughPplInterested,
          'maxPplReached': false,
          'oselly': true,
          'date': decisionDeadline,
          'court': firebase.firestore().doc(`/courts/${courtId}`),
          'time': {startTime: moment.unix(startTimeSeconds).toDate(), endTime: moment.unix(endTimeSeconds).toDate()},
          'spotForSaleEmailSent': false,
        }));
      }),
      map(docRef => docRef.id),
      flatMap(IdOfGame => {
        gameId = IdOfGame;
        console.log(gameId);
        if (unsubs !== undefined) {
          return from(this.afs.collection('bookings').doc(gameId).collection('host').doc(uid).set(
            {'email': email, 'givenPaymentInfo': givenPaymentInfo, 'name': name, 'unsubs': unsubs}
          ));
        } else {
          return from(this.afs.collection('bookings').doc(gameId).collection('host').doc(uid).set(
            {'email': email, 'givenPaymentInfo': givenPaymentInfo, 'name': name}
          ));
        }
      }),
      flatMap(res => {
        return from(this.afs.collection('bookings').doc(gameId).collection('booking-expired-col').doc('booking-expired-doc').set(
          {'bookingExpired': false}
        ));
      }),
      flatMap(res => {
        // return from(this.router.navigate(['/inviteMembers'], {queryParams: {game: gameId}}));
        // return from(this.router.navigate(['/pendingGameInfo'], {queryParams: {game: gameId}}));
        return from(this.router.navigate(['/pendingGames'])); // point of this is so the host knows where to find the game
        // and can see how many hours left and decide himself if he wants to invite now or later
      }),
      flatMap(res => {
        return this.afs.collection('courts').doc(courtId).get();
      }),
      map(res => res.data().courtName),
      flatMap(courtName => this.makeReservationOnPlanyo(startTimeSeconds, endTimeSeconds, courtName, gameId)),
      tap(res => this.addGameIdToUserProfileNew(uid, gameId)),
    ).subscribe(res => this.createGameSub.unsubscribe());
  }

  makeReservationOnPlanyo(startTimeSeconds: number, endTimeSeconds: number, courtName: string, gameId: string): Observable<any> {
    const callable = this.fns.httpsCallable('makeReservationOnPlanyo');
    return callable({startTimeSeconds: startTimeSeconds, endTimeSeconds: endTimeSeconds, courtName: courtName, gameId: gameId});
  }

  addSpotSellerToGame(windowLocationOrigin: string, gameId: string, sellerUid: string, sellerName: string) {
    this.afs.collection('bookings').doc(gameId).collection('spotSellers').doc(sellerUid).set({name: sellerName});
    this.notifyPplThatUserTryingToSellSpot(windowLocationOrigin, gameId, sellerUid);
  }

  notifyPplThatUserTryingToSellSpot(windowLocationOrigin: string, gameId: string, sellerUid: string) {
    const callable = this.fns.httpsCallable('notifyPplThatUserTryingToSellSpot');
    return callable({windowLocationOrigin: windowLocationOrigin, gameId: gameId, sellerUid: sellerUid});
  }

  cancelBookingForHost(gameId: string) {
    const callable = this.fns.httpsCallable('cancelBookingForHost');
    return callable({gameId: gameId});
  }

  addGameIdToUserProfileNew(userId: string, gameId: string) {
    this.afs.collection('users').doc(userId).update({pendingGames: FieldValue.arrayUnion(gameId)});
  }

  addGameIdToSpotBuyer(userId: string, gameId: string) {
    this.afs.collection('users').doc(userId).update({fulfilledGames: FieldValue.arrayUnion(gameId)});
  }

  addSemiHostToGame(gameId: string, semiHostEmail: string) {
    let uid;
    let email;
    let name;
    let givenPaymentInfo;
    let unsubs;

    this.addSemiHostSub = this.usersService.getUserInfo(semiHostEmail).pipe(
      flatMap(data => {
        uid = data[0].id;
        if (data[0].data.emailPreferred !== undefined) {
          email = data[0].data.emailPreferred;
        } else {
          email = data[0].data.email;
        }
        name = data[0].data.name;
        givenPaymentInfo = data[0].data.givenPaymentInfo;
        if (data[0].data.unsubs !== undefined) {
          unsubs = data[0].data.unsubs;
          return this.afs.collection('bookings').doc(gameId).collection('semiHosts').doc(uid).set(
            {'email': email, 'givenPaymentInfo': givenPaymentInfo, 'name': name, 'unsubs': unsubs}
          );
        } else {
          return this.afs.collection('bookings').doc(gameId).collection('semiHosts').doc(uid).set(
            {'email': email, 'givenPaymentInfo': givenPaymentInfo, 'name': name}
          );
        }

      }),
      tap(res => {
        this.checkTotalPplMaxOrEnoughOrNone(gameId);
        this.addGameIdToUserProfileNew(uid, gameId);
      }),
    ).subscribe(res => this.addSemiHostSub.unsubscribe());
  }

  checkTotalPplMaxOrEnoughOrNone(gameId: string) { // not sure if this works as members havent been tested, just trusting for now
    this.checkIfTotalPplMaxOrEnoughSub =  this.afs.collection('bookings').doc(gameId).get().pipe(
      flatMap(res => {
        this.enoughPpl = false;
        this.maxPplReached = false;
        this.minPplAllowed = res.data().min;
        this.maxPplAllowed = res.data().max;
        return this.afs.collection('bookings').doc(gameId).collection('host').get();
      }),
      flatMap(querySnapshotHostCol => {
        this.noOfPplWithHostIncludingHost = querySnapshotHostCol.size;
        return this.afs.collection('bookings').doc(gameId).collection('semiHosts').get();
      }),
      flatMap(querySnapshotSemiHostsCol => {
        this.noOfSemihostsInterested = querySnapshotSemiHostsCol.size;
        console.log(this.noOfSemihostsInterested);
        return this.afs.collection('bookings').doc(gameId).collection('members').get();
      }),
      map(querySnapshotMembersCol => {
        this.NoOfMembersInterested = querySnapshotMembersCol.size;
        this.TotalNoOfPplInterested = this.NoOfMembersInterested + this.noOfSemihostsInterested + this.noOfPplWithHostIncludingHost;
        if (this.TotalNoOfPplInterested >= this.minPplAllowed) {
          this.enoughPpl = true;
          this.setAfsEnoughPplInterested(gameId, this.enoughPpl);
        }  else {
          this.enoughPpl = false;
          this.setAfsEnoughPplInterested(gameId, this.enoughPpl);
        }
        if (this.TotalNoOfPplInterested === this.maxPplAllowed) {
          this.maxPplReached = true;
          this.setAfsMaxPplReached(gameId, this.maxPplReached);
          return this.router.navigate(['/goneThrough']);
        }
      }),
    ).subscribe(data => this.checkIfTotalPplMaxOrEnoughSub.unsubscribe());
  }

  setAfsEnoughPplInterested(gameId: string, enoughPplInterested: boolean) {
    this.afs.collection('bookings').doc(gameId).update({'enoughPplInterested': enoughPplInterested});
  }

  setAfsMaxPplReached(gameId: string, maxPplReached: boolean) {
    this.afs.collection('bookings').doc(gameId).update({'maxPplReached': maxPplReached});
    if (maxPplReached === true) {
      const callable = this.fns.httpsCallable('expireBookingBecauseMaxPplReached');
      return callable({gameId: gameId});
    }
  }

  uponGivingPaymentInfoNew(email: string, tokenId: string, userId: string): Observable<any> {
    const callable = this.fns.httpsCallable('paymentInfoGivenUpdateUserCol');
    return callable({tokenId: tokenId, email: email, userId: userId});
  }

  uponGivingPaymentInfoReplace(email: string, tokenId: string, userId: string): Observable<any> {
    const callable = this.fns.httpsCallable('paymentInfoGivenReplace');
    return callable({tokenId: tokenId, email: email, userId: userId});
  }

  conductReplace(gameId: string, sellerUid: string): Observable<any> {
    const callable = this.fns.httpsCallable('conductReplace');
    return callable({gameId: gameId, sellerUid: sellerUid});
  }

  listReservations(): Observable<any> { // keep this incase you need to put reservations back on
    const callable = this.fns.httpsCallable('listPlanyoReservations');
    return callable({});
  }

  conductReplaceClient(gameId: string, sellerUid: string, buyerEmail: string) {
    let seller;
    let unsubs;

    this.conductReplaceGetSpotSellersName = this.getSpotSellers(gameId).subscribe((spotSellers: any[]) => {
      for (let indexVal in spotSellers) {
        if (sellerUid === spotSellers[indexVal].id) {
          seller = spotSellers[indexVal].data.name;
        }
      }
      this.conductReplaceClientSub = this.usersService.getUserInfo(buyerEmail).subscribe(data => {
        console.log(data);
        console.log(data[0].id);
        if (data[0].data.unsubs !== undefined) {
          unsubs = data[0].data.unsubs;
          this.afs.collection('bookings').doc(gameId).collection('spotBuyers').doc(data[0].id).set({'email': data[0].data.email,
            'givenPaymentInfo': data[0].data.givenPaymentInfo, 'name': data[0].data.name, 'replaced': seller, 'unsubs': unsubs});
        } else {
          this.afs.collection('bookings').doc(gameId).collection('spotBuyers').doc(data[0].id).set({'email': data[0].data.email,
            'givenPaymentInfo': data[0].data.givenPaymentInfo, 'name': data[0].data.name, 'replaced': seller});
        }

        console.log('member has been added to the game on firestore, his payment info status: ' + data[0].data.givenPaymentInfo);
        this.addGameIdToSpotBuyer(data[0].id, gameId);
        this.afs.collection('bookings').doc(gameId).collection('spotSellers').doc(sellerUid).delete();
        this.conductReplaceCloudSub = this.conductReplace(gameId, sellerUid).subscribe(info => {
          console.log(info);
          this.conductReplaceCloudSub.unsubscribe();
        });
        this.conductReplaceGetSpotSellersName.unsubscribe();
        this.conductReplaceClientSub.unsubscribe();
      });
    });
  }

  testEmail(): Observable<any> {
    const callable = this.fns.httpsCallable('sendTestEmail');
    return callable({});
  }

  addSpacesToMemberName(memberName: any) {
    const memberNameString = memberName.toString();
    const memberNameRefined = memberNameString.replace(/([A-Z])/g, ' $1');
    return memberNameRefined;
  }

  addMemberToGame(gameId: string, memberEmail: string, inviter: string) {
    let uid;
    let email;
    let name;
    let givenPaymentInfo;
    let unsubs;

    this.addMemberSub = this.usersService.getUserInfo(memberEmail).pipe(
      flatMap(data => {
        uid = data[0].id;
        if (data[0].data.emailPreferred !== undefined) {
          email = data[0].data.emailPreferred;
        } else {
          email = data[0].data.email;
        }
        name = data[0].data.name;
        givenPaymentInfo = data[0].data.givenPaymentInfo;
        if (data[0].data.unsubs !== undefined) {
          unsubs = data[0].data.unsubs;
          return this.afs.collection('bookings').doc(gameId).collection('members').doc(uid).set(
            {'email': email, 'givenPaymentInfo': givenPaymentInfo, 'name': name, 'invitedBy': inviter, 'unsubs': unsubs});
        } else {
          return this.afs.collection('bookings').doc(gameId).collection('members').doc(uid).set(
            {'email': email, 'givenPaymentInfo': givenPaymentInfo, 'name': name, 'invitedBy': inviter});
        }

      }),
      tap(res => {
        this.checkTotalPplMaxOrEnoughOrNone(gameId);
        this.addGameIdToUserProfileNew(uid, gameId);
      }),
    ).subscribe(res => this.addMemberSub.unsubscribe());
  }

  getMembers(gameId: string): Observable<any[]> {
    return this.afs.collection('bookings').doc(gameId).collection('members').snapshotChanges()
      .pipe(map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, data };
        })
      }));
  }

  getHost(gameId: string): Observable<any[]> {
    return this.afs.collection('bookings').doc(gameId).collection('host').snapshotChanges()
      .pipe(map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, data };
        })
      }));
  }

  getSemiHosts(gameId: string): Observable<any[]> {
    return this.afs.collection('bookings').doc(gameId).collection('semiHosts').snapshotChanges()
      .pipe(map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, data };
        })
      }));
  }

  getSpotSellers(gameId: string): Observable<any[]>  {
    return this.afs.collection('bookings').doc(gameId).collection('spotSellers').snapshotChanges()
      .pipe(map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, data };
        })
      }));
  }

  getSpotBuyers(gameId: string): Observable<any[]>  {
    return this.afs.collection('bookings').doc(gameId).collection('spotBuyers').snapshotChanges()
      .pipe(map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, data };
        })
      }));
  }

  getGame(gameId: string) {
    this.gameDoc = this.afs.collection('bookings').doc(gameId);
    this.game = this.gameDoc.valueChanges();
  }


  cantFormSubmit(emailOrPhone: string) {
    console.log('heres the info: ' + emailOrPhone);
    this.afs.collection('tempStuff').doc('contactInfoCantPage').update({contactInfo: FieldValue.arrayUnion(emailOrPhone)});
  }

  ngOnDestroy() {
    // if (this.addMemberToGameSub === undefined) {
    // } else {
      this.addMemberToGameSub.unsubscribe();
    // }

    // if (this.getUserInfoSubAddHost === undefined) {
    // } else {
      this.getUserInfoSubAddHost.unsubscribe();
    // }

    // if (this.getUserInfoSubAddSemiHost === undefined) {
    // } else {
      this.getUserInfoSubAddSemiHost.unsubscribe();
    // }

    // if (this.getUserInfoSendInfoToCloudCode === undefined) {
    // } else {
      this.getUserInfoSendInfoToCloudCode.unsubscribe();
    // }

    // if (this.getUserInfoActuallySendSub === undefined) {
    // } else {
      this.getUserInfoActuallySendSub.unsubscribe();
    // }

    this.conductReplaceClientSub.unsubscribe();

    this.conductReplaceGetSpotSellersName.unsubscribe();
  }
}

