import { App } from '../app';
import { app } from '../server';

jest.mock('../app');
jest.mock('../services/discord-service');
jest.spyOn(App.prototype, 'start');
jest.spyOn(App.prototype, 'stop');

describe('Server', () => {
  it('can start server', async () => {
    app.start();
    expect(App.prototype.start).toHaveBeenCalledTimes(1);
    app.stop();
    expect(App.prototype.stop).toHaveBeenCalledTimes(1);
  });
});
