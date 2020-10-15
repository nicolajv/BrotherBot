import { Channel, Client, TextChannel } from 'discord.js';

import { UserState } from '../models/user-state';
import { buildCommands } from '../helpers/build-commands';
import { commandPrefix } from '../data/constants';
import { text } from 'express';

const defaultActivity = '!h for help';

export class DiscordService implements ChatService {
  private loggingService: LoggingService;
  public client: Client;
  private commands: Array<Command> = Array<Command>();

  private mainChannel: TextChannel | undefined;
  private userStates = Array<UserState>();

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
    await this.initUserStates();
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

  private findOrAddUserState(userId: string, userName: string): UserState {
    let user = this.userStates.find(state => {
      return state.userId === userId;
    });
    if (!user) {
      user = new UserState(userId, userName);
      this.userStates.push(user);
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

  private initUserStates(): Promise<void> {
    return new Promise<void>(resolve => {
      const guild = this.client.guilds.cache.first();
      if (!guild) {
        throw new Error('This bot is not connected to any servers');
      }
      guild.members.cache.forEach(member => {
        this.userStates.push(new UserState(member.user.id, member.user.username));
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
      let user = this.findOrAddUserState(newstate.id, newstate.member.displayName);
      user.activeVoiceChannel = newstate.channelID;
      if (oldstate.channelID) {
        if (
          !this.userStates.find(state => {
            return state.activeVoiceChannel === oldstate.channelID;
          })
        ) {
          this.sendMessageInMainChannel(`Call ended in ${oldstate.channel?.name}!`);
        }
      }
      if (newstate.channelID) {
        if (
          !this.userStates.find(state => {
            return state.activeVoiceChannel === newstate.channelID && state.userId !== newstate.id;
          })
        ) {
          this.sendMessageInMainChannel(`Call started in ${newstate.channel?.name}!`);
        }
      }
    });
  }

  private async sendMessageInMainChannel(message: string) {
    if (!this.mainChannel) {
      await this.setMainChannel();
    }
    if (!this.mainChannel) {
      throw new Error('Unable to find main channel');
    }
    this.mainChannel.send(message);
  }

  private setMainChannel(): Promise<void> {
    return new Promise<void>(async resolve => {
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
