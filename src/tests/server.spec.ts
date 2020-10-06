import { App } from '../app';
import { app } from '../server';
jest.mock('../discord/discord-service');

describe('Server', () => {
  it('can start server', () => {
    jest.spyOn(App.prototype, 'close');
    app.close();
  });
});
