import {Component, OnInit} from '@angular/core';
import {AuthService} from './auth/auth.service';
import {map} from 'rxjs/operators';
import {Observable, Subscription} from 'rxjs';

// firestore video tutorial aditya sent code here
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import * as firebase from 'firebase';
import {Params} from '@angular/router';
import {UsersService} from './users.service';
import {Gtag} from 'angular-gtag';

interface Post {
  title: string;
  content: string;
}
interface PostId extends Post {
  id: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  postsCol: AngularFirestoreCollection<Post>;
  posts: any;

  title: string;
  content: string;

  postDoc: AngularFirestoreDocument<Post>;
  post: Observable<Post>;

  checkIfGymSub: Subscription;
  isGym = false;

  constructor(private afs: AngularFirestore, public authService: AuthService, private usersService: UsersService, public gtag: Gtag) {} // tutorial: added authService bc navbar change needed it

  ngOnInit() {

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.usersService.getGymInfoUid(user.uid);
        this.checkIfGymSub = this.usersService.gym.subscribe((gym) => {
          // console.log(gym);
          if (gym !== undefined) {
            this.isGym = true;
          }
          this.checkIfGymSub.unsubscribe();
        });
      } else {
        this.isGym = false;
      }
    });

    this.postsCol = this.afs.collection('posts'); // , ref => ref.where('title', '==', 'coursetro')
    // this.posts = this.postsCol.valueChanges();
    this.posts = this.postsCol.snapshotChanges()
      .pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Post;
        const id = a.payload.doc.id;
        return { id, data };
      })
    }));
  }

  addPost() {
    // this.afs.collection('posts').add({'title': this.title, 'content': this.content});
    this.afs.collection('posts').doc('my-custom-id').set({'title': this.title, 'content': this.content});
  }

  getPost(postId) {
    this.postDoc = this.afs.doc('posts/' + postId);
    this.post = this.postDoc.valueChanges();
  }

  deletePost(postId) {
    this.afs.doc('posts/' + postId).delete();
  }
  // tutorial code ends here

  // title = 'basketball';
}
