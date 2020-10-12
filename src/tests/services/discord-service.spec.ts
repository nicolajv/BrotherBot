import { Client, ClientUser } from 'discord.js';

import { DiscordService } from '../../services/discord-service';
import { LoggingService } from '../../services/logging-service';

const discordService = new DiscordService();

describe('Discord Service login', () => {
  it('Can login to discord', async () => {
    jest.spyOn(Client.prototype, 'login').mockReturnValueOnce(Promise.resolve('test'));
    const promise = discordService.login();
    await expect(promise).resolves.not.toThrowError();
    expect(promise).resolves.toBeTruthy();
  });

  it('Throws error if token is unset', async () => {
    process.env.DISCORD_TOKEN = undefined;
    await expect(discordService.login()).rejects.toThrowError();
  });

  it('Uses token if passed', async () => {
    process.env.DISCORD_TOKEN = undefined;
    jest.spyOn(Client.prototype, 'login').mockReturnValueOnce(Promise.resolve('test'));
    const promise = discordService.login('test');
    await expect(promise).resolves.not.toThrowError();
    expect(promise).resolves.toBeTruthy();
  });
});

describe('Discord Service ready event', () => {
  it('Writes to console if logged in successfully', async () => {
    jest.spyOn(Client.prototype, 'login').mockReturnValueOnce(Promise.resolve('test'));
    jest.spyOn(LoggingService.prototype, 'log');
    discordService.client.user = ClientUser.prototype;
    discordService.client.emit('ready');
    expect(LoggingService.prototype.log).toHaveBeenCalledTimes(1);
  });

  it('Throws error if client user is null', async () => {
    discordService.client.user = null;
    try {
      discordService.client.emit('ready');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      return;
    }
    fail('An error should have happened');
  });
});

describe('Discord Service set activity', () => {
  it('Throws error if client user is null', async () => {
    discordService.client.user = null;
    jest.spyOn(discordService, 'setActivity');
    expect(discordService.setActivity()).rejects.toThrowError();
  });
});

afterAll(async done => {
  discordService.logout();
  done();
});
