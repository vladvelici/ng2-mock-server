import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';

export interface Post {
    url: string;
    title: string;
    content: string;
}

@Injectable()
export class PostsService {
    constructor(private _http : Http) {}

    posts() : Promise<Post[]> {
        return this._http.get("/posts").first().toPromise().then(res => {
            return <Post[]> res.json();
        })
    }

    post(url : string) : Promise<Post> {
        return this._http.get("/post/" + url).first().toPromise().then(res => {
            if (res.status !== 200) {
                return Promise.reject<Post>("Post not found");
            }
            return <Post> res.json();
        })
    }
}
