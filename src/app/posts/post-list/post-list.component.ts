import { Component, Input } from '@angular/core';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent {
  /*
  posts = [
    { title: 'First Post', content: 'First post content.' },
    { title: 'Second Post', content: 'Second post content.' }
  ];
  */
  @Input()
  posts: Post[] = []; // only from the direct parent
  // postsService: PostsService;

  constructor(public postsService: PostsService) {
    // this.postsService = postsService;
  }
}
