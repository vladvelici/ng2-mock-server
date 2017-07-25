import { RouteInitializer } from './route-initializer';
import { MockSrvBackend } from './mocksrv.service';
import { MockSrvRouter } from './router.service';
import { NgModule } from '@angular/core';
import { XHRBackend, HttpModule, ResponseOptions } from '@angular/http';

@NgModule({
  imports: [
    HttpModule
  ],
  providers: [
    RouteInitializer,
    MockSrvRouter,
    {
      provide: XHRBackend,
      useClass: MockSrvBackend,
      deps: [ResponseOptions, MockSrvRouter]
    }
  ]
})
export class MockServerModule {
}
