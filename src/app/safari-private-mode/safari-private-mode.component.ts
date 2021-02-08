import { Component, OnInit } from '@angular/core';

declare global {
  interface Window {
    openDatabase: any;
  }
}

@Component({
  selector: 'app-safari-private-mode',
  templateUrl: './safari-private-mode.component.html',
  styleUrls: ['./safari-private-mode.component.css']
})
export class SafariPrivateModeComponent implements OnInit {

  isSafariPrivateMode;

  constructor() { }

  ngOnInit() {
    try {
      window.openDatabase(null, null, null, null);
      console.log('worked');
      this.isSafariPrivateMode = false;
    } catch (_) {
      // isPrivate = true;
      console.log('error');
      this.isSafariPrivateMode = true;
    }
  }

}
