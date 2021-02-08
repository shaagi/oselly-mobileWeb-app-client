import {Component, OnDestroy, OnInit} from '@angular/core';
import * as firebase from 'firebase';
import {Subscription} from 'rxjs';
import {UsersService} from '../users.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {auth} from 'firebase';
import {MixpanelService} from '../mixpanel.service';
import {AngularFireAuth} from '@angular/fire/auth';
import {GamesService} from '../games.service';

@Component({
  selector: 'app-replace-mark-int-signup',
  templateUrl: './replace-mark-int-signup.component.html',
  styleUrls: ['./replace-mark-int-signup.component.css']
})
export class ReplaceMarkIntSignupComponent implements OnInit, OnDestroy {

  gettingUserInfo: Subscription;

  loading = false;

  gameId;
  sellerUid;

  getGameInfoSub: Subscription;
  countDownDate;
  countInterval;
  now;
  distance;
  hoursLeft;
  minutesLeft;
  secondsLeft;
  secondsLeftRefined;
  minutesLeftRefined;

  replaceClosed = false;

  getSpotSellers: Subscription;

  constructor(private usersService: UsersService, private router: Router,
              private mixpanelService: MixpanelService, public afAuth: AngularFireAuth,
              private route: ActivatedRoute, private gameServiceAfs: GamesService) { }

  ngOnInit() {
    if (window) {
      this.loading = window.sessionStorage.getItem('OSELLY.AUTH.LOADING') === 'true';
    }

    this.route.queryParams.subscribe((queryParams: Params) => {
      this.gameId = queryParams['game'];
      this.sellerUid = queryParams['seller'];

      this.getSpotSellers = this.gameServiceAfs.getSpotSellers(this.gameId).subscribe((spotSellers: any[]) => {
        console.log(spotSellers.length);
        if (spotSellers.length === 0) {
          this.replaceClosed = true;
        }
        let matchesOfSpotSellerInLinkAndFirestore = 0;
        for (let indexVal in spotSellers) {
         if (spotSellers[indexVal].id === this.sellerUid) {
            matchesOfSpotSellerInLinkAndFirestore = matchesOfSpotSellerInLinkAndFirestore + 1;
          }
        }
        if (matchesOfSpotSellerInLinkAndFirestore === 0) {
          this.replaceClosed = true;
        }
      });

      this.gameServiceAfs.getGame(this.gameId); // this line of code might be unnecessary

      this.getGameInfoSub = this.gameServiceAfs.game.subscribe((game) => {
        const currDate = new Date();
        console.log('currDate is: ' + currDate);
        console.log('expiry date is: ' + currDate);
        if (currDate > game.finalizeByDate.toDate()) {
          this.replaceClosed = true;
        }

        this.countDownDate = (game.finalizeByDate.seconds * 1000);

        this.countInterval = setInterval(() => {
          console.log('something');
          this.now = new Date().getTime();
          this.distance = this.countDownDate - this.now;

          if (this.distance < 0) {
            clearInterval(this.countInterval);
            console.log('countDown timer has hit zero');
            this.replaceClosed = true;
          }
          }, 1000);
      });
    });

    firebase.auth().onAuthStateChanged((user) => {
      console.log('Auth State Changed: ', user)
      if (user) {
        this.gettingUserInfo = this.usersService.getUserInfo(user.email).subscribe(data => {
          if (data.length === 0) {
            console.log('person who just logged in isnt a user');
            this.usersService.addUser(user.displayName, user.email, false, user.uid);
          } else {
            console.log('person who logged in is already a user');
            // this.router.navigate(['/member-payment'], {queryParams: {game: this.gameId}});
            this.router.navigate(['/replace-payment'], {queryParams: {game: this.gameId, seller: this.sellerUid}});
          }
        });
      } else {
        // if user is logged out go here
      }
    });
  }

  glogin() {
    this.mixpanelService.track('loginGoogleReplace');
    this.socialLogin(new auth.GoogleAuthProvider());
    // this.afAuth.auth.signInWithRedirect(new auth.GoogleAuthProvider());
  }

  fbLogin() {
    this.mixpanelService.track('loginFacebookReplace');
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

    this.getGameInfoSub.unsubscribe();
    clearInterval(this.countInterval);

    window.sessionStorage.setItem('OSELLY.AUTH.LOADING', 'false');

    this.getSpotSellers.unsubscribe();
  }

}
