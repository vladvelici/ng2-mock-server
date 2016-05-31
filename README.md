ng2-mock-server
===============

An angular2 mock XHRBackend to ease front-end development when no real back-end is available.

- No need to run a back-end on the dev machine.
- Easy to show off a front-end from static servers like GitHub Pages, etc.
- Easy to implement back-end functionality that runs in the browser. When the back-end is ready, just remove it and it's using the back-end with no changes in your application code.

Getting started
---------------

    npm install ng2-mock-server [--save | --save-dev]

In your `bootstrap.ts` or `main.ts` file:

    import {Http} from '@angular/http';
    import {MOCK_SERVER_PROVIDERS, MockSrvRouter, res} from 'ng2-mock-server/http';

    bootstrap([
        // your normal providers
        Http,
        MOCK_SERVER_PROVIDERS,
    ], AppComponent).then(app => {
        let router = <MockSrvRouter> app.injector.get(MockSrvRouter);

        // Define and implement the routes.
        router.setup(r => {
            r.get("/hello", (req : Request, ...params : string) {
               return res(200, "world");
            });

            r.get("/hello/:name", (req : Request, name : string) {
                return res(200, name);
            });
        });
    });

Note, you can also define the setup function somewhere else and just pass it to `router.setup()` to keep the main (or bootstrap) file short and clean. See the [example/main.ts](example/main.ts) and [example/setupMockRouter.ts](example/setupMockRouter.ts) files.

Development and running the example project
-------------------------------------------

For development and running the example project, clone this repo, make the desired changes and:

    # 1. link the module:
    npm link ng2-mock-server

    # 2. run the example with
    npm start


Changelog
---------

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
