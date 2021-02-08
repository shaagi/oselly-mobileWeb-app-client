import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {CheckTimingsComponent} from './host/check-timings/check-timings.component';
import {SlotsComponent} from './host/slots/slots.component';
import {MinMaxChoiceComponent} from './host/min-max-choice/min-max-choice.component';
import {InviteOthersComponent} from './host/invite-others/invite-others.component';
import {SignupPersonalComponent} from './host/signup-personal/signup-personal.component';

import {GoneThroughComponent} from './shared/gone-through/gone-through.component';
import {MarkInterestedSignupComponent} from './member/mark-interested-signup/mark-interested-signup.component';
import {MemberInterestedInviteComponent} from './member/member-interested-invite/member-interested-invite.component';
import {CantMessageComponent} from './member/cant-message/cant-message.component';
import {RejectFormFilledComponent} from './member/reject-form-filled/reject-form-filled.component';

import {SignupRegComponent} from './auth/signup-reg/signup-reg.component';
import {LoginRegComponent} from './auth/login-reg/login-reg.component';
import {ProfilePageComponent} from './shared/profile-page/profile-page.component';
import {AuthGuard} from './auth/auth-guard.service';
import {MemberMemberMarkIntSignupComponent} from './memberMember/member-member-mark-int-signup/member-member-mark-int-signup.component';
import {PendingGamesComponent} from './pending-games/pending-games.component';
import {PendingGameInfoComponent} from './pending-game-info/pending-game-info.component';
import {FulfilledGameInfoComponent} from './fulfilled-game-info/fulfilled-game-info.component';
import {ContactUsComponent} from './shared/contact-us/contact-us.component';
import {HowItWorksComponent} from './how-it-works/how-it-works.component';
import {HowItWorksRegComponent} from './how-it-works-reg/how-it-works-reg.component';
import {HostPhoneNumberComponent} from './host/host-phone-number/host-phone-number.component';
import {HostPaymentComponent} from './host/host-payment/host-payment.component';
import {MemberPaymentComponent} from './member/member-payment/member-payment.component';
import {MemberMemberPaymentComponent} from './memberMember/member-member-payment/member-member-payment.component';
import {LoginRegPaymentComponent} from './auth/login-reg-payment/login-reg-payment.component';
import {LoginFromFulfilledComponent} from './login-from-fulfilled/login-from-fulfilled.component';
import {ReplaceFirstScreenComponent} from './replace-first-screen/replace-first-screen.component';
import {ReplaceMarkIntSignupComponent} from './replace-mark-int-signup/replace-mark-int-signup.component';
import {ReplacePaymentComponent} from './replace-payment/replace-payment.component';
import {LateSpotFirstScreenComponent} from './late-spot-first-screen/late-spot-first-screen.component';
import {LateSpotMarkIntSignupComponent} from './late-spot-mark-int-signup/late-spot-mark-int-signup.component';
import {LateSpotPaymentComponent} from './late-spot-payment/late-spot-payment.component';
import {GymLoginComponent} from './gym-login/gym-login.component';
import {GymScheduleViewComponent} from './gym-schedule-view/gym-schedule-view.component';
import {RxjsTutorialComponent} from './rxjs-tutorial/rxjs-tutorial.component';
import {GymSignupComponent} from './gym-signup/gym-signup.component';
import {MemberHowToInviteComponent} from './member/member-how-to-invite/member-how-to-invite.component';
import {MemberMemberFirstScreenComponent} from './memberMember/member-member-first-screen/member-member-first-screen.component';
import {MemberEmailComponent} from './member/member-email/member-email.component';
import {MemberEmailCorrectOrNotComponent} from './member/member-email-correct-or-not/member-email-correct-or-not.component';
import {MemberEnterCorrectEmailComponent} from './member/member-enter-correct-email/member-enter-correct-email.component';
import {HostEmailComponent} from './host/host-email/host-email.component';
import {HostEmailCorrectOrNotComponent} from './host/host-email-correct-or-not/host-email-correct-or-not.component';
import {HostEnterCorrectEmailComponent} from './host/host-enter-correct-email/host-enter-correct-email.component';
import {MemberMemberEmailComponent} from './memberMember/member-member-email/member-member-email.component';
import {MemberMemberEmailCorrectOrNotComponent} from './memberMember/member-member-email-correct-or-not/member-member-email-correct-or-not.component';
import {MemberMemberEnterCorrectEmailComponent} from './memberMember/member-member-enter-correct-email/member-member-enter-correct-email.component';
import {FlopHowItWorksComponent} from './flop-how-it-works/flop-how-it-works.component';
import {ProfileEnterCorrectEmailComponent} from './profile-enter-correct-email/profile-enter-correct-email.component';
import {BookingSuggestionComponent} from './host/booking-suggestion/booking-suggestion.component';
import {MemberFirstScreenComponent} from './member/member-first-screen/member-first-screen.component';
import {PrebookExplanationComponent} from './host/prebook-explanation/prebook-explanation.component';


