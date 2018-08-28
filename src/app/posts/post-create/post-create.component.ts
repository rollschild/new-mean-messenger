import { Component, EventEmitter, Output, OnInit } from '@angular/core';

import { Post } from '../post.model';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
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
  isLoading = false;
  form: FormGroup;

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, {
        validators: [Validators.required]
      })
    });
    // listen to changes in the route url
    // ...changes in params, precisely
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getSinglePost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content
          };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content
          });
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
  onSavePost(/* form: NgForm */) {
    if (this.form.invalid) {
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
    this.isLoading = true;
    // we do NOT need to set it back to false
    // because we will navigate away from this page and when we come back,
    // ...isLoading will automatically set to false
    if (this.mode === 'create') {
      this.postsService.addPost(this.form.value.title, this.form.value.content);
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content
      );
    }
    this.form.reset();
  }
}
