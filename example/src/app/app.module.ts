import { PostsService } from './posts.service';
import { MockRouteInitializer } from './mock-route-initializer';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MockServerModule, MockSrvRouter, json, MockSrvBackend, RouteInitializer } from 'ng-mock-server';
import { HttpModule, ResponseOptions, RequestMethod, XHRBackend, RequestOptions, Http, ConnectionBackend } from '@angular/http';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    MockServerModule
  ],
  providers: [
    { provide: RouteInitializer, useClass: MockRouteInitializer },
    PostsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
