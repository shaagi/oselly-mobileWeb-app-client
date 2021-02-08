import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import * as firebase from 'firebase';
import {Params, Router} from '@angular/router';
import {auth} from 'firebase';
import {AngularFireAuth} from '@angular/fire/auth';
import {UsersService} from '../../users.service';
import {Observable, Subscription} from 'rxjs';
import {MixpanelService} from '../../mixpanel.service';

@Component({
  selector: 'app-login-reg',
  templateUrl: './login-reg.component.html',
  styleUrls: ['./login-reg.component.css']
})
export class LoginRegComponent implements OnInit, OnDestroy {

  loading = false;

  gettingUserInfo: Subscription;
  authStateChangedSub: firebase.Unsubscribe;

  constructor(private authService: AuthService,
              private router: Router,
              public afAuth: AngularFireAuth,
              private usersService: UsersService,
              private mixpanelService: MixpanelService) { }


  ngOnInit() {
    if (window) {
      this.loading = window.sessionStorage.getItem('OSELLY.AUTH.LOADING') === 'true';
    }

    this.authStateChangedSub = firebase.auth().onAuthStateChanged((user) => {
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
              this.router.navigate(['/login-reg-payment']);
            }
          }
        );

      } else {
        this.router.navigate(['/loginReg']); // if user is logged out go here
      }
    });
  }

  glogin() {
    this.mixpanelService.track('loginGoogleLoginReg');
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
    this.mixpanelService.track('loginFbLoginReg');
    this.socialLogin(new auth.FacebookAuthProvider());
  }

  ngOnDestroy() {
    if (this.gettingUserInfo === undefined) {
    } else {
      this.gettingUserInfo.unsubscribe();
    }

    window.sessionStorage.setItem('OSELLY.AUTH.LOADING', 'false');

    this.authStateChangedSub();
  }

}
