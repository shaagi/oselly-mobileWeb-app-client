import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import * as firebase from 'firebase';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';
import {auth} from 'firebase';
import {GamesService} from '../../games.service';
import {UsersService} from '../../users.service';
import {Subscription} from 'rxjs';
import {SlotsService} from '../../slots.service';
import {MixpanelService} from '../../mixpanel.service';
import {AuthService} from '../../auth/auth.service';


@Component({
  selector: 'app-signup-personal',
  templateUrl: './signup-personal.component.html',
  styleUrls: ['./signup-personal.component.css']
})
export class SignupPersonalComponent implements OnInit, OnDestroy {

  gettingUserInfo: Subscription;
  getSlotInfoSub: Subscription;
  authStateChangedSub: firebase.Unsubscribe;
  slotId;
  slotBooked;

  loading = false;
  qParamString;
  min;
  max;

  constructor(private authService: AuthService,
              private router: Router,
              public afAuth: AngularFireAuth,
              private gamesServiceAfs: GamesService,
              private usersService: UsersService,
              private route: ActivatedRoute,
              private slotsService: SlotsService,
              private mixpanelService: MixpanelService) { }

  ngOnInit() {
    if (window) {
      this.loading = window.sessionStorage.getItem('OSELLY.AUTH.LOADING') === 'true';
    }

    this.route.queryParams.subscribe((queryParams: Params) => {
      this.qParamString = queryParams['slot'];
      this.min = queryParams['min'];
      this.max = queryParams['max'];
      this.authStateChangedSub = firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.gettingUserInfo = this.usersService.getUserInfo(user.email).subscribe(data => {
            if (data.length === 0) {
              console.log('person who just logged in isnt a user');
              this.usersService.addUser(user.displayName, user.email, false, user.uid);
            } else {
              console.log('person who logged in is already a user');
              console.log(data);
              console.log(data[0].data.emailPreferred);
              if (data[0].data.emailPreferred !== undefined) {
                if (data[0].data.givenPaymentInfo === true) {
                  this.router.navigate(['/prebookExplanation'], {
                    queryParams: {slot: this.qParamString, min: this.min, max: this.max}
                  });
                } else {
                  this.router.navigate(['/hostPayment'], {
                    queryParams: {slot: this.qParamString, min: this.min, max: this.max}
                  });
                }
              } else {
                this.router.navigate(['/hostEmail'], {
                  queryParams: {slot: this.qParamString, min: this.min, max: this.max}
                });
              }
            }
          });
        } else {
          // do nothing here
        }
      });
    });
  }

  glogin() {
    this.mixpanelService.track('googleLoginSignupPersonal');
    this.socialLogin(new auth.GoogleAuthProvider());
    // this.afAuth.auth.signInWithRedirect(new auth.GoogleAuthProvider());
  }

  fbLogin(){
    this.mixpanelService.track('facebookLoginSignupPersonal');
    this.socialLogin(new auth.FacebookAuthProvider());
    // this.afAuth.auth.signInWithRedirect(new auth.FacebookAuthProvider());
  }

  socialLogin(provider) {
    // this.afAuth.auth.signInWithPopup(provider)
    //   .then((user) => {
    //     this.loading = true;
    //     console.log('Sign in with google: ', user);
    //   }).catch(() => {
    //   // Todo - something went wrong
    // });

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

  mixpanel() {
    this.mixpanelService.track('slotBookedSignupPersonal');
  }

  ngOnDestroy() {
    if (this.gettingUserInfo !== undefined) {
      this.gettingUserInfo.unsubscribe();
    }
    if (this.getSlotInfoSub !== undefined) {
      this.getSlotInfoSub.unsubscribe();
    }

    this.authStateChangedSub();

    window.sessionStorage.setItem('OSELLY.AUTH.LOADING', 'false');
  }
}
