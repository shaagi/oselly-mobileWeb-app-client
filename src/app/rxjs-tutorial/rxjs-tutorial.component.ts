import { Component, OnInit } from '@angular/core';
import {
  AsyncSubject,
  BehaviorSubject,
  concat,
  from,
  fromEvent,
  interval,
  merge,
  noop,
  Observable,
  of,
  ReplaySubject,
  Subject,
  timer
} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import {concatMap, debounceTime, filter, map, mergeMap, pluck, share, shareReplay, skipUntil, tap} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-rxjs-tutorial',
  templateUrl: './rxjs-tutorial.component.html',
  styleUrls: ['./rxjs-tutorial.component.css']
})
export class RxjsTutorialComponent implements OnInit {

  signinForm: FormGroup;

  constructor(private afs: AngularFirestore, public fb: FormBuilder) { }

  // importantCourt: {courtName: string, gym: any};
  // importantCourtName;
  //
  // importantCourt$: Observable<any>;

  ngOnInit() {

    const observable1 = new Observable((data: any) => {
      let i = 1;
      setInterval(() => {
        data.next(i++);
      }, 1000);
    });

    const observable2 = new Subject;

    setTimeout(() => {
      observable2.next('Hey');
    }, 5000);

    const newObs = observable1.pipe(
      skipUntil(observable2)
    );

    newObs.subscribe((x: any) => this.addItem(x));

    const clicks = fromEvent(document, 'click');
    const result = clicks.pipe(debounceTime(1000));
    result.subscribe(x => console.log(x));

    // const http$ = this.createObservable();
    //
    // const sub = http$.subscribe(data => console.log(data));
    //
    // setTimeout(() => sub.unsubscribe(), 0);

    // const interval1$ = interval(1000);
    //
    // const interval2$ = interval1$.pipe(map(val => 10 * val));
    //
    // const result$ = merge(interval1$, interval2$);
    //
    // result$.subscribe(data => console.log(data));

    // this.signinForm = this.fb.group({
    //   'email': ['', [
    //     Validators.required,
    //     Validators.email
    //   ]
    //   ],
    //   'password': ['', [
    //     Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
    //     Validators.minLength(6),
    //     Validators.maxLength(25),
    //     Validators.required
    //   ]
    //   ],
    // });

    // const source1$ = interval(1000);
    //
    // const source2$ = of(4, 5, 6);
    //
    // const source3$ = of(7, 8, 9);
    //
    // const result$ = concat(source1$, source2$, source3$);
    //
    // result$.subscribe(
    //   val => console.log(val)
    // );

    // const http$: Observable<any> = this.createObservable();
    //
    //
    // this.signinForm.valueChanges
    //   .pipe(
    //     filter(() => this.signinForm.valid),
    //     concatMap(changes => this.saveCourse(changes))
    //   )
    //   .subscribe();


    //
    // const courses$ = http$
    //   .pipe(
    //     tap(() => console.log('HTTP request executed')),
    //     map(res => {
    //       let i;
    //       let resArray = [];
    //       for (i in res) {
    //         resArray.push(res[i].data());
    //       }
    //       return resArray;
    //     }),
    //     shareReplay()
    //   );
    //
    // courses$.subscribe();
    //
    // this.importantCourt$ = courses$
    //   .pipe(
    //     map(courts => {
    //       let something = courts.filter(court => court.courtName === '2nd Court');
    //       console.log(something);
    //       return something[0].courtName;
    //       })
    // );


  }

  addItem(val: any) {
    var node = document.createElement("li");
    var textnode = document.createTextNode(val);
    node.appendChild(textnode);
    document.getElementById("output").appendChild(node);
  }

  // saveCourse(changes) {
  //   console.log(changes);
  //   return this.afs.collection('courts').get();
  // }
  //
  // get emailSignin() {
  //   return this.signinForm.get('email');
  // }
  //
  // get passwordSignin() {
  //   return this.signinForm.get('password');
  // }
  //
  // signin() {
  //   console.log('pretend sign in with: ' + this.emailSignin.value, this.passwordSignin.value);
  // }
  //
  // createObservable() { // tutorial author exported this function to a util file but screw that for now
  //   return new Observable(observer => {
  //
  //     const controller = new AbortController();
  //     const signal = controller.signal;
  //
  //     this.afs.collection('courts').get().toPromise()
  //       .then(info => {
  //         // console.log(info.docs[0].data());
  //         return info.docs;
  //       }).then(result => {
  //       observer.next(result);
  //       observer.complete();
  //     }).catch(err => {
  //       observer.error(err);
  //     });
  //
  //     return () => controller.abort();
  //   });
  // }

}
