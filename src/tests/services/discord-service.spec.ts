import {
  ClientUser,
  Collection,
  Guild,
  Message,
  Presence,
  TextChannel,
  VoiceState,
} from 'discord.js';

import { DiscordService } from '../../services/discord-service';
import { JestHelper } from '../mocks/jest-helper';
import { errors } from '../../data/constants';
import {
  makeDatabaseService,
  makeLoggingService,
} from '../../dependency-injection/dependency-factory';

const loggingService: LoggingService = makeLoggingService();
const databaseService: DatabaseService = makeDatabaseService();

const jestHelper = new JestHelper();

const testString = 'test';

jest.mock('../../helpers/build-commands', () => {
  return {
    buildCommands(): Array<Command> {
      const commands = Array<Command>();
      commands.push({
        name: 'h',
        execute: () => {
          return new Promise<string>(resolve => {
            resolve('test');
          });
        },
      } as Command);
      return commands;
    },
  };
});

describe('Discord Service login', () => {
  const discordService = new DiscordService(loggingService, databaseService);

  afterAll(async resolve => {
    discordService.logout();
    resolve();
  });

  it('Can login to discord', async () => {
    jest.spyOn(discordService.client, 'login').mockReturnValueOnce(Promise.resolve(testString));
    const promise = discordService.login();
    await expect(promise).resolves.not.toThrowError();
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
  });
});

