import * as firebase from 'firebase';
import {Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import {switchMap} from 'rxjs/operators';

// interface User {
//   uid: string;
//   email: string;
// }

@Injectable()
export class AuthService {
  token: string;

  // user: Observable<User>;

  constructor(private router: Router, private afAuth: AngularFireAuth, private afs: AngularFirestore) {
    // // Define the user observable
    // this.user = this.afAuth.authState.pipe(switchMap(user => {
    //   if (user) {
    //     // logged in, get custom user from Firestore
    //     return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
    //   } else {
    //     // logged out, null
    //     return of(null);
    //   }
    // }));
  }

  emailSignUp(email: string, password: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(user => {

        return this.afs.collection('gyms').doc(user.user.uid).set({'email': email});
        // return this.setUserDoc(user);
      }).then(data => {
        return this.router.navigate(['/profile']);
      }).catch(err => {
        console.log(err);
      });
  }

  emailSignin(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(user => {
        return this.router.navigate(['/gymScheduleView']);
      }).catch(err => {
        console.log('emailSignin error: ' + err);
      });
  }

  // updateUser(user: User, data: any) {
  //   return this.afs.doc(`users/${user.uid}`).update(data);
  // }

  // private setUserDoc(user) {
  //   const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
  //
  //   const data: User = {
  //     uid: user.uid,
  //     email: user.email || null
  //   };
  //
  //   return userRef.set(data);
  // }

  signinUserBeforePayment(email: string, password: string) {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(
        response => {
          this.router.navigate(['/signupPayment']);
          firebase.auth().currentUser.getIdToken()
            .then(
              (token: string) => this.token = token
            )
        }
      )
      .catch(
        error => console.log(error)
      );
  }

  logout() {
    firebase.auth().signOut();
    this.token = null;
    this.router.navigate(['/']);
  }


  isAuthenticated(): boolean {
    return !!firebase.auth().currentUser;
  }
}
