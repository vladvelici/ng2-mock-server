ng2-mock-server
===============

An angular2+ mock XHRBackend to ease front-end development when no real back-end is available.

- No need to run a back-end on the dev machine.
- Easy to show off a front-end from static servers like GitHub Pages, etc.
- Easy to implement back-end functionality that runs in the browser. When the back-end is ready, just remove it and it's using the back-end with no changes in your application code.
- Works with Angular 2 and Angular 4.

Getting started
---------------

    npm install ng2-mock-server [--save | --save-dev]

In your main module file (other mandatory parts like Component-declarations omitted):

    import { MockRouteInitializer } from './mock-route-initializer';
    import { NgModule } from '@angular/core';

    import { MockServerModule, RouteInitializer } from 'ng2-mock-server';
    import { HttpModule } from '@angular/http';

    @NgModule({
        imports: [
            HttpModule,
            MockServerModule
        ],
        providers: [
            { provide: RouteInitializer, useClass: MockRouteInitializer }
        ]
    })
    export class AppModule {
    }

[MockRouteInitializer](example/src/app/mock-route-initializer.ts) is where you define your mock-routes:

    import { RouteInitializer, MockSrvRouter, json, res } from 'ng2-mock-server';
    import { ResponseOptions } from '@angular/http';

    export class MockRouteInitializer implements RouteInitializer {

        initialize(r: MockSrvRouter): void {
            r.get("/hello", (req : Request, ...params : string) {
               return res(200, "world");
            });

            r.get("/hello/:name", (req : Request, name : string) {
                return res(200, name);
            });
        }
    }

Development and running the example project
-------------------------------------------

For development and running the example project, clone this repo, make the desired changes and:

    # 1. build and link the module:
    ./buildAndLink.sh

    # 2. use the linked module and start the example:
    cd example
    npm link ng2-mock-server
    npm start

You can also use [buildAndRunExample.sh](buildAndRunExample.sh) to do all those steps at once


Changelog
---------

#### 0.0.4

- ng2-mock-server now works with Angular 2 (Release Version) and 4
- This update is contributed by [Dominik Schlosser][dmn1k]. Thank you for the pull request!

#### 0.0.3

- Fixed #3, a bug where `onComplete` callbacks weren't called after a request.
- Make `router.setup(r => {...})` the default way of setting up the routes to eliminate the call to `r.ready()`. This is backwards-compatible so if you're not using `router.setup()` and call `router.ready()`, everything will work just fine.

#### 0.0.2

- Updated code to Angular2 RC 1.
- Thanks [Stephan Beal][sgbeal] for the code!

#### 0.0.1

Initial release.

Contributions
-------------

Please create issues with bug reports, feature requests or asking for help.

Pull requests more than welcome.

Licence
-------

Released under the MIT Licence.

[sgbeal]: https://github.com/sgbeal
[dmn1k]: https://github.com/dmn1k
