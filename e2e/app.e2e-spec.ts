import { NgMockServerPage } from './app.po';

describe('ng-mock-server App', () => {
  let page: NgMockServerPage;

  beforeEach(() => {
    page = new NgMockServerPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
