import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {GamesService} from '../games.service';
import {SlotsService} from '../slots.service';
import {ActivatedRoute, Params, Router,} from '@angular/router';
import moment from 'moment';
import 'moment-timezone';
import * as firebase from 'firebase';
import {UsersService} from '../users.service';
import {ToastrService} from 'ngx-toastr';
// import Clipboard from 'clipboard';
import {MixpanelService} from '../mixpanel.service';
import copy from 'clipboard-copy';

@Component({
  selector: 'app-fulfilled-game-info',
  templateUrl: './fulfilled-game-info.component.html',
  styleUrls: ['./fulfilled-game-info.component.css']
})
export class FulfilledGameInfoComponent implements OnInit, OnDestroy {

  getGameInfoSub: Subscription;
  getGameIdSub: Subscription;
  gethostSub: Subscription;
  getSemiHostsSub: Subscription;
  getMembersSub: Subscription;

  tempGameId;
  semiHosts;
  hostFireStore;
  memberInvitees = [];
  semiHostInviters = [];

  noOfPplWithHostIncludingHost;
  noOfSemihostsIn;
  noOfMembersIn;
  noOfSpotBuyersIn;
  totalPplIn;

  spotSellers = [];
  spotSellersUids = [];
  wantsToSellSpot = false;
  getSpotSellerInfoSub: Subscription;
  getSpotSellers: Subscription;

  copyLinkObject;

  getSellerUidUsingNameSub: Subscription;

  hostFlopped = false;

  spotSellersAlreadySold = [];
  spotBuyers = [];
  getSpotBuyersSub: Subscription;
  isSpotBuyer = false;
  finalizeByDateTorontoTime;
  canSellSpot = true;
  countInterval;

  constructor(private gameServiceAfs: GamesService,
              private route: ActivatedRoute,
              private usersService: UsersService,
              private toastr: ToastrService,
              private mixpanelService: MixpanelService) { }



  ngOnInit() {
    this.getGameIdSub = this.route.queryParams.subscribe(
      (queryParams: Params) => {
        this.tempGameId = queryParams['game'];

        this.gameServiceAfs.getGame(this.tempGameId); // this line of code might be unnecessary

        this.getGameInfoSub = this.gameServiceAfs.game.subscribe(
          (game) => {
            console.log(game.finalizeByDate.toDate());
            this.countInterval = setInterval(() => {
              console.log('something');
              const currDate = new Date();
              if (game.finalizeByDate !== undefined && currDate > game.finalizeByDate.toDate()) { // only added undefined conditional to not get error emails on Fri March 29 game
                console.log('worked');
                this.canSellSpot = false;
                clearInterval(this.countInterval);
              }
            }, 1000);

            this.gameServiceAfs.getHost(this.tempGameId).subscribe((host: any[]) => {
              this.noOfPplWithHostIncludingHost = host.length; // rn this will equal one as I havent added the 'bringing my bro with me' functionality
              this.gameServiceAfs.getSemiHosts(this.tempGameId).subscribe((semiHosts: any[]) => {
                this.noOfSemihostsIn = semiHosts.length;
                this.gameServiceAfs.getMembers(this.tempGameId).subscribe((members: any[]) => {
                  this.noOfMembersIn = members.length;
                  this.gameServiceAfs.getSpotBuyers(this.tempGameId).subscribe((spotBuyers: any[]) => {
                    this.noOfSpotBuyersIn = spotBuyers.length;
                    this.totalPplIn = this.noOfMembersIn + this.noOfSemihostsIn + this.noOfPplWithHostIncludingHost + this.noOfSpotBuyersIn;
                  });
                });
              });
            });

            if (game.finalizeByDate !== undefined) { // only added undefined conditional to not get error emails on Fri March 29 game
              const finalizeByDateMoment = moment.unix(game.finalizeByDate.seconds);
              this.finalizeByDateTorontoTime = moment(finalizeByDateMoment).tz('America/Toronto').format("dddd, MMMM D, h:mmA");
            }
          }
        );

        this.gethostSub = this.gameServiceAfs.getHost(this.tempGameId).subscribe(
          (host: any[]) => {
            if (host[0] !== undefined) {
              this.hostFireStore = host[0].data.name;
            } else {
              this.hostFlopped = true;
              this.hostFireStore = 'host';
            }
          }
        );

        this.getSemiHostsSub = this.gameServiceAfs.getSemiHosts(this.tempGameId).subscribe(
          (semiHosts: any[]) => {
            this.semiHosts = [];
            for (let semiHostIndexVal in semiHosts) {
              this.semiHosts.push(semiHosts[semiHostIndexVal].data.name);
            }
          }
        );

        this.getMembersSub = this.gameServiceAfs.getMembers(this.tempGameId)
          .subscribe((members: any[]) => {
            this.semiHostInviters = [];
            this.memberInvitees = [];
            for (let indexVal in members) {
              this.memberInvitees.push(members[indexVal].data.name);
              this.semiHostInviters.push(members[indexVal].data.invitedBy);
            }
          });

        this.getSpotSellers = this.gameServiceAfs.getSpotSellers(this.tempGameId).subscribe((spotSellers: any[]) => {
          this.spotSellers = [];
          this.spotSellersUids = [];
          for (let indexVal in spotSellers) {
            this.spotSellers.push(spotSellers[indexVal].data.name);
            this.spotSellersUids.push(spotSellers[indexVal].id);
          }
          if (this.spotSellersUids.includes(firebase.auth().currentUser.uid)) {
            this.wantsToSellSpot = true;
          }
        });

        this.getSpotBuyersSub = this.gameServiceAfs.getSpotBuyers(this.tempGameId).subscribe((spotBuyers: any[]) => {
          this.spotBuyers = [];
          this.spotSellersAlreadySold = [];
          for (let indexVal in spotBuyers) {
            this.spotBuyers.push(spotBuyers[indexVal].data.name);
            this.spotSellersAlreadySold.push(spotBuyers[indexVal].data.replaced);
            if (firebase.auth().currentUser.uid === spotBuyers[indexVal].id) {
              this.isSpotBuyer = true;
            }
          }
        });

      }
    );

    // this.copyLinkObject = new Clipboard('.share-sellSpot-button', {
    //   text: window.location.href
    // });
    // this.copyLinkObject.on('success', () => {
    //   console.log('Shit worked');
    //   this.toastr.success('Link copied to clipboard');
    // });
  }

