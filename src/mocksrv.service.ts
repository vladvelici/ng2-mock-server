import {Connection, ConnectionBackend} from 'angular2/src/http/interfaces';
import {ReadyState, ResponseOptions, Request, Response} from 'angular2/http';
import {Observable, Observer, ReplaySubject} from 'rxjs/Rx';
import {Injectable} from 'angular2/core';
import {MockSrvRouter} from './router.service';

export class MockSrvConnection implements Connection {
    public readyState : ReadyState;
    public response : ReplaySubject<any> = new ReplaySubject(1);

    constructor(public request : Request,
        private _baseResponseOptions : ResponseOptions,
        private _router : MockSrvRouter) {

        this._router.serve(request).then((res : ResponseOptions) => {
            res = this._baseResponseOptions.merge(res);
            this.response.next(new Response(res));
        });
    }
}

/**
 * MockSrvBackend is an XHRBackend for angular2 that simulates a server. It's
 * purpose is enabling the implementation of front-ends when a back-end is not
 * (yet) available. 
 */
@Injectable()
export class MockSrvBackend implements ConnectionBackend {
    constructor(private _baseResponseOptions: ResponseOptions, private _router : MockSrvRouter) {
    };

    createConnection(request: Request): MockSrvConnection {
        return new MockSrvConnection(request, this._baseResponseOptions, this._router);
    }
}
