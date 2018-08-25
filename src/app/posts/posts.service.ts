import { Injectable } from '@angular/core';
import { Post } from './post.model';

@Injectable({ providedIn: 'root' })
// only create one instance of the service
// ...for the entire app
export class PostsService {
  private posts: Post[] = [];

  getPosts() {
    return [...this.posts]; // creating a new array
  }

  addPost(title: string, content: string) {
    const post: Post = {
      title: title,
      content: content
    };
    this.posts.push(post);
  }
}
