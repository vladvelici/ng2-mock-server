import { Http } from '@angular/http';
import { Component, Injectable } from '@angular/core';
import { MockSrvRouter } from 'ng-mock-server';

import { PostsService, Post } from './posts.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  posts: Post[] = [];
  selectedPost: Post = null;
  status = "uninitialised";

  constructor(private _posts: PostsService) {
    this.status = "Loading all posts";
    this._posts.posts().then(posts => {
      this.status = "All posts loaded";
      this.posts = posts;
    }).catch(err => this.status = err);
  }

  select(url: string) {
    // In this case I could just use the post passed to the function, but the point is to show the mock requests.
    // In reality, the list of posts might only return the title and not the whole content.

    this.selectedPost = null; // remove previous selection

    this.status = "Loading post " + url;
    this._posts.post(url).then(
      post => { this.selectedPost = post; this.status = "OK" },
      err => this.status = err
    );
  }

  failRequest() {
    this._posts.failRequest();
  }

  okRequest() {
    this._posts.okRequest();
  }
}