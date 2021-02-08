import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, Injectable, NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SlotsComponent } from './host/slots/slots.component';
import { MinMaxChoiceComponent } from './host/min-max-choice/min-max-choice.component';
import { InviteOthersComponent } from './host/invite-others/invite-others.component';
import { SignupPersonalComponent } from './host/signup-personal/signup-personal.component';
import { GoneThroughComponent } from './shared/gone-through/gone-through.component';
import { MemberFirstScreenComponent } from './member/member-first-screen/member-first-screen.component';
import { GameClosedComponent } from './member/game-closed/game-closed.component';
import { MarkInterestedSignupComponent } from './member/mark-interested-signup/mark-interested-signup.component';
import { MemberInterestedInviteComponent } from './member/member-interested-invite/member-interested-invite.component';
import { AppRoutingModule } from './app-routing.module';
import { CheckTimingsComponent } from './host/check-timings/check-timings.component';
import { CantMessageComponent } from './member/cant-message/cant-message.component';
import { RejectFormFilledComponent } from './member/reject-form-filled/reject-form-filled.component';
import { SignupRegComponent } from './auth/signup-reg/signup-reg.component';
import { LoginRegComponent } from './auth/login-reg/login-reg.component';
import { ProfilePageComponent } from './shared/profile-page/profile-page.component';
import { AuthService } from './auth/auth.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { IsAuthHeaderComponent } from './header/is-auth-header/is-auth-header.component';
import { IsntAuthHeaderComponent } from './header/isnt-auth-header/isnt-auth-header.component';
import { AuthGuard } from './auth/auth-guard.service';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { AngularFireModule } from 'angularfire2'; // for this import and the one below it I had to comment out identically named lines above
import { AngularFirestoreModule } from 'angularfire2/firestore'; // this was for the tutorial Aditya sent


import { HttpClientModule } from '@angular/common/http';
import { MemberMemberFirstScreenComponent } from './memberMember/member-member-first-screen/member-member-first-screen.component';
import { MemberMemberMarkIntSignupComponent } from './memberMember/member-member-mark-int-signup/member-member-mark-int-signup.component';
import { GamesService } from './games.service';
import { UsersService } from './users.service';
import { AngularFireFunctionsModule, FunctionsRegionToken } from '@angular/fire/functions';
import { CommonModule } from '@angular/common';
import { SlotsService } from './slots.service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { SecondsToDatePipe } from './seconds-to-date.pipe';
import { SecondsToTimePipe } from './seconds-to-time.pipe';
import { JustBookedComponent } from './host/just-booked/just-booked.component';
import { PendingGamesComponent } from './pending-games/pending-games.component';
import { PendingGameInfoComponent } from './pending-game-info/pending-game-info.component';
import { FulfilledGameInfoComponent } from './fulfilled-game-info/fulfilled-game-info.component';
import { environment } from '../environments/environment';
import { MixpanelService } from './mixpanel.service';
import * as Sentry from '@sentry/browser';
import { ContactUsComponent } from './shared/contact-us/contact-us.component';
import { HowItWorksComponent } from './how-it-works/how-it-works.component';
import {ShareService} from './share.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToastrModule} from 'ngx-toastr';
import { HowItWorksRegComponent } from './how-it-works-reg/how-it-works-reg.component';
import { GymNameAndPicComponent } from './gym-name-and-pic/gym-name-and-pic.component';
import { UserPaysCalculatorComponent } from './user-pays-calculator/user-pays-calculator.component';
import { WhoElseIntComponent } from './who-else-int/who-else-int.component';
import { HostPhoneNumberComponent } from './host/host-phone-number/host-phone-number.component';
import { HostPaymentComponent } from './host/host-payment/host-payment.component';
import { MemberPaymentComponent } from './member/member-payment/member-payment.component';
import { MemberMemberPaymentComponent } from './memberMember/member-member-payment/member-member-payment.component';
import { BookingExpiryTimerComponent } from './booking-expiry-timer/booking-expiry-timer.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { LoginRegPaymentComponent } from './auth/login-reg-payment/login-reg-payment.component';
import { WhoElsePaidComponent } from './who-else-paid/who-else-paid.component';
import { LoginFromFulfilledComponent } from './login-from-fulfilled/login-from-fulfilled.component';
import { UserPaysRangeComponent } from './user-pays-range/user-pays-range.component';

