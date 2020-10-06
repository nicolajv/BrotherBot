import { DiscordService } from '../discord/discord-service';
import { server } from '../app';
const oneTime = 1;

describe('App', () => {
  it('can start application', async () => {
    jest.spyOn(DiscordService.prototype, 'login').mockReturnValue(Promise.resolve('test'));
    await expect(server)
      .resolves.not.toThrow()
      .then(() => {
        expect(DiscordService.prototype.login).toHaveBeenCalledTimes(oneTime);
      });
  });
});

afterAll(async done => {
  done();
});
