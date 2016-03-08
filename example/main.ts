import {HTTP_PROVIDERS, Http} from 'angular2/http';
import {Component, Injectable, provide} from 'angular2/core';
import {MOCK_SERVER_PROVIDERS, MockSrvRouter} from 'ng2-mock-server/http';
import {bootstrap} from 'angular2/platform/browser';

// This is where you implement the mock back-end logic:
import {setupMockRouter} from './setupMockRouter';
import {PostsService, Post} from './posts.service';

@Component({
    selector: 'app',
    template: `
        <div> STATUS: {{ status }} </div>

        <ul>
            <li *ngFor="#post of posts"><a (click)="select(post.url)" href="#">{{ post.title }}</a></li>
        </ul>

        <a (click)="select('this-post-does-not-exist')" href="#">404 example</a>

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
}

// Bootstrapping our application using the Mock Server
bootstrap(AppComponent, [
    PostsService,
    HTTP_PROVIDERS,
    MOCK_SERVER_PROVIDERS, // Mock providers, it provides a mock XHRService. Always goes AFTER HTTP_PROVIDERS.
]).then(app => {
    // Setup the mock server router after app is loaded
    let router = <MockSrvRouter> app.injector.get(MockSrvRouter);
    setupMockRouter(router);
});