import { SafariPrivateModeComponent } from './safari-private-mode/safari-private-mode.component';
import { BramptonSignupsComponent } from './brampton-signups/brampton-signups.component';
import { ReplaceFirstScreenComponent } from './replace-first-screen/replace-first-screen.component';
import { ReplaceMarkIntSignupComponent } from './replace-mark-int-signup/replace-mark-int-signup.component';
import { ReplacePaymentComponent } from './replace-payment/replace-payment.component';
import { LateSpotFirstScreenComponent } from './late-spot-first-screen/late-spot-first-screen.component';
import { LateSpotMarkIntSignupComponent } from './late-spot-mark-int-signup/late-spot-mark-int-signup.component';
import { LateSpotPaymentComponent } from './late-spot-payment/late-spot-payment.component';
import { ReplaceInfoComponent } from './replace-info/replace-info.component';
import { ReplaceClosedComponent } from './replace-closed/replace-closed.component';
import { GymLoginComponent } from './gym-login/gym-login.component';
import { GymScheduleViewComponent } from './gym-schedule-view/gym-schedule-view.component';
import { GymHeaderComponent } from './header/gym-header/gym-header.component';
import { RxjsTutorialComponent } from './rxjs-tutorial/rxjs-tutorial.component';
import { GymSignupComponent } from './gym-signup/gym-signup.component';
import { MemberHowToInviteComponent } from './member/member-how-to-invite/member-how-to-invite.component';
import { MemberEmailComponent } from './member/member-email/member-email.component';
import { MemberEmailCorrectOrNotComponent } from './member/member-email-correct-or-not/member-email-correct-or-not.component';
import { MemberEnterCorrectEmailComponent } from './member/member-enter-correct-email/member-enter-correct-email.component';
import { HostEmailComponent } from './host/host-email/host-email.component';
import { HostEmailCorrectOrNotComponent } from './host/host-email-correct-or-not/host-email-correct-or-not.component';
import { HostEnterCorrectEmailComponent } from './host/host-enter-correct-email/host-enter-correct-email.component';
import { MemberMemberEmailComponent } from './memberMember/member-member-email/member-member-email.component';
import { MemberMemberEmailCorrectOrNotComponent } from './memberMember/member-member-email-correct-or-not/member-member-email-correct-or-not.component';
import { MemberMemberEnterCorrectEmailComponent } from './memberMember/member-member-enter-correct-email/member-member-enter-correct-email.component';
import { FlopHowItWorksComponent } from './flop-how-it-works/flop-how-it-works.component';
import { ProfileEnterCorrectEmailComponent } from './profile-enter-correct-email/profile-enter-correct-email.component';
import { BookingSuggestionComponent } from './host/booking-suggestion/booking-suggestion.component';
import {GtagModule} from 'angular-gtag';
import { MemberFaqComponent } from './member/member-faq/member-faq.component';
import { MemberMemberFaqComponent } from './memberMember/member-member-faq/member-member-faq.component';
import { PrebookExplanationComponent } from './host/prebook-explanation/prebook-explanation.component';

var firebaseConfig = environment.firebaseConfig; // changed this to var from const and it suddenly used the right firebase config

@Injectable()
export class SentryErrorHandler implements ErrorHandler {

  constructor() {
    if (environment.production) {
      Sentry.init({
        dsn: 'REDACTED'
      });
    }
  }

  handleError(error) {
    if (environment.production) {
      Sentry.captureException(error.originalError || error);
    }
    throw error;
  }
}

@NgModule({
  declarations: [
    AppComponent,
    SlotsComponent,
    MinMaxChoiceComponent,
    InviteOthersComponent,
    SignupPersonalComponent,
    GoneThroughComponent,
    MemberFirstScreenComponent,
    GameClosedComponent,
    MarkInterestedSignupComponent,
    MemberInterestedInviteComponent,
    CheckTimingsComponent,
    CantMessageComponent,
    RejectFormFilledComponent,
    SignupRegComponent,
    LoginRegComponent,
    ProfilePageComponent,
    IsAuthHeaderComponent,
    IsntAuthHeaderComponent,
    MemberMemberFirstScreenComponent,
    MemberMemberMarkIntSignupComponent,
    SecondsToDatePipe,
    SecondsToTimePipe,
    JustBookedComponent,
    PendingGamesComponent,
    PendingGameInfoComponent,
    FulfilledGameInfoComponent,
    ContactUsComponent,
    HowItWorksComponent,
    HowItWorksRegComponent,
    GymNameAndPicComponent,
    UserPaysCalculatorComponent,
    WhoElseIntComponent,
    HostPhoneNumberComponent,
    HostPaymentComponent,
    MemberPaymentComponent,
    MemberMemberPaymentComponent,
    BookingExpiryTimerComponent,
    LoadingSpinnerComponent,
    LoginRegPaymentComponent,
    WhoElsePaidComponent,
    LoginFromFulfilledComponent,
    UserPaysRangeComponent,
    SafariPrivateModeComponent,
    BramptonSignupsComponent,
    ReplaceFirstScreenComponent,
    ReplaceMarkIntSignupComponent,
    ReplacePaymentComponent,
    LateSpotFirstScreenComponent,
    LateSpotMarkIntSignupComponent,
    LateSpotPaymentComponent,
    ReplaceInfoComponent,
    ReplaceClosedComponent,
    GymLoginComponent,
    GymScheduleViewComponent,
    GymHeaderComponent,
    RxjsTutorialComponent,
    GymSignupComponent,
    MemberHowToInviteComponent,
    MemberEmailComponent,
    MemberEmailCorrectOrNotComponent,
    MemberEnterCorrectEmailComponent,
    HostEmailComponent,
    HostEmailCorrectOrNotComponent,
    HostEnterCorrectEmailComponent,
    MemberMemberEmailComponent,
    MemberMemberEmailCorrectOrNotComponent,
    MemberMemberEnterCorrectEmailComponent,
    FlopHowItWorksComponent,
    ProfileEnterCorrectEmailComponent,
    BookingSuggestionComponent,
    MemberFaqComponent,
    MemberMemberFaqComponent,
    PrebookExplanationComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    AngularFireFunctionsModule,
    InfiniteScrollModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    ReactiveFormsModule,
    GtagModule.forRoot({ trackingId: environment.gtagTrackingId, trackPageviews: true }),

  ],
  providers: [
    AuthService,
    AuthGuard,
    GamesService,
    UsersService,
    SlotsService,
    MixpanelService,
    ShareService,
    {provide: FunctionsRegionToken, useValue: 'us-central1'},
    {provide: ErrorHandler, useClass: SentryErrorHandler}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
