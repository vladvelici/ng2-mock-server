import {provide} from '@angular/core';
import {XHRBackend} from '@angular/http';

import {MockSrvRouter} from './src/router.service';
import {MockSrvBackend} from './src/mocksrv.service';

export {MockSrvRouter, MockSrvBackend};

export const MOCK_SERVER_PROVIDERS : any[] = [
    MockSrvRouter,
    provide(XHRBackend, {useClass: MockSrvBackend}),
];

export * from './src/helpers';
