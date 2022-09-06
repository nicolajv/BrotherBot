import { Client, MessageReaction, User, VoiceState } from 'discord.js';
import {
  makeDatabaseService,
  makeLoggingService,
} from '../../dependency-injection/dependency-factory';

import { Command } from '../../commands/interfaces/command.interface';
import { DiscordClientMock } from '../mocks/discord-client-mock';
import { DiscordService } from '../../services/discord-service';
import { JestHelper } from '../mocks/jest-helper';
import { MockCommand } from '../mocks/mock-command';
import { MongoDBService } from '../../services/mongo-db-service';

const jestHelper = new JestHelper();

const testString = 'test';

jest.mock('../../helpers/build-commands', () => {
  return {
    buildCommands(): Array<Command> {
      const commands = Array<Command>();
      commands.push(new MockCommand('h'));
      commands.push(new MockCommand('a', true, true));
      return commands;
    },
  };
});

describe('Constructor', () => {
  it('Can initialize with default client', async () => {
    new DiscordService(makeLoggingService(), makeDatabaseService());
  });
});

/*
describe('Login', () => {
  const discordClientMock = new DiscordClientMock();
  const discordService = new DiscordService(
    makeLoggingService(),
    makeDatabaseService(),
    discordClientMock as unknown as Client,
  );

  it('Can login to discord', async () => {
    const loginSpy = discordService.login(testString);
    expect(loginSpy).resolves.not.toThrowError();
  });

  it('Throws error if token is unset', async () => {
    process.env.DISCORD_TOKEN = undefined;
    expect(discordService.login()).rejects.toThrowError();
  });

  it('Uses token if passed', async () => {
    process.env.DISCORD_TOKEN = undefined;
    const loginSpy = discordService.login(testString);
    expect(loginSpy).resolves.not.toThrowError();
  });
});

describe('Ready event', () => {
  const loggingService = makeLoggingService();
  const discordClientMock = new DiscordClientMock();
  const discordService = new DiscordService(
    loggingService,
    makeDatabaseService(),
    discordClientMock as unknown as Client,
  );

  it('Writes to console if logged in successfully', async () => {
    const loggingSpy = jest.spyOn(loggingService, 'log');
    discordService.login(testString);
    expect(loggingSpy).toHaveBeenCalledTimes(1);
  });

  it('Can init users', async () => {
    discordClientMock.addGuildMember({
      user: { id: 1, username: 'TestGuy1' },
      voice: { channel: { id: 1 } },
    });
    discordClientMock.addGuildMember({
      user: { id: 2, username: 'TestGuy2' },
    });
    const initUsersSpy = jestHelper.mockPrivateFunction(DiscordService.prototype, 'initUsers');
    const loginSpy = discordService.login(testString);
    expect(loginSpy).resolves.not.toThrowError();
    expect(initUsersSpy).toHaveBeenCalledTimes(1);
  });

  it('Throws error if init users finds no servers', async () => {
    const initUsersSpy = jestHelper.mockPrivateFunction(DiscordService.prototype, 'initUsers');
    jest.spyOn(discordService.client, 'login').mockReturnValueOnce(Promise.resolve(testString));
    discordClientMock.emptyGuild();
    discordClientMock.emit('ready');
    expect(initUsersSpy).toHaveBeenCalledTimes(1);
    expect(initUsersSpy.mock.results[0].value).rejects.toThrowError();
  });

  it('Throws error if client user is null', async () => {
    discordService.client.user = null;
    try {
      discordClientMock.emit('ready');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      return;
    }
    fail('An error should have happened');
  });
});

describe('Set activity', () => {
  const loggingService = makeLoggingService();
  const discordClientMock = new DiscordClientMock();
  const discordService = new DiscordService(
    loggingService,
    makeDatabaseService(),
    discordClientMock as unknown as Client,
  );

  it('Can set activity', async () => {
    const setActivitySpy = jest.spyOn(discordService, 'setActivity');
    const loginSpy = discordService.login(testString);
    expect(loginSpy).resolves.not.toThrowError();
    expect(setActivitySpy).toHaveBeenCalledTimes(1);
  });

  it('Can not set activity if no users exist', async () => {
    discordService.client.user = null;
    const setActivitySpy = discordService.setActivity();
    expect(setActivitySpy).rejects.toThrowError();
  });
});

describe('Discord Service voice event', () => {
  const discordClientMock = new DiscordClientMock();
  let discordService: DiscordService;

  beforeEach(async () => {
    discordService = new DiscordService(
      makeLoggingService(),
      makeDatabaseService(),
      discordClientMock as unknown as Client,
    );
  });

  it('Sends messages when starting and ending calls', async () => {
    let sendMessageInMainChannelSpy = jestHelper.mockPrivateFunction(
      DiscordService.prototype,
      'sendMessageInMainChannel',
    );
    startCall(discordService);
    expect(sendMessageInMainChannelSpy).toHaveBeenCalledTimes(1);
    sendMessageInMainChannelSpy = jestHelper.mockPrivateFunction(
      DiscordService.prototype,
      'sendMessageInMainChannel',
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
    expect(sendMessageInMainChannelSpy).toHaveBeenCalledTimes(2);
    expect(sendMessageInMainChannelSpy.mock.results[0].value).toContain(userNickname);
  });

  it('Does not send a message if the call is already started when a user joins', async () => {
    const sendMessageInMainChannelSpy = jestHelper.mockPrivateFunction(
      DiscordService.prototype,
      'sendMessageInMainChannel',
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
    );
    startCall(discordService, 'user1');
    expect(sendMessageInMainChannelSpy).toHaveBeenCalledTimes(1);
    startCall(discordService, 'user2');
    expect(sendMessageInMainChannelSpy).toHaveBeenCalledTimes(1);
    endCall(discordService, 'user1');
    expect(sendMessageInMainChannelSpy).toHaveBeenCalledTimes(1);
  });

  it('Throws error if user has no username on voice event start', async () => {
    jestHelper.mockPrivateFunction(DiscordService.prototype, 'handleVoiceEvent');
    try {
      startCall(discordService, undefined, undefined, null);
    } catch (err) {
      expect((err as Error).message).toMatch('User does not have a username');
      return;
    }
    fail('An error should have happened');
  });

  it('Throws error if user has no username on call start', async () => {
    try {
      discordService['handleUsersStartingCalls']({} as VoiceState, {} as VoiceState, {
        userId: '',
        userName: '',
      });
    } catch (err) {
      expect((err as Error).message).toMatch('User does not have a username');
      return;
    }
    fail('An error should have happened');
  });
});

describe('Discord Service commands', () => {
  const discordClientMock = new DiscordClientMock();
  new DiscordService(
    makeLoggingService(),
    makeDatabaseService(),
    discordClientMock as unknown as Client,
  );

  it('Handles successful commands', async () => {
    const messageSpy = discordClientMock.sendMessage('!h');
    expect(await messageSpy).toHaveBeenCalledTimes(2);
  });

  it('Does not accept commands from bots', async () => {
    const messageSpy = discordClientMock.sendMessage('!h', { bot: true });
    expect(await messageSpy).toHaveBeenCalledTimes(0);
  });

  it('Handles successful admin-only commands', async () => {
    const messageSpy = discordClientMock.sendMessage('!a');
    expect(await messageSpy).toHaveBeenCalledTimes(2);
  });

  it('Handles failed admin-only commands', async () => {
    const messageSpy = discordClientMock.sendMessage('!a', { member: { id: 'notAdmin' } });
    expect(await messageSpy).toHaveBeenCalledTimes(0);
  });

  it('Handles commands with no member', async () => {
    const messageSpy = discordClientMock.sendMessage('!h', { member: null });
    expect(await messageSpy).toHaveBeenCalledTimes(1);
  });

  it('Handles emotes in messages', async () => {
    const incrementFieldFindByFilterSpy = jestHelper.mockPrivateFunction(
      MongoDBService.prototype,
      'incrementFieldFindByFilter',
      () => {
        return;
      },
    );
    const messageSpy = discordClientMock.sendMessage('<:abc:123>');
    expect(await messageSpy).toHaveBeenCalledTimes(0);
    expect(incrementFieldFindByFilterSpy).toHaveBeenCalledTimes(1);
  });

  it('Does not add emotes from messages if they do not exist', async () => {
    const incrementFieldFindByFilterSpy = jestHelper.mockPrivateFunction(
      MongoDBService.prototype,
      'incrementFieldFindByFilter',
      () => {
        return;
      },
    );
    const messageSpy = discordClientMock.sendMessage('<:cba:321>');
    expect(await messageSpy).toHaveBeenCalledTimes(0);
    expect(incrementFieldFindByFilterSpy).toHaveBeenCalledTimes(0);
  });
});

describe('Discord Service reactions', () => {
  const discordClientMock = new DiscordClientMock();
  new DiscordService(
    makeLoggingService(),
    makeDatabaseService(),
    discordClientMock as unknown as Client,
  );

  it('Handles added emotes in reactions', async () => {
    const incrementFieldFindByFilterSpy = jestHelper.mockPrivateFunction(
      MongoDBService.prototype,
      'incrementFieldFindByFilter',
      () => {
        return;
      },
    );
    const mockReaction = {
      emoji: { identifier: '<:abc:123>' },
    } as MessageReaction;

    discordClientMock.emit('messageReactionAdd', mockReaction, {} as User);
    expect(incrementFieldFindByFilterSpy).toHaveBeenCalledTimes(1);
  });

  it('Handles removed emotes in reactions', async () => {
    const updateEmoteInDatabaseSpy = jestHelper.mockPrivateFunction(
      DiscordService.prototype,
      'updateEmoteInDatabase',
    );
    const incrementFieldFindByFilterSpy = jestHelper.mockPrivateFunction(
      MongoDBService.prototype,
      'incrementFieldFindByFilter',
      () => {
        return;
      },
    );
    const mockReaction = {
      emoji: { identifier: '<:abc:123>' },
    } as MessageReaction;
    jestHelper.mockPrivateFunction(DiscordService.prototype, 'checkIfEmojiExists', () => {
      return true;
    });

    discordClientMock.emit('messageReactionRemove', mockReaction, {} as User);
    expect(updateEmoteInDatabaseSpy).toHaveBeenCalledWith(
      `<:${mockReaction.emoji.identifier}>`,
      false,
    );
    expect(updateEmoteInDatabaseSpy).toHaveBeenCalledTimes(1);
    expect(incrementFieldFindByFilterSpy).toHaveBeenCalledTimes(1);
  });

  it('Does not add emotes from reactions if they do not exist', async () => {
    const incrementFieldFindByFilterSpy = jestHelper.mockPrivateFunction(
      MongoDBService.prototype,
      'incrementFieldFindByFilter',
      () => {
        return;
      },
    );
    const mockReaction = {
      emoji: { identifier: '<:cba:321>' },
    } as MessageReaction;

    discordClientMock.emit('messageReactionAdd', mockReaction, {} as User);
    expect(incrementFieldFindByFilterSpy).toHaveBeenCalledTimes(0);
  });
});

describe('Discord Service send message in main channel', () => {
  const discordClientMock = new DiscordClientMock();
  const discordService = new DiscordService(
    makeLoggingService(),
    makeDatabaseService(),
    discordClientMock as unknown as Client,
  );

  it('Throws an error if main channel cannot be found when trying to send a message init', async () => {
    try {
      discordService['mainChannel'] = jestHelper.setPropertyToAnything(undefined);
      jestHelper.mockPrivateFunction(DiscordService.prototype, 'setMainChannel', () => {
        return undefined;
      });
      await discordService['sendMessageInMainChannel'](testString);
    } catch (error) {
      expect((error as Error).message).toMatch('Unable to find main channel');
      return;
    }
    fail('An error should have happened');
  });
});

describe('Discord Service set main channel', () => {
  const discordClientMock = new DiscordClientMock();
  const discordService = new DiscordService(
    makeLoggingService(),
    makeDatabaseService(),
    discordClientMock as unknown as Client,
  );

  it('Can set main channel', async () => {
    const sendMessageInMainChannelSpy = jestHelper.mockPrivateFunction(
      DiscordService.prototype,
      'sendMessageInMainChannel',
    );
    startCall(discordService);
    expect(sendMessageInMainChannelSpy).toHaveBeenCalledTimes(1);
  });

  it('Throws an error if main channel cannot be found when trying to send a message', async () => {
    try {
      discordService['mainChannel'] = jestHelper.setPropertyToAnything(undefined);
      jestHelper.mockPrivateFunction(DiscordService.prototype, 'setMainChannel', () => {
        return undefined;
      });
      await discordService['sendMessageInMainChannel'](testString);
    } catch (error) {
      expect((error as Error).message).toMatch('Unable to find main channel');
      return;
    }
    fail('An error should have happened');
  });

  it('Throws an error if guild cannot be found when trying to set the main channel', async () => {
    try {
      discordClientMock.emptyGuild();
      await discordService['setMainChannel']();
    } catch (error) {
      expect((error as Error).message).toMatch('Unable to find main channel');
      return;
    }
    fail('An error should have happened');
  });

  it('Throws an error if guild cannot be found when trying to set the main channel', async () => {
    discordClientMock.addGuildChannel('TEST_TYPE');
    await discordService['setMainChannel']();
    expect(discordService['mainChannel']).toBeNull();
  });
});
*/

describe('Logout', () => {
  const discordClientMock = new DiscordClientMock();
  const discordService = new DiscordService(
    makeLoggingService(),
    makeDatabaseService(),
    discordClientMock as unknown as Client,
  );

  it('Can log out', async () => {
    discordService.logout();
  });
});

// Helper functions
function startCall(
  discordService: DiscordService,
  userId = 'userId',
  channelName: string | null = 'channelName',
  userName: string | null = 'userName',
  userNickname?: string,
): void {
  const channel = channelName ? { name: channelName, joinable: true } : undefined;
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
      channelId: 'channelId',
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
  const channel = channelName ? { name: 'channelName', joinable: true } : undefined;
  const name = userName ? { displayName: userName } : undefined;
  discordService.client.emit(
    'voiceStateUpdate',
    {
      id: userId,
      channelId: 'channelId',
      channel: channel,
    } as VoiceState,
    {
      id: userId,
      member: name,
    } as VoiceState,
  );
}
