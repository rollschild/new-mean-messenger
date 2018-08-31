import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from './post.model';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
// only create one instance of the service
// ...for the entire app
export class PostsService {
  private posts: Post[] = [];

  // we should listen to this subject
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    // creating a new array
    // return [...this.posts];

    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;

    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        'http://localhost:3000/api/posts' + queryParams
      )
      .pipe(
        map(postData => {
          return {
            posts: postData.posts.map(post => {
              return {
                id: post._id,
                title: post.title,
                content: post.content,
                imagePath: post.imagePath
              };
            }),

            maxPosts: postData.maxPosts
          };
        })
      ) // add operators here
      .subscribe(transformedPostsData => {
        this.posts = transformedPostsData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostsData.maxPosts
        });
      });
    // Angular's httpclient uses observables
  }

  getPostsUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    /*
    const post: Post = {
      id: null,
      title: title,
      content: content
    };
    */
    // FormData: combine text and blobs
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    console.log(image);
    postData.append('image', image, title);
    this.http
      .post<{ message: string; post: Post }>(
        'http://localhost:3000/api/posts',
        postData
      )
      .subscribe(responseData => {
        /*
        const post: Post = {
          id: responseData.post.id,
          title: title,
          content: content,
          imagePath: responseData.post.imagePath
        };
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        */

        // we redirect to list page
        // ...where ngInit runs and automatically fetches new posts
        this.router.navigate(['/']);
      }); // asynchronous
  }

  deletePost(postId: string) {
    // Here we definitely need to re-fetch
    return this.http.delete('http://localhost:3000/api/posts/' + postId);
    /*
      .subscribe(() => {
        console.log('Post deleted!');
        this.posts = this.posts.filter(post => post.id !== postId);
        this.postsUpdated.next([...this.posts]);
      })
      */
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    /*
    const post: Post = {
      id: id,
      title: title,
      content: content,
      imagePath: null
    };
    */
    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image
      };
    }
    this.http
      .put('http://localhost:3000/api/posts/' + id, postData)
      .subscribe(response => {
        // the following updates posts locally
        /*
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        const post: Post = {
          id: id,
          title: title,
          content: content,
          // imagePath: response.imagePath
          imagePath: ''
        };
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        // console.log(this.posts);
        // console.log(updatedPosts);
        this.postsUpdated.next([...this.posts]);
        */
        this.router.navigate(['/']);
      });
  }

  getSinglePost(id: string) {
    // return { ...this.posts.find(p => p.id === id) };
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
    }>('http://localhost:3000/api/posts/' + id);
  }
}

// EventEmitter should be used in conjunction
// ...with @Output
