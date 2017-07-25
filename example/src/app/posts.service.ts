import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/first';
import 'rxjs/add/operator/toPromise';

export interface Post {
    url: string;
    title: string;
    content: string;
}

@Injectable()
export class PostsService {
    constructor(private _http: Http) { }

    posts(): Promise<Post[]> {
        return this._http.get("/posts").first().toPromise().then(res => {
            return <Post[]>res.json();
        })
    }

    post(url: string): Promise<Post> {
        return this._http.get("/post/" + url).first().toPromise().then(res => {
            if (res.status !== 200) {
                return Promise.reject<Post>("Post not found");
            }
            return <Post>res.json();
        })
    }

    // This request always fails (the error callback is called). A HTTP status
    // that is not 2xx does not mean the request has failed. A request fails, in
    // this context, when, for instance, the server couldn't be reached.
    failRequest(): void {
        console.log("FAIL Request: sending...");
        this._http.get("/fail").subscribe(
            ok => console.log("FAIL Request: response:", ok),
            err => console.error("FAIL Request: error:", err),
            () => console.log("FAIL Request: complete.")
        );
    }

    // This request succeeds and returns "OK". The onComplete callback is also
    // listened to.
    okRequest(): void {
        console.log("OK Request: sending...");
        this._http.get("/ok").subscribe(
            ok => console.log("OK Request: response:", ok),
            err => console.error("OK Request: error:", err),
            () => console.log("OK Request: complete.")
        );
    }
}
