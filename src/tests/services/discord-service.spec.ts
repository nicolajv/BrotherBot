import {
  ClientUser,
  Collection,
  Guild,
  Message,
  Presence,
  TextChannel,
  VoiceState,
} from 'discord.js';

import { CallState } from '../../helpers/calls-state';
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
    const initUsersSpy = jest
      /* eslint-disable */
      .spyOn(DiscordService.prototype as any, 'initUsers')
      .mockImplementationOnce(() => {
        return new Promise<void>(resolve => {
          resolve();
        });
      });
    const promise = discordService.login();
    await expect(promise).resolves.not.toThrowError();
    expect(promise).resolves.toBeTruthy();
    expect(initUsersSpy).toHaveBeenCalledTimes(1);
  });

  it('Can init users', async () => {
    jest.spyOn(discordService.client, 'login').mockReturnValueOnce(Promise.resolve(testString));
    const initUsersSpy = jest
      /* eslint-disable */
      .spyOn(DiscordService.prototype as any, 'initUsers');
    discordService.client.guilds.cache = {
      first() {
        return { members: { cache: [{ user: { id: 1, username: 'test' } }] } };
      },
    } as any;
    const promise = discordService.login();
    await expect(promise).resolves.not.toThrowError();
    expect(promise).resolves.toBeTruthy();
    expect(initUsersSpy).toHaveBeenCalledTimes(1);
  });

  it('Throws error if init users finds no servers', async () => {
    jest.spyOn(discordService.client, 'login').mockReturnValueOnce(Promise.resolve(testString));
    const initUsersSpy = jest
      /* eslint-disable */
      .spyOn(DiscordService.prototype as any, 'initUsers');
    discordService.client.guilds.cache = new Collection<string, Guild>();
    const promise = discordService.login();
    await expect(promise).rejects.toThrowError();
    expect(initUsersSpy).toHaveBeenCalledTimes(1);
  });

  it('Throws error if token is unset', async () => {
    process.env.DISCORD_TOKEN = undefined;
    await expect(discordService.login()).rejects.toThrowError();
  });

  it('Uses token if passed', async () => {
    process.env.DISCORD_TOKEN = undefined;
    jest.spyOn(discordService.client, 'login').mockReturnValueOnce(Promise.resolve(testString));
    /* eslint-disable */
    const initUsersSpy = jest
      .spyOn(DiscordService.prototype as any, 'initUsers')
      .mockImplementationOnce(() => {
        return new Promise<void>(resolve => {
          resolve();
        });
      });
    const promise = discordService.login(testString);
    await expect(promise).resolves.not.toThrowError();
    expect(promise).resolves.toBeTruthy();
    expect(initUsersSpy).toHaveBeenCalledTimes(1);
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

describe('Discord Service voice event', () => {
  it('Can start and end calls', async () => {
    /* eslint-disable */
    const addUserToCallSpy = jest.spyOn(CallState.prototype as any, 'addUserToCall');
    discordService.client.emit(
      'voiceStateUpdate',
      {} as VoiceState,
      { member: { displayName: 'lol' }, channelID: '123' } as VoiceState,
    );
    expect(addUserToCallSpy).toHaveBeenCalledTimes(1);
    /* eslint-disable */
    const removeUserFromCallSpy = jest.spyOn(CallState.prototype as any, 'removeUserFromCall');
    discordService.client.emit(
      'voiceStateUpdate',
      { member: { displayName: 'lol' }, channelID: '123' } as VoiceState,
      { member: { displayName: 'lol' }, channelID: '321' } as VoiceState,
    );
    expect(removeUserFromCallSpy).toHaveBeenCalledTimes(1);
  });

  it('Throws error if user has no username', async () => {
    /* eslint-disable */
    const handleVoiceEventSpy = jest.spyOn(DiscordService.prototype as any, 'handleVoiceEvent');
    try {
      discordService.client.emit('voiceStateUpdate', {} as VoiceState, {} as VoiceState);
    } catch (err) {
      expect(handleVoiceEventSpy).toThrowError();
      expect(handleVoiceEventSpy).toHaveBeenCalledTimes(1);
      return;
    }
    fail('An error should have happened');
  });
});

describe('Discord Service send message in main channel', () => {
  it('Can send message to main channel', async () => {
    /* eslint-disable */
    const addUserToCallSpy = jest.spyOn(CallState.prototype as any, 'addUserToCall');
    discordService['mainChannel'] = undefined;
    const channelCache = Array<{}>();
    channelCache.push({ type: 'voice' });
    channelCache.push({ type: 'text' });
    discordService.client.guilds.cache = {
      first() {
        return { channels: { cache: channelCache } };
      },
    } as any;
    discordService.client.emit(
      'voiceStateUpdate',
      {} as VoiceState,
      { member: { displayName: 'lol' }, channelID: '123' } as VoiceState,
    );
    expect(addUserToCallSpy).toHaveBeenCalledTimes(1);
  });

  it('Throws error if no main channel exists', async () => {
    /* eslint-disable */
    const handleVoiceEventSpy = jest.spyOn(DiscordService.prototype as any, 'handleVoiceEvent');
    discordService['mainChannel'] = undefined;
    /* eslint-disable */
    const setMainChannelSpy = jest
      .spyOn(DiscordService.prototype as any, 'setMainChannel')
      .mockImplementationOnce(() => {
        return;
      });
    discordService.client.emit(
      'voiceStateUpdate',
      {} as VoiceState,
      { member: { displayName: 'lol' }, channelID: '123' } as VoiceState,
    );
    expect(setMainChannelSpy).toHaveBeenCalledTimes(1);
    expect(handleVoiceEventSpy).toThrowError();
    expect(handleVoiceEventSpy).toHaveBeenCalledTimes(1);
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
