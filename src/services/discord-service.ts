import { Client, GuildEmoji, Intents, Message, TextChannel, VoiceState } from 'discord.js';
import { commandPrefix, emotesTable } from '../data/constants';

import { CallState } from '../helpers/calls-state';
import { User } from '../models/user';
import { buildCommands } from '../helpers/build-commands';
import { translations } from '../data/translator';
import { Command } from '../commands/interfaces/command.interface';

export class DiscordService implements ChatService {
  private loggingService: LoggingService;
  private databaseService: DatabaseService;
  public client: Client;
  private commands: Array<Command> = Array<Command>();

  private mainChannel: TextChannel | null = null;
  private users = Array<User>();

  private callState = new CallState();

  constructor(loggingService: LoggingService, databaseService: DatabaseService, client?: Client) {
    this.client = client
      ? client
      : new Client({
          intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_MEMBERS,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
            Intents.FLAGS.GUILD_VOICE_STATES,
          ],
        });
    this.loggingService = loggingService;
    this.databaseService = databaseService;
    this.initCommands();
    this.initEvents();
  }

  public async login(token = process.env.DISCORD_TOKEN): Promise<void> {
    if (token === 'undefined') {
      throw new Error('No Discord token set');
    }
    await this.client.login();
  }

  public logout(): void {
    this.client.destroy();
  }

  public async setActivity(): Promise<void> {
    if (!this.client.user) {
      throw new Error('No Discord user found');
    }
    this.client.user.setActivity({
      name: translations.defaultActivity,
      type: 'LISTENING',
    });
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

  private async initCommands(): Promise<void> {
    this.commands = await buildCommands();
  }

  private initEvents(): void {
    this.handleReadyEvent();
    this.handleVoiceEvent();
    this.handleCommands();
    this.handleReactions();
  }

  private initUsers(): Promise<void> {
    return new Promise<void>(resolve => {
      const guild = this.client.guilds.cache.first();
      if (!guild) {
        throw new Error('No server connected');
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
        const content = message.toString();
        this.commands.forEach(async command => {
          if (content.toLowerCase().startsWith(`${commandPrefix}${command.name}`)) {
            const parameter = content.substr(content.indexOf(' ') + 1);
            try {
              let permitted = true;
              if (!message.member || !message.guild) {
                throw new Error('This message has no sender or no server');
              }
              if (command.adminOnly && !(message.member.id === message.guild.ownerId)) {
                permitted = false;
              }
              if (permitted) {
                const commandResponse = await command.execute(parameter);
                commandResponse.response.forEach(async response => {
                  await channel.send(response);
                });
                if (commandResponse.refreshCommands) {
                  await this.initCommands();
                }
              }
            } catch (err) {
              await channel.send(translations.genericError);
              this.loggingService.log(err);
            }
          }
        });
        const emotes = content.match(/<:[a-zA-Z]+:[0-9]+>/g);
        if (emotes) {
          emotes.forEach(async (match: string) => {
            this.updateEmoteInDatabase(match, true);
          });
        }
      }
    });
  }

  private handleReactions(): void {
    this.client.on('messageReactionAdd', reaction => {
      this.updateEmoteInDatabase(`<:${reaction.emoji.identifier}>`, true);
    });
    this.client.on('messageReactionRemove', reaction => {
      this.updateEmoteInDatabase(`<:${reaction.emoji.identifier}>`, false);
    });
  }

  private updateEmoteInDatabase(emote: string, added: boolean): void {
    if (this.checkIfEmojiExists(emote)) {
      this.databaseService.incrementFieldFindByFilter(emotesTable, 'name', emote, 'amount', added);
    }
  }

  private checkIfEmojiExists(emoji: string): GuildEmoji | undefined {
    return this.client.emojis.cache.find(emote => emoji.includes(emote.identifier));
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
      this.handleUsersEndingCalls(oldstate, newstate, user);
      this.handleUsersStartingCalls(oldstate, newstate, user);
    });
  }

  private handleUsersStartingCalls(oldstate: VoiceState, newstate: VoiceState, user: User): void {
    if (!newstate.member?.displayName) {
      throw new Error('User does not have a username');
    }
    if (
      newstate.channelId &&
      newstate.channel &&
      newstate.channel.joinable &&
      oldstate.channelId !== newstate.channelId
    ) {
      const userCountAfterAddition = this.callState.addUserToCall(newstate.channelId, user);
      if (userCountAfterAddition === 1) {
        const starterUserName = newstate.member.nickname
          ? newstate.member.nickname
          : newstate.member.displayName;
        this.sendMessageInMainChannel(
          `${starterUserName} ${translations.callStarted} ${newstate.channel.name}!`,
        );
      }
    }
  }

  private handleUsersEndingCalls(oldstate: VoiceState, newstate: VoiceState, user: User): void {
    if (
      oldstate.channelId &&
      oldstate.channel &&
      oldstate.channel.joinable &&
      oldstate.channelId !== newstate.channelId
    ) {
      const removalResult = this.callState.removeUserFromCall(oldstate.channelId, user);
      if (removalResult.userCount === 0) {
        this.sendMessageInMainChannel(
          `${translations.callEnded} ${oldstate.channel.name}. ${translations.callEndedDuration} ${removalResult.duration}`,
        );
      }
    }
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
        return channel.type === 'GUILD_TEXT';
      }) as TextChannel;
      this.mainChannel = channel ? channel : null;
      resolve();
    });
  }
}
