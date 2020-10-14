import { ClientUser, Guild, Message, Presence, TextChannel } from 'discord.js';

import { DiscordService } from '../../services/discord-service';
import { makeLoggingService } from '../../dependency-injection/dependency-factory';

const loggingService: LoggingService = makeLoggingService();
const discordService = new DiscordService(loggingService);

const testString = 'test';

jest.mock('../../helpers/build-commands', () => {
  return {
    buildCommands(): Array<Command> {
      const commands = Array<Command>();
      commands.push({
        name: 'h',
        execute: () => {
          return new Promise<string>(resolve => {
            resolve('lol');
          });
        },
      } as Command);
      return commands;
    },
  };
});

describe('Discord Service login', () => {
  it('Can login to discord', async () => {
    jest.spyOn(discordService.client, 'login').mockReturnValueOnce(Promise.resolve(testString));
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
    jest.spyOn(discordService.client, 'login').mockReturnValueOnce(Promise.resolve(testString));
    const promise = discordService.login(testString);
    await expect(promise).resolves.not.toThrowError();
    expect(promise).resolves.toBeTruthy();
  });
});

describe('Discord Service ready event', () => {
  it('Writes to console if logged in successfully', async () => {
    jest.spyOn(loggingService, 'log');
    discordService.client.user = {
      setActivity(): Promise<Presence> {
        return new Promise<Presence>(resolve => {
          resolve({} as Presence);
        });
      },
    } as ClientUser;
    jest.spyOn(discordService.client, 'login').mockReturnValueOnce(Promise.resolve(testString));
    discordService.client.emit('ready');
    expect(loggingService.log).toHaveBeenCalledTimes(1);
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

describe('Discord Service commands', () => {
  it('Handles successful commands', async () => {
    const mockChannel = new TextChannel(new Guild(discordService.client, {}), {});
    const mockMessage = {
      channel: mockChannel,
      toString: () => {
        return '!h';
      },
    } as Message;
    jest.spyOn(mockMessage.channel, 'send').mockImplementation(() => {
      return new Promise<Message[]>(resolve => {
        resolve(new Array<Message>());
      });
    });
    discordService.client.emit('message', mockMessage);
    expect(await mockMessage.channel.send).toHaveBeenCalledTimes(1);
  });

  it('Handles non-existent commands', async () => {
    const mockChannel = new TextChannel(new Guild(discordService.client, {}), {});
    const mockMessage = {
      channel: mockChannel,
      toString: () => {
        return '!m';
      },
    } as Message;
    jest.spyOn(mockMessage.channel, 'send').mockImplementation(() => {
      return new Promise<Message[]>(resolve => {
        resolve(new Array<Message>());
      });
    });
    discordService.client.emit('message', mockMessage);
    expect(await mockMessage.channel.send).toHaveBeenCalledTimes(0);
  });
});

describe('Discord Service set activity', () => {
  it('Can complete successfully', async () => {
    jest.spyOn(discordService, 'setActivity').mockResolvedValueOnce();
    const setActivity = discordService.setActivity();
    await expect(setActivity).resolves.not.toThrowError();
  });

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
