import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Post } from './post.model';

@Injectable({ providedIn: 'root' })
// only create one instance of the service
// ...for the entire app
export class PostsService {
  private posts: Post[] = [];

  // we should listen to this subject
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  getPosts() {
    // creating a new array
    // return [...this.posts];

    this.http
      .get<{ message: string; posts: Post[] }>(
        'http://localhost:3000/api/posts'
      )
      .subscribe(postData => {
        this.posts = postData.posts;
        this.postsUpdated.next([...this.posts]);
      });
    // Angular's httpclient uses observables
  }

  getPostsUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = {
      id: null,
      title: title,
      content: content
    };
    this.http
      .post<{ message: string }>('http://localhost:3000/api/posts', post)
      .subscribe(responseData => {
        console.log(responseData);
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      }); // asynchronous
    /*
    this.posts.push(post);
    this.postsUpdated.next([...this.posts]);
    */
  }
}

// EventEmitter should be used in conjunction
// ...with @Output
