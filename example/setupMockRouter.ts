import {MockSrvRouter, json, res} from 'ng2-mock-server/http';
import {ResponseOptions} from '@angular/http';

var posts = [
    {url: "hello", title: "Hello", content: "hello world, this is post hello!"},
    {url: "lorem", title: "Lorem ipsum", content: "lorem ipsum post"},
    {url: "ng2-mock-server", title: "Angular2 Mock Server", content: "ng2-mock-server is great!"},
];

export function setupMockRouter(r : MockSrvRouter) {
    r.get("/posts", (req : any, ...params : string[]) : Promise<ResponseOptions> => {
        return json(200, posts);
    })

    r.get("/post/:url", (req : any, url : string) : Promise<ResponseOptions> => {
        let post : any = posts.find(p => p.url === url);
        if (!post) {
            return json(404, {});
        }
        return json(200, post);
    });

    // Fail this request.
    r.get("/fail", (req : any) : Promise<ResponseOptions> => {
        return Promise.reject<ResponseOptions>("this request failed.");
    });

    // Send OK.
    r.get("/ok", (req : any) : Promise<ResponseOptions> => {
        return res(200, "OK", 0);
    });
}
