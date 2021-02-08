import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../../auth/auth.service';
import * as firebase from 'firebase';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {auth} from 'firebase';
import {AngularFireAuth} from '@angular/fire/auth';
import {GamesService} from '../../games.service';
import {UsersService} from '../../users.service';
import {Subscription} from 'rxjs';
import {MixpanelService} from '../../mixpanel.service';

@Component({
  selector: 'app-mark-interested-signup',
  templateUrl: './mark-interested-signup.component.html',
  styleUrls: ['./mark-interested-signup.component.css']
})
export class MarkInterestedSignupComponent implements OnInit, OnDestroy {

  gameId;
  gettingUserInfo: Subscription;
  gettingGameExpiry: Subscription;

  countDownDate;
  countInterval;
  now;
  distance;
  hoursLeft;
  minutesLeft;
  secondsLeft;
  secondsLeftRefined;
  minutesLeftRefined;

  loading = false;
  // error = false;

  constructor(private authService: AuthService,
              private router: Router,
              public afAuth: AngularFireAuth,
              private route: ActivatedRoute,
              private gamesServiceAfs: GamesService,
              private usersService: UsersService,
              private mixpanelService: MixpanelService) { }

  ngOnInit() {
    if (window) {
      this.loading = window.sessionStorage.getItem('OSELLY.AUTH.LOADING') === 'true';
    }

    this.route.queryParams.subscribe(
      (queryParams: Params) => {
        this.gameId = queryParams['game'];
        this.gamesServiceAfs.getGame(this.gameId);

        this.gettingGameExpiry = this.gamesServiceAfs.game.subscribe( // unsub to this it was giving problems if you touched anything on firebase
          (game) => {
            this.countDownDate = (game.date.seconds * 1000);

            this.countInterval = setInterval(() => {
              console.log('something');
              this.now = new Date().getTime();
              this.distance = this.countDownDate - this.now;

              this.hoursLeft = Math.floor((this.distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
              this.minutesLeft = Math.floor((this.distance % (1000 * 60 * 60)) / (1000 * 60));
              this.secondsLeft = Math.floor((this.distance % (1000 * 60)) / 1000);

              if (this.secondsLeft < 10) {
                this.secondsLeftRefined = '0' + this.secondsLeft;
              } else {
                this.secondsLeftRefined = this.secondsLeft;
              }

              if (this.minutesLeft < 10) {
                this.minutesLeftRefined = '0' + this.minutesLeft;
              } else {
                this.minutesLeftRefined = this.minutesLeft;
              }

              if (this.distance < 0) {
                clearInterval(this.countInterval);
                this.gettingGameExpiry.unsubscribe();
                console.log('countDown timer has hit zero');
              }

            }, 1000);

          }
        );
      }
    );

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
              // this.route.queryParams.subscribe(
              //   (queryParams: Params) => {
              //     this.gameId = queryParams['game'];
              //     this.gamesServiceAfs.addSemiHostToGameNew(this.gameId, user.email);
              //   }
              // );
              // this.router.navigate(['/memberInviteOthers'], { queryParams: {member: user.displayName, game: this.gameId}, fragment: 'loading'});
              // this.router.navigate(['/member-payment'], {queryParams: {game: this.gameId}});
              if (data[0].data.emailPreferred !== undefined) {
                this.router.navigate(['/member-payment'], {
                  queryParams: {game: this.gameId}
                });
              } else {
                this.router.navigate(['/memberEmail'], {queryParams: {game: this.gameId}});
              }

            }
          }
        );
      } else {
        // if user is logged out go here
      }
    });
  }

  glogin() {
    this.mixpanelService.track('loginGoogleSemiHost');
    this.socialLogin(new auth.GoogleAuthProvider());
    // this.afAuth.auth.signInWithRedirect(new auth.GoogleAuthProvider());
  }

  fbLogin(){
    this.mixpanelService.track('loginFacebookSemiHost');
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
    //   //   this.error = true;
    //   //   this.router.navigate(['/slots']);
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

  ngOnDestroy() {
    if (this.gettingUserInfo === undefined) {
    } else {
      this.gettingUserInfo.unsubscribe();
    }

    if (this.gettingGameExpiry === undefined) {
    } else {
      this.gettingGameExpiry.unsubscribe();
    }

    clearInterval(this.countInterval);

    window.sessionStorage.setItem('OSELLY.AUTH.LOADING', 'false');
  }
}
