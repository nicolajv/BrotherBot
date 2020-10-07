import { App } from '../app';
import { app } from '../server';

jest.mock('../app');
jest.mock('../services/discord-service');
jest.spyOn(App.prototype, 'start');
jest.spyOn(App.prototype, 'stop');

const oneTime = 1;
const tk = 1;

describe('Server', () => {
  it('can start server', async () => {
    await new Promise(function (resolve) {
      setTimeout(resolve, tk);
    });
    app.start();
    expect(App.prototype.start).toHaveBeenCalledTimes(oneTime);
    app.stop();
    expect(App.prototype.stop).toHaveBeenCalledTimes(oneTime);
  });
});
