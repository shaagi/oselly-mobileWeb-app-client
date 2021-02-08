import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {GamesService} from '../games.service';
import {Subscription} from 'rxjs';
import {UsersService} from '../users.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-who-else-int',
  templateUrl: './who-else-int.component.html',
  styleUrls: ['./who-else-int.component.css']
})
export class WhoElseIntComponent implements OnInit, OnDestroy {
  gameId;
  getHostSub: Subscription;
  getSemiHostsSub: Subscription;
  getMembersSub: Subscription;
  getSpotBuyersSub: Subscription;
  semiHosts;
  hostFireStore;
  memberInvitees = [];
  semiHostInviters = [];
  spotBuyers = [];
  spotSellers = [];

  hostFlopped = false;

  guyWhoJustGotIn;
  getGuyWhoJustGotInsNameSub: Subscription;

  authStateChangedSub: firebase.Unsubscribe;

  constructor(private route: ActivatedRoute, private gameServiceAfs: GamesService, private usersService: UsersService) { }

  ngOnInit() {

    this.authStateChangedSub = firebase.auth().onAuthStateChanged((user) => {
      console.log('Auth State Changed: ', user);
      if (user) {
        if (window.location.pathname === '/memberInviteOthers') {
          console.log('were on /memberInviteOthers');
          this.getGuyWhoJustGotInsNameSub = this.usersService.getUsersDisplayName(firebase.auth().currentUser.uid).subscribe(usersDisplayName => {
            this.guyWhoJustGotIn = usersDisplayName;
            console.log('guy who just got in is: ' + this.guyWhoJustGotIn);
            this.makeWhoElseInTable();
            this.getGuyWhoJustGotInsNameSub.unsubscribe();
          });
        } else {
          this.makeWhoElseInTable();
        }
      } else {
        this.makeWhoElseInTable();
      }
    });
  }

  makeWhoElseInTable() {
    this.route.queryParams.subscribe((queryParams: Params) => {

      if (queryParams['memberAndGame'] !== undefined) {
        const memberAndGameQParam = queryParams['memberAndGame'];
        const pos = memberAndGameQParam.search('0se11y') + 6;
        this.gameId = memberAndGameQParam.substring(pos);
      } else {
        this.gameId = queryParams['game'];
      }

      this.gameServiceAfs.getGame(this.gameId);

      this.getHostSub = this.gameServiceAfs.getHost(this.gameId).subscribe((host: any[]) => {
        if (host[0] !== undefined) {
          this.hostFireStore = host[0].data.name;
        } else {
          this.hostFlopped = true;
          this.hostFireStore = 'host';
        }
      });

      this.getSemiHostsSub = this.gameServiceAfs.getSemiHosts(this.gameId).subscribe((semiHosts: any[]) => {
          this.semiHosts = [];
          for (let semiHostIndexVal in semiHosts) {
            // if (semiHosts[semiHostIndexVal].data.name !== this.guyWhoJustGotIn) {
              this.semiHosts.push(semiHosts[semiHostIndexVal].data.name);
            // }
          }
        }
      );

      this.getMembersSub = this.gameServiceAfs.getMembers(this.gameId).subscribe((members: any[]) => {
        this.semiHostInviters = [];
        this.memberInvitees = [];
        for (let indexVal in members) {
          // if (members[indexVal].data.name !== this.guyWhoJustGotIn) {
            this.memberInvitees.push(members[indexVal].data.name);
            this.semiHostInviters.push(members[indexVal].data.invitedBy);
          // }
        }
      });

      this.getSpotBuyersSub = this.gameServiceAfs.getSpotBuyers(this.gameId).subscribe((spotBuyers: any[]) => {
        this.spotBuyers = [];
        this.spotSellers = [];
        for (let indexVal in spotBuyers) {
          this.spotBuyers.push(spotBuyers[indexVal].data.name);
          this.spotSellers.push(spotBuyers[indexVal].data.replaced);
        }
      });
    });
  }

  ngOnDestroy() {
    if (this.getHostSub !== undefined) {
      this.getHostSub.unsubscribe();
    }
    if (this.getSemiHostsSub !== undefined) {
      this.getSemiHostsSub.unsubscribe();
    }
    if (this.getMembersSub !== undefined) {
      this.getMembersSub.unsubscribe();
    }
    if (this.getSpotBuyersSub !== undefined) {
      this.getSpotBuyersSub.unsubscribe();
    }

    this.authStateChangedSub();
  }

}
