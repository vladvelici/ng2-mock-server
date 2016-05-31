import {HTTP_PROVIDERS, Http} from '@angular/http';
import {Component, Injectable, provide} from '@angular/core';
import {MOCK_SERVER_PROVIDERS, MockSrvRouter} from 'ng2-mock-server/http';
import {bootstrap} from '@angular/platform-browser-dynamic';

// This is where you implement the mock back-end logic:
import {setupMockRouter} from './setupMockRouter';
import {PostsService, Post} from './posts.service';

@Component({
    selector: 'app',
    template: `
        <div> STATUS: {{ status }} </div>

        <ul>
            <li *ngFor="let post of posts"><a (click)="select(post.url)" href="#">{{ post.title }}</a></li>
        </ul>

        <a (click)="select('this-post-does-not-exist')" href="#">404 example</a>

        <h5>Open the dev console to see the request lifecycle of these two:</h5>
        <a (click)="failRequest()" href="#">fail request</a>
        <a (click)="okRequest()" href="#">ok request</a>

        <div *ngIf="selectedPost">
            <h1>{{ selectedPost.title }}</h1>
            <p>{{ selectedPost.content }}</p>
        </div>
    `,
    providers: [PostsService],
})
class AppComponent {
    posts : Post[] = [];
    selectedPost : Post = null;
    status = "uninitialised";

    constructor(private _posts : PostsService) {
        this.status = "Loading all posts";
        this._posts.posts().then(posts => {
            this.status = "All posts loaded";
            this.posts = posts;
        }).catch(err => this.status = err);
    }

    select(url : string) {
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

// Bootstrapping our application using the Mock Server
bootstrap(AppComponent, [
    PostsService,
    HTTP_PROVIDERS,
    MOCK_SERVER_PROVIDERS, // Mock providers, it provides a mock XHRService. Always goes AFTER HTTP_PROVIDERS.
]).then(app => {
    // Setup the mock server router after app is loaded
    let router = <MockSrvRouter> app.injector.get(MockSrvRouter);
    router.setup(setupMockRouter);
});
