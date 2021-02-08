import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Params} from '@angular/router';
import {GamesService} from '../games.service';

@Component({
  selector: 'app-who-else-paid',
  templateUrl: './who-else-paid.component.html',
  styleUrls: ['./who-else-paid.component.css']
})
export class WhoElsePaidComponent implements OnInit, OnDestroy {
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

  constructor(private route: ActivatedRoute, private gameServiceAfs: GamesService) { }

  ngOnInit() {
    this.route.queryParams.subscribe((queryParams: Params) => {
      this.gameId = queryParams['game'];
      this.gameServiceAfs.getGame(this.gameId);

      this.getHostSub = this.gameServiceAfs.getHost(this.gameId).subscribe((host: any[]) => {
        if (host[0] !== undefined) {
          this.hostFireStore = host[0].data.name;
        } else {
          this.hostFlopped = true;
          this.hostFireStore = 'host';
        }
        }
      );

      this.getSemiHostsSub = this.gameServiceAfs.getSemiHosts(this.gameId).subscribe((semiHosts: any[]) => {
          this.semiHosts = [];
          for (let semiHostIndexVal in semiHosts) {
            this.semiHosts.push(semiHosts[semiHostIndexVal].data.name);
          }
        }
      );

      this.getMembersSub = this.gameServiceAfs.getMembers(this.gameId).subscribe((members: any[]) => {
        this.semiHostInviters = [];
        this.memberInvitees = [];
        for (let indexVal in members) {
          this.memberInvitees.push(members[indexVal].data.name);
          this.semiHostInviters.push(members[indexVal].data.invitedBy);
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
  }

}
