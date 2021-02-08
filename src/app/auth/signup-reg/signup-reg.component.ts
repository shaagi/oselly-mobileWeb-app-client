import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../auth.service';
import * as firebase from 'firebase';
import {Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';
import {auth} from 'firebase';
import {UsersService} from '../../users.service';
import {Subscription} from 'rxjs';
import {MixpanelService} from '../../mixpanel.service';

@Component({
  selector: 'app-signup-reg',
  templateUrl: './signup-reg.component.html',
  styleUrls: ['./signup-reg.component.css']
})
export class SignupRegComponent implements OnInit, OnDestroy {
  gettingUserInfo: Subscription;
  constructor(private authService: AuthService,
              private router: Router,
              public afAuth: AngularFireAuth,
              private usersService: UsersService,
              private mixpanelService: MixpanelService) { }

  ngOnInit() {
    console.log(this.gettingUserInfo);
    firebase.auth().onAuthStateChanged((user) => {
      console.log('Auth State Changed: ', user)
      if (user) {
        // this.router.navigate(['/']);
       this.gettingUserInfo = this.usersService.getUserInfo(user.email).subscribe(
          data => {
            if (data.length === 0) {
              console.log('person who just logged in isnt a user');
              this.usersService.addUser(user.displayName, user.email, false, user.uid);
            } else {
              console.log('person who logged in is already a user');
              this.router.navigate(['/']);
            }
          }
        );
      } else {
        // this.router.navigate(['/signupReg']); // if user is logged out go here
      }
    });
  }

  glogin() {
    this.mixpanelService.track('googleLoginSignupReg');
    this.afAuth.auth.signInWithRedirect(new auth.GoogleAuthProvider());
  }

  fbLogin(){
    this.mixpanelService.track('fbLoginSignupReg');
    this.afAuth.auth.signInWithRedirect(new auth.FacebookAuthProvider());
  }

  ngOnDestroy() {
    if (this.gettingUserInfo === undefined) {
    } else {
      this.gettingUserInfo.unsubscribe();
    }
  }
}
