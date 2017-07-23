import { RouteInitializer } from './route-initializer';
import { MockSrvBackend } from './mocksrv.service';
import { MockSrvRouter } from './router.service';
import { NgModule } from '@angular/core';
import { XHRBackend } from '@angular/http';

@NgModule({
  providers: [
     RouteInitializer,
     MockSrvRouter,
     { provide: XHRBackend, useClass: MockSrvBackend }
  ]
})
export class MockServerModule {
}