  sellMySpot() {
    this.mixpanelService.track('YesImSureSellMySpot');

    this.usersService.getUserInfoUid(firebase.auth().currentUser.uid);
    this.getSpotSellerInfoSub = this.usersService.user.subscribe((user) => {
      this.gameServiceAfs.addSpotSellerToGame(window.location.origin, this.tempGameId, firebase.auth().currentUser.uid, user.name);
    });
  }

  // copySellSpotLink(sellerUid): string {
  //   this.mixpanelService.track('sendLinkToFriendsWhoWantHIsSPotButton');
  //
  //   const link = window.location.origin + '/replace?game=' + this.tempGameId + '&' + 'seller=' + sellerUid;
  //   return link;
  // }

  copySellSpotLink(sellerUid) {
    const link = window.location.origin + '/replace?game=' + this.tempGameId + '&' + 'seller=' + sellerUid;
    this.mixpanelService.track('sendLinkToFriendsWhoWantHisSpotButton');
    copy(link)
      .then(data => {
        console.log('it worked');
        return this.toastr.success('Link copied to clipboard');
      }).catch(err => {
      console.log(err);
    });
  }

  mixpanel(eventName: string) {
    this.mixpanelService.track(eventName);
  }

  ngOnDestroy() {
    this.getGameInfoSub.unsubscribe();
    this.getGameIdSub.unsubscribe();
    this.gethostSub.unsubscribe();
    this.getSemiHostsSub.unsubscribe();
    this.getMembersSub.unsubscribe();
    if (this.getSpotSellerInfoSub !== undefined) {
      this.getSpotSellerInfoSub.unsubscribe();
    }
    if (this.getSellerUidUsingNameSub !== undefined) {
      this.getSellerUidUsingNameSub.unsubscribe();
    }
    this.getSpotSellers.unsubscribe();
    this.getSpotBuyersSub.unsubscribe();


    this.copyLinkObject = null;

    clearInterval(this.countInterval);
  }

}
