import { Client, Message, TextChannel } from 'discord.js';
import { commandPrefix, errors } from '../data/constants';

import { CallState } from '../helpers/calls-state';
import { User } from '../models/user';
import { buildCommands } from '../helpers/build-commands';

const defaultActivity = '!h for help';

export class DiscordService implements ChatService {
  private loggingService: LoggingService;
  public client: Client;
  private commands: Array<Command> = Array<Command>();

  private mainChannel: TextChannel | null = null;
  private users = Array<User>();

  private callState = new CallState();

  constructor(loggingService: LoggingService) {
    this.client = new Client();
    this.loggingService = loggingService;
    this.initCommands();
    this.initEvents();
    this.handleCommands();
  }

  async login(token = process.env.DISCORD_TOKEN): Promise<void> {
    if (token === 'undefined') {
      throw new Error('No Discord token set');
    }
    await this.client.login();
    await this.initUsers();
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
        throw new Error(errors.noServerConnected);
      }
      guild.members.cache.forEach(member => {
        this.users.push(new User(member.user.id, member.user.username));
      });
      console.log(this.users);
      resolve();
    });
  }

  private handleCommands(): void {
    this.client.on('message', message => {
      const channel = message.channel;
      const content = message.toString();
      this.commands.forEach(async command => {
        if (content.startsWith(`${commandPrefix}${command.name}`)) {
          const parameter = content.substr(content.indexOf(' ') + 1);
          await channel.send(await command.execute(parameter));
        }
      });
    });
  }

  private handleReadyEvent(): void {
    this.client.on('ready', () => {
      if (!this.client.user) {
        throw new Error('No Discord user found');
      }
      this.loggingService.log(`Logged in as ${this.client.user.tag}!`);
      this.setActivity();
    });
  }

  private handleVoiceEvent(): void {
    this.client.on('voiceStateUpdate', (oldstate, newstate) => {
      if (!newstate.member?.displayName) {
        throw new Error(errors.noUsername);
      }
      const user = this.findOrAddUser(newstate.id, newstate.member.displayName);
      if (oldstate.channelID && oldstate.channelID !== newstate.channelID) {
        const removalResult = this.callState.removeUserFromCall(oldstate.channelID, user);
        if (removalResult.userCount === 0) {
          this.sendMessageInMainChannel(
            `Call ended in ${oldstate.channel?.name}. Duration: ${removalResult.duration}`,
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
            `${starterUserName} started a call in ${newstate.channel?.name}!`,
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
        throw new Error(errors.noMainChannelFound);
      }
      resolve(this.mainChannel.send(message));
    });
  }

  private setMainChannel(): Promise<void> {
    return new Promise<void>(resolve => {
      const guild = this.client.guilds.cache.first();
      if (!guild) {
        throw new Error(errors.noMainChannelFound);
      }
      const channel = guild.channels.cache.find(channel => {
        return channel.type === 'text';
      }) as TextChannel;
      this.mainChannel = channel ? channel : null;
      resolve();
    });
  }
}
