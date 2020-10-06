import { App } from '../app';
import { app } from '../server';
jest.mock('../services/discord-service');

describe('Server', () => {
  it('can start server', () => {
    jest.spyOn(App.prototype, 'close');
    app.close();
  });
});
