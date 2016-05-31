import {ReadyState, ResponseOptions, Request, Headers, RequestMethod} from '@angular/http';
import {Injectable, Inject} from '@angular/core';
import {pathtoRegexp} from './path-to-regexp';

export type RouteCallback = (req : Request, ...params : string[]) => Promise<ResponseOptions>;

class Route {
    constructor(public method : RequestMethod, public regex : RegExp, public callback : RouteCallback) {}

    static clearQueryString(url : string) : string {
        let qsindex = url.indexOf("?");
        if (qsindex >= 0) {
            url = url.split("?")[0];
        }
        return url;
    }

    /** Test if the route matches the request. */
    matches(req : Request) : boolean {
        if (this.method !== req.method) {
            return false;
        }
        var routingUrl = Route.clearQueryString(req.url);
        return this.regex.test(routingUrl);
    }

    /** Run the route callback on the request. Make sure matches(req) == true!! */
    serve(req : Request) : Promise<ResponseOptions> {
        let args = <string[]> this.regex.exec(Route.clearQueryString(req.url));
        args.splice(0,1);
        return this.callback(req, ...args);
    }
}

/**
    Router that helps setup a mock back-end.

    Usage is pretty simple.

    Example:

      router.post("/posts/:title", (req : Request, title : string) : Promise<ResponseOptions> {
          // your route implementation
      });
*/
@Injectable()
export class MockSrvRouter {

    private _routes : Route[] = [];
    private _promise : Promise<void>;
    private _resolve : () => void;

    constructor() {
        this._promise = new Promise<void>((resolve, reject) => {
            this._resolve = resolve;
        });
    }

    /** Set the router as ready. */
    ready() {
        this._resolve();
    }

    /** Setup the router without explicitly calling ready(). */
    setup(callback : (router : MockSrvRouter) => void) {
        callback(this);
        this.ready();
    }

    serve(req : Request) : Promise<ResponseOptions> {
        return this._promise.then(() => {
            var i : number;
            for (i = 0; i < this._routes.length; i++) {
                if (this._routes[i].matches(req)) {
                    let res = this._routes[i].serve(req);
                    console.log("HTTP REQUEST: ", req, res);
                    return res;
                }
            }

            console.error("HTTP REQUEST NOT IMPLEMENTED", req);

            return Promise.resolve(new ResponseOptions({
                status: 404,
            }));
        });
    }

    addRoute(method : RequestMethod, path : string | RegExp, callback : RouteCallback) {
        let expr : RegExp = <RegExp> pathtoRegexp(path, [], {});
        this._routes.push(new Route(method, expr, callback));
    }

    put(path : string | RegExp, callback : RouteCallback) {
        this.addRoute(RequestMethod.Put, path, callback);
    }

    post(path : string | RegExp, callback : RouteCallback) {
        this.addRoute(RequestMethod.Post, path, callback);
    }

    get(path : string | RegExp, callback : RouteCallback) {
        this.addRoute(RequestMethod.Get, path, callback);
    }

    delete(path : string | RegExp, callback : RouteCallback) {
        this.addRoute(RequestMethod.Delete, path, callback);
    }

    options(path : string | RegExp, callback : RouteCallback) {
        this.addRoute(RequestMethod.Options, path, callback);
    }

    patch(path : string | RegExp, callback : RouteCallback) {
        this.addRoute(RequestMethod.Patch, path, callback);
    }

    head(path : string | RegExp, callback : RouteCallback) {
        this.addRoute(RequestMethod.Head, path, callback);
    }

}
