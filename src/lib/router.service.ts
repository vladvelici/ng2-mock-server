import { RouteInitializer } from './route-initializer';
import { ReadyState, ResponseOptions, Request, Headers, RequestMethod } from '@angular/http';
import { Injectable, Inject } from '@angular/core';
import { pathtoRegexp } from './path-to-regexp';

export type RouteCallback = (req: Request, ...params: string[]) => Promise<ResponseOptions>;

class Route {
    static clearQueryString(url: string): string {
        const qsindex = url.indexOf('?');
        if (qsindex >= 0) {
            url = url.split('?')[0];
        }
        return url;
    }

    constructor(public method: RequestMethod, public regex: RegExp, public callback: RouteCallback) { }

    /** Test if the route matches the request. */
    matches(req: Request): boolean {
        if (this.method !== req.method) {
            return false;
        }
        const routingUrl = Route.clearQueryString(req.url);
        return this.regex.test(routingUrl);
    }

    /** Run the route callback on the request. Make sure matches(req) == true!! */
    serve(req: Request): Promise<ResponseOptions> {
        const args = <string[]>this.regex.exec(Route.clearQueryString(req.url));
        args.splice(0, 1);
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

    private _routes: Route[] = [];

    constructor(private initializer: RouteInitializer) {
        initializer.initialize(this);
    }

    serve(req: Request): Promise<ResponseOptions> {
        let i: number;
        for (i = 0; i < this._routes.length; i++) {
            if (this._routes[i].matches(req)) {
                const res = Promise.resolve(this._routes[i].serve(req));
                console.log('HTTP REQUEST: ', req, res);
                return res;
            }
        }

        console.error('HTTP REQUEST NOT IMPLEMENTED', req);

        return Promise.resolve(new ResponseOptions({
            status: 404,
        }));
    }

    addRoute(method: RequestMethod, path: string | RegExp, callback: RouteCallback) {
        const expr: RegExp = <RegExp>pathtoRegexp(path, [], {});
        this._routes.push(new Route(method, expr, callback));
    }

    put(path: string | RegExp, callback: RouteCallback) {
        this.addRoute(RequestMethod.Put, path, callback);
    }

    post(path: string | RegExp, callback: RouteCallback) {
        this.addRoute(RequestMethod.Post, path, callback);
    }

    get(path: string | RegExp, callback: RouteCallback) {
        this.addRoute(RequestMethod.Get, path, callback);
    }

    delete(path: string | RegExp, callback: RouteCallback) {
        this.addRoute(RequestMethod.Delete, path, callback);
    }

    options(path: string | RegExp, callback: RouteCallback) {
        this.addRoute(RequestMethod.Options, path, callback);
    }

    patch(path: string | RegExp, callback: RouteCallback) {
        this.addRoute(RequestMethod.Patch, path, callback);
    }

    head(path: string | RegExp, callback: RouteCallback) {
        this.addRoute(RequestMethod.Head, path, callback);
    }

}
