import { Component, EventEmitter, Output } from '@angular/core';

import { Post } from '../post.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {
  enteredContent = '';
  enteredTitle = '';

  @Output()
  postCreated = new EventEmitter<Post>();

  // newPost = 'NO CONTENT FOR NOW';
  /*
  onAddPost(postInput: HTMLTextAreaElement) {
    // alert('Post added!');
    // console.log(postInput);
    this.newPost = postInput.value;
  }
  */
  onAddPost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    // this.newPost = this.enteredContent;
    const post: Post = {
      // title: this.enteredTitle,
      title: form.value.title, // that we defined in html
      // content: this.enteredContent,
      content: form.value.content
    };
    this.postCreated.emit(post);
  }
}
