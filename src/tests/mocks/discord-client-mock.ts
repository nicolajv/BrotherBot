import * as EventEmitter from 'events';

import { ChannelType, Collection, Message, Presence, TextChannel } from 'discord.js';

interface Member {
  user: { id: number; username: string };
  voice?: { channel: { id: number } };
}

export class DiscordClientMock {
  private eventEmitter = new EventEmitter();

  public user = {
    setActivity: (): Promise<Presence> => {
      return new Promise<Presence>(resolve => {
        resolve({} as Presence);
      });
    },
  };
  public emojis = {
    cache: new Collection<string, { identifier: string }>().set('Emoji', {
      identifier: '<:abc:123>',
    }),
  };
  public guilds = {
    cache: new Collection<
      string,
      {
        members: { cache: Collection<string, Member> };
        channels: { cache: Collection<string, { type: number; send(): void }> };
      }
    >().set('TestGuild', {
      members: {
        cache: new Collection<string, Member>(),
      },
      channels: {
        cache: new Collection<string, { type: number; send(): void }>().set('MainChannel', {
          type: ChannelType.GuildText,
          send: function (): void {
            return;
          },
        }),
      },
    }),
  };

  public login(_token?: string | undefined): Promise<string> {
    return new Promise(resolves => {
      this.eventEmitter.emit('ready');
      resolves('test');
    });
  }

  public emit(event: string, ...args: Array<unknown>): void {
    this.eventEmitter.emit(event, ...args);
  }

  public on(event: string, callback: (...args: Array<unknown>) => void): void {
    this.eventEmitter.on(event, callback);
  }

  public destroy(): void {
    return;
  }

  // Helper functions
  public addGuildMember(member: Member): void {
    this.guilds.cache.first()?.members.cache.set(`${member.user.username}`, member);
  }

  public addGuildChannel(type: number): void {
    this.guilds.cache = this.guilds.cache.set('TestGuild', {
      members: {
        cache: new Collection<string, Member>(),
      },
      channels: {
        cache: new Collection<string, { type: number; send(): void }>().set('MainChannel', {
          type: type,
          send: function (): void {
            return;
          },
        }),
      },
    });
  }

  public emptyGuild(): void {
    this.guilds.cache.clear();
  }

  public sendMessage(
    message: string,
    options?: { bot?: boolean; member?: { id: string } | null },
  ): jest.SpyInstance<Promise<Message>> {
    const mockMessage = {
      channel: {
        send: function (): void {
          return;
        },
      } as unknown as TextChannel,
      member: options?.member !== undefined ? options.member : { id: 'me' },
      guild: { ownerId: 'me' },
      toString: () => {
        return message;
      },
      author: {
        bot: options?.bot ? options.bot : false,
      },
    } as Message;
    const spy = jest.spyOn(mockMessage.channel, 'send').mockImplementation(() => {
      return new Promise<Message<false>>(resolve => {
        resolve({} as Message<false>);
      });
    });
    this.emit('messageCreate', mockMessage);
    return spy;
  }

  public triggerCommand(
    message: string,
    options?: { bot?: boolean; member?: { id: string } | null },
  ): jest.SpyInstance<Promise<Message>> {
    const mockMessage = {
      channel: {
        send: function (): void {
          return;
        },
      } as unknown as TextChannel,
      member: options?.member !== undefined ? options.member : { id: 'me' },
      guild: { ownerId: 'me' },
      toString: () => {
        return message;
      },
      author: {
        bot: options?.bot ? options.bot : false,
      },
    } as Message;
    const spy = jest.spyOn(mockMessage.channel, 'send').mockImplementation(() => {
      return new Promise<Message<false>>(resolve => {
        resolve({} as Message<false>);
      });
    });
    this.emit('interactionCreate', mockMessage);
    return spy;
  }
}
