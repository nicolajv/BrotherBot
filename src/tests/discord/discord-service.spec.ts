import { DiscordService } from '../../discord/discord-service';
import { NoDiscordTokenSetException } from '../../errors/no-discord-token-set-exception';
import { NoDiscordUserFoundException } from '../../errors/no-discord-user-found-exception';

const discord = new DiscordService();

test('Can login to discord', async () => {
  await expect(discord.login()).resolves.not.toThrow();
});

test('Throws error if token is invalid', async () => {
  await expect(discord.login('qwerty')).rejects.toThrowError();
});

test('Throws error if client user is null', async () => {
  discord.client.user = null;
  try {
    await discord.client.emit('ready');
  } catch (error) {
    expect(error).toMatchObject(new NoDiscordUserFoundException());
  }
});

test('Throws error if token is unset', async () => {
  process.env.DISCORD_TOKEN = undefined;
  await expect(discord.login()).rejects.toThrowError(new NoDiscordTokenSetException());
});

afterAll(async done => {
  await discord.logout();
  done();
});
