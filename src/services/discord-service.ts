import { Client, Message, TextChannel } from 'discord.js';
import { commandPrefix, emotesTable } from '../data/constants';

import { CallState } from '../helpers/calls-state';
import { User } from '../models/user';
import { buildCommands } from '../helpers/build-commands';
import { translations } from '../data/translator';

const defaultActivity = '!h for help';

export class DiscordService implements ChatService {
  private loggingService: LoggingService;
  private databaseService: DatabaseService;
  public client: Client;
  private commands: Array<Command> = Array<Command>();

  private mainChannel: TextChannel | null = null;
  private users = Array<User>();

  private callState = new CallState();

  constructor(loggingService: LoggingService, databaseService: DatabaseService) {
    this.client = new Client();
    this.loggingService = loggingService;
    this.databaseService = databaseService;
    this.initCommands();
    this.initEvents();
    this.handleCommands();
    this.databaseService.initialSetup();
  }

  async login(token = process.env.DISCORD_TOKEN): Promise<void> {
    if (token === 'undefined') {
      throw new Error('No Discord token set');
    }
    await this.client.login();
  }

  logout(): void {
    this.client.destroy();
  }

  async setActivity(): Promise<void> {
    if (!this.client.user) {
      throw new Error('No Discord user found');
    }
    this.client.user.setActivity({ name: defaultActivity });
  }

  private findOrAddUser(userId: string, userName: string): User {
    let user = this.users.find(user => {
      return user.userId === userId;
    });
    if (!user) {
      user = new User(userId, userName);
      this.users.push(user);
    }
    return user;
  }

  private initCommands(): void {
    this.commands = buildCommands();
  }

  private initEvents(): void {
    this.handleReadyEvent();
    this.handleVoiceEvent();
  }

  private initUsers(): Promise<void> {
    return new Promise<void>(resolve => {
      const guild = this.client.guilds.cache.first();
      if (!guild) {
        throw new Error(translations.noServerConnected);
      }
      guild.members.cache.forEach(member => {
        const user = new User(member.user.id, member.user.username);
        this.users.push(user);
        if (member.voice && member.voice.channel) {
          this.callState.addUserToCall(member.voice.channel.id, user);
        }
      });
      resolve();
    });
  }

  private handleCommands(): void {
    this.client.on('message', message => {
      if (!message.author.bot) {
        const channel = message.channel;
        const content = message.toString().toLowerCase();
        this.commands.forEach(async command => {
          if (content.startsWith(`${commandPrefix}${command.name}`)) {
            const parameter = content.substr(content.indexOf(' ') + 1);
            await channel.send(await command.execute(parameter));
          }
        });
        const emotes = content.match(/<:[a-zA-Z]+:[0-9]+>/g);
        if (emotes) {
          emotes.forEach(async (match: string) => {
            if (this.client.emojis.cache.find(emoji => match.includes(emoji.identifier))) {
              this.databaseService.incrementFieldFindByFilter(emotesTable, 'name', match, 'amount');
            }
          });
        }
      }
    });
  }

  private handleReadyEvent(): void {
    this.client.on('ready', () => {
      if (!this.client.user) {
        throw new Error('No Discord user found');
      }
      this.loggingService.log(`Logged in as ${this.client.user.tag}!`);
      this.initUsers();
      this.setActivity();
    });
  }

  private handleVoiceEvent(): void {
    this.client.on('voiceStateUpdate', (oldstate, newstate) => {
      if (!newstate.member?.displayName) {
        throw new Error('User does not have a username');
      }
      const user = this.findOrAddUser(newstate.id, newstate.member.displayName);
      if (oldstate.channelID && oldstate.channelID !== newstate.channelID) {
        const removalResult = this.callState.removeUserFromCall(oldstate.channelID, user);
        if (removalResult.userCount === 0) {
          this.sendMessageInMainChannel(
            `${translations.callEnded} ${oldstate.channel?.name}. ${translations.callEndedDuration} ${removalResult.duration}`,
          );
        }
      }
      if (newstate.channelID && oldstate.channelID !== newstate.channelID) {
        const userCountAfterAddition = this.callState.addUserToCall(newstate.channelID, user);
        if (userCountAfterAddition === 1) {
          const starterUserName = newstate.member.nickname
            ? newstate.member.nickname
            : newstate.member.displayName;
          this.sendMessageInMainChannel(
            `${starterUserName} ${translations.callStarted} ${newstate.channel?.name}!`,
          );
        }
      }
    });
  }

  private async sendMessageInMainChannel(message: string): Promise<Message> {
    return new Promise<Message>(resolve => {
      if (!this.mainChannel) {
        this.setMainChannel();
      }
      if (!this.mainChannel) {
        throw new Error('Unable to find main channel');
      }
      resolve(this.mainChannel.send(message));
    });
  }

  private setMainChannel(): Promise<void> {
    return new Promise<void>(resolve => {
      const guild = this.client.guilds.cache.first();
      if (!guild) {
        throw new Error('Unable to find main channel');
      }
      const channel = guild.channels.cache.find(channel => {
        return channel.type === 'text';
      }) as TextChannel;
      this.mainChannel = channel ? channel : null;
      resolve();
    });
  }
}
