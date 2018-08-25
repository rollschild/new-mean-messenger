import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent {
  /*
  posts = [
    { title: 'First Post', content: 'First post content.' },
    { title: 'Second Post', content: 'Second post content.' }
  ];
  */
  @Input()
  posts = []; // only from the direct parent
}