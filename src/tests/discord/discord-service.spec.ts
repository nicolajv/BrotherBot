import { Client, ClientUser } from 'discord.js';

import { DiscordService } from '../../services/discord-service';
import { LoggingService } from '../../services/logging-service';
import { NoDiscordTokenSetException } from '../../errors/no-discord-token-set-exception';
import { NoDiscordUserFoundException } from '../../errors/no-discord-user-found-exception';

const discord = new DiscordService();
const oneTime = 1;

describe('Discord Service login', () => {
  it('Can login to discord', async () => {
    jest.spyOn(Client.prototype, 'login').mockReturnValueOnce(Promise.resolve('test'));
    const promise = discord.login();
    await expect(promise).resolves.not.toThrow();
    expect(promise).resolves.toBeTruthy();
  });

  it('Throws error if token is unset', async () => {
    process.env.DISCORD_TOKEN = undefined;
    await expect(discord.login()).rejects.toThrowError(new NoDiscordTokenSetException());
  });

  it('Uses token if passed', async () => {
    process.env.DISCORD_TOKEN = undefined;
    jest.spyOn(Client.prototype, 'login').mockReturnValueOnce(Promise.resolve('test'));
    const promise = discord.login('test');
    await expect(promise).resolves.not.toThrow();
    expect(promise).resolves.toBeTruthy();
  });
});

describe('Discord Service ready event', () => {
  it('Writes to console if logged in successfully', async () => {
    jest.spyOn(Client.prototype, 'login').mockReturnValueOnce(Promise.resolve('test'));
    jest.spyOn(LoggingService.prototype, 'log');
    discord.client.user = ClientUser.prototype;
    await discord.client.emit('ready');
    expect(LoggingService.prototype.log).toHaveBeenCalledTimes(oneTime);
  });

  it('Throws error if client user is null', async () => {
    discord.client.user = null;
    try {
      await discord.client.emit('ready');
    } catch (error) {
      expect(error).toMatchObject(new NoDiscordUserFoundException());
    }
  });
});

afterAll(async done => {
  await discord.logout();
  done();
});
