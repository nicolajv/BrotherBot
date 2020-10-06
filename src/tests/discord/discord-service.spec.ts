import { Client, ClientUser } from 'discord.js';

import { DiscordService } from '../../discord/discord-service';
import { NoDiscordTokenSetException } from '../../errors/no-discord-token-set-exception';
import { NoDiscordUserFoundException } from '../../errors/no-discord-user-found-exception';

const discord = new DiscordService();
const oneTime = 1;

describe('Discord Service', () => {
  it('Can login to discord', async () => {
    jest.spyOn(Client.prototype, 'login').mockReturnValueOnce(Promise.resolve('test'));
    await expect(discord.login()).resolves.not.toThrow();
  });

  it('Throws error if client user is null', async () => {
    discord.client.user = null;
    try {
      await discord.client.emit('ready');
    } catch (error) {
      expect(error).toMatchObject(new NoDiscordUserFoundException());
    }
  });

  it('Writes to console if logged in successfully', async () => {
    jest.spyOn(Client.prototype, 'login').mockReturnValueOnce(Promise.resolve('test'));
    jest.spyOn(console, 'log');
    discord.client.user = ClientUser.prototype;
    await discord.client.emit('ready');
    expect(console.log).toHaveBeenCalledTimes(oneTime);
  });

  it('Throws error if token is unset', async () => {
    process.env.DISCORD_TOKEN = undefined;
    await expect(discord.login()).rejects.toThrowError(new NoDiscordTokenSetException());
  });
});

afterAll(async done => {
  await discord.logout();
  done();
});
