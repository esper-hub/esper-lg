import { EsperLgPage } from './app.po';

describe('esper-lg App', function() {
  let page: EsperLgPage;

  beforeEach(() => {
    page = new EsperLgPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
