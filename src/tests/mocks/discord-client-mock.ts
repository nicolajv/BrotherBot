import * as EventEmitter from 'events';

import {
  ApplicationCommandOptionType,
  CacheType,
  ChannelType,
  ChatInputCommandInteraction,
  Collection,
  CommandInteractionOption,
  CommandInteractionOptionResolver,
  Interaction,
  InteractionResponse,
  Message,
  Presence,
  TextChannel,
} from 'discord.js';

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
      content: message,
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
    command: string,
    options?: { user?: { id: string } | null; chatInput?: string },
  ): jest.SpyInstance<Promise<InteractionResponse>> {
    const mockInteraction = {
      isChatInputCommand: (): this is ChatInputCommandInteraction<CacheType> => {
        return options?.chatInput ? false : true;
      },
      reply: function (_message: string): void {
        return;
      },
      user: options?.user !== undefined ? options.user : { id: 'me' },
      guild: { ownerId: 'me' },
      commandName: command,
      options: {
        data: new Array<CommandInteractionOption<CacheType>>({
          name: 'lol',
          type: ApplicationCommandOptionType.String,
          value: 'lol',
        }),
      },
    } as unknown as Interaction<CacheType>;

    let spy = {} as jest.SpyInstance<Promise<InteractionResponse>>;
    if (mockInteraction.isChatInputCommand()) {
      spy = jest.spyOn(mockInteraction, 'reply').mockImplementation(() => {
        return new Promise<InteractionResponse>(resolve => {
          resolve({} as InteractionResponse);
        });
      });
    }
    this.emit('interactionCreate', mockInteraction);
    return spy;
  }
}