describe('Discord Service ready event', () => {
  let discordService: DiscordService;

  afterAll(async resolve => {
    discordService.logout();
    resolve();
  });

  it('Writes to console if logged in successfully', async () => {
    discordService = new DiscordService(loggingService, databaseService);
    discordService.client.guilds.cache = jestHelper.setPropertyToAnything({
      first() {
        return {
          members: {
            cache: [
              { user: { id: 1, username: 'user1' } },
              { user: { id: 2, username: 'user2' }, voice: { channel: { id: testString } } },
            ],
          },
        };
      },
    });
    jest.spyOn(loggingService, 'log');
    discordService.client.user = {
      setActivity(): Promise<Presence> {
        return new Promise<Presence>(resolve => {
          resolve({} as Presence);
        });
      },
    } as ClientUser;
    discordService.client.emit('ready');
    expect(loggingService.log).toHaveBeenCalledTimes(1);
  });

  it('Can init users', async () => {
    discordService = new DiscordService(loggingService, databaseService);
    const initUsersSpy = jestHelper.mockPrivateFunction(DiscordService.prototype, 'initUsers');
    discordService.client.guilds.cache = jestHelper.setPropertyToAnything({
      first() {
        return {
          members: {
            cache: [
              { user: { id: 1, username: 'user1' } },
              { user: { id: 2, username: 'user2' }, voice: { channel: { id: testString } } },
            ],
          },
        };
      },
    });
    jest.spyOn(loggingService, 'log');
    discordService.client.user = {
      setActivity(): Promise<Presence> {
        return new Promise<Presence>(resolve => {
          resolve({} as Presence);
        });
      },
    } as ClientUser;
    discordService.client.emit('ready');
    expect(initUsersSpy).toHaveBeenCalledTimes(1);
    expect(initUsersSpy.mock.results[0].value).resolves.not.toThrowError();
    expect(discordService['users'].length).toEqual(2);
  });

  it('Throws error if init users finds no servers', async () => {
    discordService = new DiscordService(loggingService, databaseService);
    const initUsersSpy = jestHelper.mockPrivateFunction(DiscordService.prototype, 'initUsers');
    discordService.client.guilds.cache = jestHelper.setPropertyToAnything({
      first() {
        return { members: { cache: [{ user: { id: 1, username: 'test' } }] } };
      },
    });
    jest.spyOn(loggingService, 'log');
    discordService.client.user = {
      setActivity(): Promise<Presence> {
        return new Promise<Presence>(resolve => {
          resolve({} as Presence);
        });
      },
    } as ClientUser;
    jest.spyOn(discordService.client, 'login').mockReturnValueOnce(Promise.resolve(testString));
    discordService.client.guilds.cache = new Collection<string, Guild>();
    discordService.client.emit('ready');
    expect(initUsersSpy).toHaveBeenCalledTimes(1);
    expect(initUsersSpy.mock.results[0].value).rejects.toThrowError();
  });

  it('Throws error if client user is null', async () => {
    discordService = new DiscordService(loggingService, databaseService);
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
  const discordService = new DiscordService(loggingService, databaseService);

  afterAll(async resolve => {
    discordService.logout();
    resolve();
  });

  it('Handles successful commands', async () => {
    jestHelper.mockPrivateFunction(TextChannel.prototype, 'send', (message: string) => {
      return message;
    });
    const mockChannel = new TextChannel(new Guild(discordService.client, {}), {});
    const mockMessage = {
      channel: mockChannel,
      toString: () => {
        return '!h';
      },
      author: {
        bot: false,
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
      author: {
        bot: false,
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

  it('Does not react to bots', async () => {
    const mockChannel = new TextChannel(new Guild(discordService.client, {}), {});
    const mockMessage = {
      channel: mockChannel,
      toString: () => {
        return '!h';
      },
      author: {
        bot: true,
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
  let discordService: DiscordService;

  beforeEach(async resolve => {
    discordService = new DiscordService(loggingService, databaseService);
    resolve();
  });

  afterEach(async resolve => {
    discordService.logout();
    resolve();
  });

  it('Sends messages when starting and ending calls', async () => {
    let sendMessageInMainChannelSpy = jestHelper.mockPrivateFunction(
      DiscordService.prototype,
      'sendMessageInMainChannel',
      (message: string) => {
        return message;
      },
    );
    startCall(discordService);
    expect(sendMessageInMainChannelSpy).toHaveBeenCalledTimes(1);
    sendMessageInMainChannelSpy = jestHelper.mockPrivateFunction(
      DiscordService.prototype,
      'sendMessageInMainChannel',
      (message: string) => {
        return message;
      },
    );
    endCall(discordService);
    expect(sendMessageInMainChannelSpy).toHaveBeenCalledTimes(2);
  });

  it('Uses user nickname when available', async () => {
    const sendMessageInMainChannelSpy = jestHelper.mockPrivateFunction(
      DiscordService.prototype,
      'sendMessageInMainChannel',
      (message: string) => {
        return message;
      },
    );
    const userNickname = 'usernickname';
    startCall(discordService, undefined, undefined, undefined, userNickname);
    expect(sendMessageInMainChannelSpy).toHaveBeenCalledTimes(1);
    expect(sendMessageInMainChannelSpy.mock.results[0].value).toContain(userNickname);
  });

  it('Sends messages even if no channel name is available', async () => {
    let sendMessageInMainChannelSpy = jestHelper.mockPrivateFunction(
      DiscordService.prototype,
      'sendMessageInMainChannel',
      (message: string) => {
        return message;
      },
    );
    startCall(discordService, undefined, null);
    expect(sendMessageInMainChannelSpy).toHaveBeenCalledTimes(1);
    sendMessageInMainChannelSpy = jestHelper.mockPrivateFunction(
      DiscordService.prototype,
      'sendMessageInMainChannel',
      (message: string) => {
        return message;
      },
    );
    endCall(discordService, undefined, null);
    expect(sendMessageInMainChannelSpy).toHaveBeenCalledTimes(2);
  });

  it('Does not send a message if the call is already started when a user joins', async () => {
    const sendMessageInMainChannelSpy = jestHelper.mockPrivateFunction(
      DiscordService.prototype,
      'sendMessageInMainChannel',
      (message: string) => {
        return message;
      },
    );
    startCall(discordService, 'user1');
    expect(sendMessageInMainChannelSpy).toHaveBeenCalledTimes(1);
    startCall(discordService, 'user2');
    expect(sendMessageInMainChannelSpy).toHaveBeenCalledTimes(1);
  });

  it('Does not send a message if one or more users remain when a user leaves', async () => {
    const sendMessageInMainChannelSpy = jestHelper.mockPrivateFunction(
      DiscordService.prototype,
      'sendMessageInMainChannel',
      (message: string) => {
        return message;
      },
    );
    startCall(discordService, 'user1');
    expect(sendMessageInMainChannelSpy).toHaveBeenCalledTimes(1);
    startCall(discordService, 'user2');
    expect(sendMessageInMainChannelSpy).toHaveBeenCalledTimes(1);
    endCall(discordService, 'user1');
    expect(sendMessageInMainChannelSpy).toHaveBeenCalledTimes(1);
  });

  it('Throws error if user has no username', async () => {
    jestHelper.mockPrivateFunction(DiscordService.prototype, 'handleVoiceEvent');
    try {
      startCall(discordService, undefined, undefined, null);
    } catch (err) {
      expect(err.message).toMatch(errors.noUsername);
      return;
    }
    fail('An error should have happened');
  });
});

describe('Discord Service send message in main channel', () => {
  const discordService = new DiscordService(loggingService, databaseService);

  afterAll(async resolve => {
    discordService.logout();
    resolve();
  });

  it('Can send a message in main channel', async () => {
    const sendMessageInMainChannelSpy = jestHelper.mockPrivateFunction(
      DiscordService.prototype,
      'sendMessageInMainChannel',
      (message: string) => {
        return message;
      },
    );
    discordService['mainChannel'] = {} as TextChannel;
    discordService.client.emit(
      'voiceStateUpdate',
      {} as VoiceState,
      {
        member: { displayName: testString },
        channelID: '123',
      } as VoiceState,
    );
    expect(sendMessageInMainChannelSpy).toHaveBeenCalledTimes(1);
  });
});

describe('Discord Service set main channel', () => {
  const discordService = new DiscordService(loggingService, databaseService);

  afterAll(async resolve => {
    discordService.logout();
    resolve();
  });

  it('Can set main channel', async () => {
    const setMainChannelSpy = jestHelper.mockPrivateFunction(
      DiscordService.prototype,
      'setMainChannel',
    );
    discordService['mainChannel'] = null;
    const channelCache = Array<Record<string, unknown>>();
    const voiceChannel = { type: 'voice' };
    const textChannel = {
      type: 'text',
      send: (): void => {
        return;
      },
    };
    channelCache.push(voiceChannel);
    channelCache.push(textChannel);
    discordService.client.guilds.cache = jestHelper.setPropertyToAnything({
      first() {
        return { channels: { cache: channelCache } };
      },
    });
    discordService.client.emit(
      'voiceStateUpdate',
      {} as VoiceState,
      { member: { displayName: testString }, channelID: '123' } as VoiceState,
    );
    expect(discordService['mainChannel']).toEqual(textChannel);
    expect(setMainChannelSpy).toHaveBeenCalledTimes(1);
  });
});

describe('Discord Service set activity', () => {
  const discordService = new DiscordService(loggingService, databaseService);

  afterAll(async resolve => {
    discordService.logout();
    resolve();
  });

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

//Helper functions
function startCall(
  discordService: DiscordService,
  userId = 'userId',
  channelName: string | null = 'channelName',
  userName: string | null = 'userName',
  userNickname?: string,
): void {
  const channel = channelName ? { name: channelName } : undefined;
  const memberData =
    userName || userNickname
      ? {
          displayName: userName ? userName : undefined,
          nickname: userNickname ? userNickname : undefined,
        }
      : undefined;
  discordService.client.emit(
    'voiceStateUpdate',
    {
      id: userId,
      member: memberData,
    } as VoiceState,
    {
      id: userId,
      member: memberData,
      channelID: 'channelID',
      channel: channel,
    } as VoiceState,
  );
}

function endCall(
  discordService: DiscordService,
  userId = 'userId',
  channelName: string | null = 'channelName',
  userName: string | null = 'userName',
): void {
  const channel = channelName ? { name: channelName } : undefined;
  const name = userName ? { displayName: userName } : undefined;
  discordService.client.emit(
    'voiceStateUpdate',
    {
      id: userId,
      channelID: 'channelID',
      channel: channel,
    } as VoiceState,
    {
      id: userId,
      member: name,
    } as VoiceState,
  );
}
