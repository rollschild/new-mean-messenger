import { Component, EventEmitter, Output, OnInit } from '@angular/core';

import { Post } from '../post.model';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredContent = '';
  enteredTitle = '';
  private mode = 'create';
  private postId: string;
  private post: Post;

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    // listen to changes in the route url
    // ...changes in params, precisely
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.postsService.getSinglePost(this.postId).subscribe(postData => {
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content
          };
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  /*
  @Output()
  postCreated = new EventEmitter<Post>();
  */

  // newPost = 'NO CONTENT FOR NOW';
  /*
  onAddPost(postInput: HTMLTextAreaElement) {
    // alert('Post added!');
    // console.log(postInput);
    this.newPost = postInput.value;
  }
  */
  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    // this.newPost = this.enteredContent;
    /*
    const post: Post = {
      // title: this.enteredTitle,
      title: form.value.title, // that we defined in html
      // content: this.enteredContent,
      content: form.value.content
    };
    */
    if (this.mode === 'create') {
      this.postsService.addPost(form.value.title, form.value.content);
    } else {
      this.postsService.updatePost(
        this.postId,
        form.value.title,
        form.value.content
      );
    }
    form.resetForm();
  }
}
