import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {
  enteredContent = '';
  enteredTitle = '';
  @Output()
  postCreated = new EventEmitter();
  // newPost = 'NO CONTENT FOR NOW';
  /*
  onAddPost(postInput: HTMLTextAreaElement) {
    // alert('Post added!');
    // console.log(postInput);
    this.newPost = postInput.value;
  }
  */
  onAddPost() {
    // this.newPost = this.enteredContent;
    const post = {
      title: this.enteredTitle,
      content: this.enteredContent
    };
    this.postCreated.emit(post);
  }
}
