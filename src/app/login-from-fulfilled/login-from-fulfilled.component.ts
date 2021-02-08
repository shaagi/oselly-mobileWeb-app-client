import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {AuthService} from '../auth/auth.service';
import {Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';
import {UsersService} from '../users.service';
import {MixpanelService} from '../mixpanel.service';
import * as firebase from 'firebase';
import {auth} from 'firebase';

@Component({
  selector: 'app-login-from-fulfilled',
  templateUrl: './login-from-fulfilled.component.html',
  styleUrls: ['./login-from-fulfilled.component.css']
})
export class LoginFromFulfilledComponent implements OnInit, OnDestroy {

  loading = false;

  gettingUserInfo: Subscription;

  constructor(private authService: AuthService,
              private router: Router,
              public afAuth: AngularFireAuth,
              private usersService: UsersService,
              private mixpanelService: MixpanelService) { }

  ngOnInit() {
    if (window) {
      this.loading = window.sessionStorage.getItem('OSELLY.AUTH.LOADING') === 'true';
    }
    // this.afAuth.auth.getRedirectResult().then((res) => {
    //   console.log('Redirect Result: ', res);
    //   alert('Do something');
    // });

    firebase.auth().onAuthStateChanged((user) => {
      console.log('Auth State Changed: ', user);
      if (user) {
        this.gettingUserInfo = this.usersService.getUserInfo(user.email).subscribe(
          data => {
            if (data.length === 0) {
              console.log('person who just logged in isnt a user');
              console.log('firebase users unique uid: ' + user.uid);
              this.usersService.addUser(user.displayName, user.email, false, user.uid);
            } else {
              console.log('person who logged in is already a user');
              this.router.navigate(['/goneThrough']);
            }
          }
        );

      } else {
        this.router.navigate(['/login-from-fulfilled']); // if user is logged out go here
      }
    });
  }

  glogin() {
    this.mixpanelService.track('loginGoogleLoginFromFulfilled');
    console.log('Sign in with redirect');
    this.socialLogin(new auth.GoogleAuthProvider());
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

  fbLogin() {
    this.mixpanelService.track('loginFbLoginFromFulfilled');
    this.socialLogin(new auth.FacebookAuthProvider());
  }

  ngOnDestroy() {
    if (this.gettingUserInfo === undefined) {
    } else {
      this.gettingUserInfo.unsubscribe();
    }

    window.sessionStorage.setItem('OSELLY.AUTH.LOADING', 'false');
  }

}
