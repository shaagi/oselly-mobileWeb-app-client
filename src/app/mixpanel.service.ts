// import * as Mixpanel from 'mixpanel';
import * as mixpanel from 'mixpanel-browser';
import {environment} from '../environments/environment';
import * as Sentry from '@sentry/browser';

export class MixpanelService {
  // grab the Mixpanel factory
  // var Mixpanel = require('mixpanel');



  constructor() {
    // create an instance of the mixpanel client
    // const mixpanel = Mixpanel.init('REDACTED');
    mixpanel.init('REDACTED');
  }

  track(eventName: string) {
    if (environment.production) {
      mixpanel.track(eventName);
    }
  }

  // public track() {
  //   mixpanel.track('click', {pageName:'login'})
  // }

}
