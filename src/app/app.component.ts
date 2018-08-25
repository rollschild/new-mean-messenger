import { Component } from '@angular/core';

import { Post } from './posts/post.model';

@Component({
  selector: 'app-root', // our own html tag
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // title = 'new-mean-messenger';
  storedPosts: Post[] = [];
  onPostAdded(post) {
    this.storedPosts.push(post);
  }
}
