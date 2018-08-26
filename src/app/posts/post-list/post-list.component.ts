import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  /*
  posts = [
    { title: 'First Post', content: 'First post content.' },
    { title: 'Second Post', content: 'Second post content.' }
  ];
  */
  // @Input() // only from the direct parent
  posts: Post[] = [];
  private postsSubscription: Subscription;
  // postsService: PostsService;

  constructor(public postsService: PostsService) {
    // this.postsService = postsService;
  }

  // automatically run by Angular when
  // ...this component is created
  ngOnInit() {
    // basic initialization tasks
    this.postsService.getPosts();
    this.postsSubscription = this.postsService
      .getPostsUpdateListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
      });
    // we need to make sure when this component is
    // ...not part of the DOM,
    // ...this subscription is also NOT living
    // ...anymore
  }

  ngOnDestroy() {
    this.postsSubscription.unsubscribe();
  }
}
