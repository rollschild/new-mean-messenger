import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { PageEvent } from '@angular/material';
import { post } from 'selenium-webdriver/http';

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
  totalPosts = 0;
  postsPerPage = 6;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 6, 10];
  isLoading = false;
  private postsSubscription: Subscription;
  // postsService: PostsService;

  constructor(public postsService: PostsService) {
    // this.postsService = postsService;
  }

  // automatically run by Angular when
  // ...this component is created
  ngOnInit() {
    this.isLoading = true;
    // basic initialization tasks
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.postsSubscription = this.postsService
      .getPostsUpdateListener()
      .subscribe((postData: { posts: Post[]; postCount: number }) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
      });
    // we need to make sure when this component is
    // ...not part of the DOM,
    // ...this subscription is also NOT living
    // ...anymore
  }

  onChangedPage(pageData: PageEvent) {
    // console.log(pageData);
    // pageIndex starts from 0
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  ngOnDestroy() {
    this.postsSubscription.unsubscribe();
  }
}
