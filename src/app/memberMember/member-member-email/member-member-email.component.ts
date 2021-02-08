import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {MixpanelService} from '../../mixpanel.service';

@Component({
  selector: 'app-member-member-email',
  templateUrl: './member-member-email.component.html',
  styleUrls: ['./member-member-email.component.css']
})
export class MemberMemberEmailComponent implements OnInit {

  gameId;
  member;

  constructor(private route: ActivatedRoute, private mixpanelService: MixpanelService,
              private router: Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe((queryParams: Params) => {
      this.gameId = queryParams['game'];
      this.member = queryParams['member'];
    });
  }

  next() {
    this.mixpanelService.track('memberMemberEmailMessageNext');
    this.router.navigate(['/memberMemberEmailCorrectOrNot'], { queryParams: {member: this.member, game: this.gameId}});
  }

}
