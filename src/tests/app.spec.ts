import { makeApp, makeChatService } from '../dependency-injection/dependency-factory';

jest.mock('../services/discord-service');

describe('App', () => {
  it('can start the application', async () => {
    const chatService = makeChatService();
    const app = makeApp(chatService);
    await app.start();
    expect(chatService.login).toHaveBeenCalledTimes(1);
    jest.spyOn(app, 'stop');
    app.stop();
    expect(app.stop).toHaveBeenCalledTimes(1);
  });

  it('can not close the application before starting', async () => {
    const app = makeApp();
    jest.spyOn(app, 'stop');
    try {
      app.stop();
    } catch (error) {
      expect(app.stop).toThrowError();
    }
  });
});

afterAll(async done => {
  done();
});
