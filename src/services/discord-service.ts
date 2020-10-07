import { Client, Presence } from 'discord.js';

import { LoggingService } from './logging-service';
import { NoDiscordTokenSetException } from '../errors/no-discord-token-set-exception';
import { NoDiscordUserFoundException } from '../errors/no-discord-user-found-exception';

const defaultActivity = '!k for kommandoer';

export class DiscordService {
  private loggingService: LoggingService;
  public client: Client;

  constructor() {
    this.client = new Client();
    this.loggingService = new LoggingService();
    this.initEvents();
  }

  async login(token = process.env.DISCORD_TOKEN): Promise<string> {
    if (token === 'undefined') {
      throw new NoDiscordTokenSetException();
    }
    return this.client.login(token);
  }

  async logout(): Promise<void> {
    return this.client.destroy();
  }

  async setActivity(): Promise<Presence> {
    if (!this.client.user) {
      throw new NoDiscordUserFoundException();
    }
    return this.client.user.setActivity({ name: defaultActivity });
  }

  private initEvents(): void {
    this.initReadyEvent();
  }

  private initReadyEvent(): void {
    this.client.on('ready', () => {
      if (!this.client.user) {
        throw new NoDiscordUserFoundException();
      }
      this.loggingService.log(`Logged in as ${this.client.user.tag}!`);
      this.setActivity();
    });
  }
}
