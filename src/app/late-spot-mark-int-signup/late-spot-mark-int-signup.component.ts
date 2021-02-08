import {Component, OnDestroy, OnInit} from '@angular/core';
import * as firebase from 'firebase';
import {Subscription} from 'rxjs';
import {UsersService} from '../users.service';
import {Router} from '@angular/router';
import {MixpanelService} from '../mixpanel.service';
import {AngularFireAuth} from '@angular/fire/auth';
import {auth} from 'firebase';

@Component({
  selector: 'app-late-spot-mark-int-signup',
  templateUrl: './late-spot-mark-int-signup.component.html',
  styleUrls: ['./late-spot-mark-int-signup.component.css']
})
export class LateSpotMarkIntSignupComponent implements OnInit, OnDestroy {

  gettingUserInfo: Subscription;

  loading = false;

  constructor(private usersService: UsersService,
              private router: Router,
              private mixpanelService: MixpanelService,
              public afAuth: AngularFireAuth,) { }

  ngOnInit() {
    if (window) {
      this.loading = window.sessionStorage.getItem('OSELLY.AUTH.LOADING') === 'true';
    }

    firebase.auth().onAuthStateChanged((user) => {
      console.log('Auth State Changed: ', user)
      if (user) {
        this.gettingUserInfo = this.usersService.getUserInfo(user.email).subscribe(
          data => {
            if (data.length === 0) {
              console.log('person who just logged in isnt a user');
              this.usersService.addUser(user.displayName, user.email, false, user.uid);
            } else {
              console.log('person who logged in is already a user');
              // this.router.navigate(['/member-payment'], {queryParams: {game: this.gameId}});
              this.router.navigate(['/late-spot-payment'], );
            }
          }
        );
      } else {
        // if user is logged out go here
      }
    });
  }

  glogin() {
    this.mixpanelService.track('loginGoogleLateSpot');
    this.socialLogin(new auth.GoogleAuthProvider());
    // this.afAuth.auth.signInWithRedirect(new auth.GoogleAuthProvider());
  }

  fbLogin() {
    this.mixpanelService.track('loginFacebookLateSpot');
    this.socialLogin(new auth.FacebookAuthProvider());
    // this.afAuth.auth.signInWithRedirect(new auth.FacebookAuthProvider());
  }

  socialLogin(provider) {
    if (window) {
      window.sessionStorage.setItem('OSELLY.AUTH.LOADING', 'true');
    }
    this.afAuth.auth.signInWithRedirect(provider)
      .then((user) => {
        console.log('Sign in with google: ', user);
      }).catch(() => {
      // Todo - something went wrong
    });
  }

  ngOnDestroy() {
    if (this.gettingUserInfo === undefined) {
    } else {
      this.gettingUserInfo.unsubscribe();
    }

    // if (this.gettingGameExpiry === undefined) {
    // } else {
    //   this.gettingGameExpiry.unsubscribe();
    // }
    //
    // clearInterval(this.countInterval);

    window.sessionStorage.setItem('OSELLY.AUTH.LOADING', 'false');
  }

}
