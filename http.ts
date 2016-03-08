import {provide} from 'angular2/core';
import {XHRBackend} from 'angular2/http';

import {MockSrvRouter} from './src/router.service';
import {MockSrvBackend} from './src/mocksrv.service';

export {MockSrvRouter, MockSrvBackend};

export const MOCK_SERVER_PROVIDERS : any[] = [
    MockSrvRouter,
    provide(XHRBackend, {useClass: MockSrvBackend}),
];

export * from './src/helpers';
