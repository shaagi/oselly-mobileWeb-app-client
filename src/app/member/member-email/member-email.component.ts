import { Component, OnInit } from '@angular/core';
import {MixpanelService} from '../../mixpanel.service';
import {ActivatedRoute, Params, Router} from '@angular/router';

@Component({
  selector: 'app-member-email',
  templateUrl: './member-email.component.html',
  styleUrls: ['./member-email.component.css']
})
export class MemberEmailComponent implements OnInit {

  gameId;

  constructor(private mixpanelService: MixpanelService, private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {

    this.route.queryParams.subscribe((queryParams: Params) => {
      this.gameId = queryParams['game'];
    });

  }

  next() {
    this.mixpanelService.track('memberEmailMessageNext');
    this.router.navigate(['/memberEmailCorrectOrNot'], {queryParams: {game: this.gameId}});
  }

}
