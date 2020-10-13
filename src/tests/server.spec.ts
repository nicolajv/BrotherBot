import { app } from '../infrastructure/server';

jest.mock('../infrastructure/app');
jest.mock('../services/discord-service');
jest.spyOn(app, 'start');
jest.spyOn(app, 'stop');

describe('Server', () => {
  it('can start server', async () => {
    app.start();
    expect(app.start).toHaveBeenCalledTimes(1);
    app.stop();
    expect(app.stop).toHaveBeenCalledTimes(1);
  });
});