const appRoutes: Routes = [
  { path: '', component: CheckTimingsComponent},
  { path: 'slots', component: SlotsComponent},
  { path: 'minmax', component: MinMaxChoiceComponent},
  { path: 'inviteMembers', component: InviteOthersComponent}, // canActivate: [AuthGuard]
  { path: 'signup', component: SignupPersonalComponent},
  { path: 'prebookExplanation', component: PrebookExplanationComponent},
  { path: 'pendingGames', component: PendingGamesComponent, },
  { path: 'pendingGameInfo', component: PendingGameInfoComponent, },
  { path: 'fulfilledGameInfo', component: FulfilledGameInfoComponent, },
  { path: 'goneThrough', component: GoneThroughComponent}, // canActivate: [AuthGuard]
  { path: 'markMeAsInSignup', component: MarkInterestedSignupComponent},
  { path: 'memberInviteOthers', component: MemberInterestedInviteComponent}, // leave this in for now. hopefully it can be taken out once links work
  { path: 'cant', component: CantMessageComponent},
  { path: 'rejectFormFilled', component: RejectFormFilledComponent},
  { path: 'signupReg', component: SignupRegComponent},
  { path: 'loginReg', component: LoginRegComponent},
  { path: 'profile', component: ProfilePageComponent}, // , canActivate: [AuthGuard]
  { path: 'memberMemberMarkMeInSignup', component: MemberMemberMarkIntSignupComponent},
  { path: 'contactUs', component: ContactUsComponent},
  { path: 'howItWorks', component: HowItWorksComponent},
  { path: 'howItWorksReg', component: HowItWorksRegComponent},
  { path: 'hostPayment', component: HostPaymentComponent}, // { path: 'hostPhoneNumber', component: HostPhoneNumberComponent},
  { path: 'member-payment', component: MemberPaymentComponent},
  { path: 'member-member-payment', component: MemberMemberPaymentComponent},
  { path: 'login-reg-payment', component: LoginRegPaymentComponent},
  { path: 'login-from-fulfilled', component: LoginFromFulfilledComponent},
  { path: 'replace', component: ReplaceFirstScreenComponent},
  { path: 'replaceMarkInSignup', component: ReplaceMarkIntSignupComponent},
  { path: 'replace-payment', component: ReplacePaymentComponent},
  { path: 'lateSpot', component: LateSpotFirstScreenComponent},
  { path: 'lateSpotMarkIntSignup', component: LateSpotMarkIntSignupComponent},
  { path: 'late-spot-payment', component: LateSpotPaymentComponent},
  { path: 'gymLogin', component: GymLoginComponent},
  { path: 'gymSignup', component: GymSignupComponent},
  { path: 'gymScheduleView', component: GymScheduleViewComponent},
  { path: 'memberHowToInvite', component: MemberHowToInviteComponent},
  { path: 'memberMemberFirstScreen', component: MemberMemberFirstScreenComponent},
  { path: 'memberEmail', component: MemberEmailComponent},
  { path: 'memberEmailCorrectOrNot', component: MemberEmailCorrectOrNotComponent},
  { path: 'memberEnterCorrectEmail', component: MemberEnterCorrectEmailComponent},
  { path: 'hostEmail', component: HostEmailComponent},
  { path: 'hostEmailCorrectOrNot', component: HostEmailCorrectOrNotComponent},
  { path: 'hostEnterCorrectEmail', component: HostEnterCorrectEmailComponent},
  { path: 'memberMemberEmail', component: MemberMemberEmailComponent},
  { path: 'memberMemberEmailCorrectOrNot', component: MemberMemberEmailCorrectOrNotComponent},
  { path: 'memberMemberEnterCorrectEmail', component: MemberMemberEnterCorrectEmailComponent},
  { path: 'profileEnterCorrectEmail', component: ProfileEnterCorrectEmailComponent},
  { path: 'bookingSuggestion', component: BookingSuggestionComponent},
  { path: 'memberFirstScreen', component: MemberFirstScreenComponent},
  { path: 'flopHowItWorks', component: FlopHowItWorksComponent},
  { path: 'rxjs', component: RxjsTutorialComponent}, // take this out once you understand rxjs
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules, scrollPositionRestoration: 'enabled'})
  ],
  exports: [RouterModule]
})

export class AppRoutingModule {

}
