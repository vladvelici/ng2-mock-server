import { MockSrvBackend } from './mocksrv.service';
import { MockSrvRouter } from './router.service';
import { NgModule, ModuleWithProviders, Injector, ReflectiveInjector } from '@angular/core';
import { XHRBackend } from '@angular/http';

@NgModule()
export class MockServerModule {

  static bootstrap(bootstrapFunc: (r: MockSrvRouter) => void): ModuleWithProviders {
    return {
      ngModule: MockServerModule,
      providers: [
        {
          provide: MockSrvRouter, useFactory: () => {
            const router = new MockSrvRouter();
            bootstrapFunc(router);
            return router;
          }
        },
        { provide: XHRBackend, useClass: MockSrvBackend }
      ]
    };

  }
}
