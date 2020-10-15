import { Client, TextChannel } from 'discord.js';

import { CallState } from '../helpers/calls-state';
import { User } from '../models/user';
import { buildCommands } from '../helpers/build-commands';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';
import { commandPrefix } from '../data/constants';

const defaultActivity = '!h for help';

export class DiscordService implements ChatService {
  private loggingService: LoggingService;
  public client: Client;
  private commands: Array<Command> = Array<Command>();

  private mainChannel: TextChannel | undefined;
  private users = Array<User>();

  private callState = new CallState();

  constructor(loggingService: LoggingService) {
    this.client = new Client();
    this.loggingService = loggingService;
    this.initCommands();
    this.initEvents();
    this.handleCommands();
  }

  async login(token = process.env.DISCORD_TOKEN): Promise<string> {
    if (token === 'undefined') {
      throw new Error('No Discord token set');
    }
    const loginResult = await this.client.login();
    await this.initUsers();
    return loginResult;
  }

  async logout(): Promise<void> {
    return this.client.destroy();
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
        throw new Error('This bot is not connected to any servers');
      }
      guild.members.cache.forEach(member => {
        this.users.push(new User(member.user.id, member.user.username));
      });
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
        throw new Error('User does not have a username');
      }
      const user = this.findOrAddUser(newstate.id, newstate.member.displayName);
      if (oldstate.channelID && oldstate.channelID !== newstate.channelID) {
        if (this.callState.removeUserFromCall(oldstate.channelID, user) === 0) {
          this.sendMessageInMainChannel(`Call ended in ${oldstate.channel?.name}!`);
        }
      }
      if (newstate.channelID && oldstate.channelID !== newstate.channelID) {
        if (this.callState.addUserToCall(newstate.channelID, user) === 1) {
          this.sendMessageInMainChannel(`Call started in ${newstate.channel?.name}!`);
        }
      }
    });
  }

  private async sendMessageInMainChannel(message: string): Promise<void> {
    if (!this.mainChannel) {
      await this.setMainChannel();
    }
    if (!this.mainChannel) {
      throw new Error('Unable to find main channel');
    }
    this.mainChannel.send(message);
  }

  private setMainChannel(): Promise<void> {
    return new Promise<void>(resolve => {
      const guild = this.client.guilds.cache.first();
      if (!guild) {
        throw new Error('This bot is not connected to any servers');
      }
      const channel = guild.channels.cache.find(channel => {
        return channel.type === 'text';
      }) as TextChannel;
      this.mainChannel = channel;
      resolve();
    });
  }
}
