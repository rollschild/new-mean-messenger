import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from './post.model';

@Injectable({ providedIn: 'root' })
// only create one instance of the service
// ...for the entire app
export class PostsService {
  private posts: Post[] = [];

  // we should listen to this subject
  private postsUpdated = new Subject<Post[]>();

  getPosts() {
    return [...this.posts]; // creating a new array
  }

  getPostsUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = {
      title: title,
      content: content
    };
    this.posts.push(post);
    this.postsUpdated.next([...this.posts]);
  }
}

// EventEmitter should be used in conjunction
// ...with @Output
