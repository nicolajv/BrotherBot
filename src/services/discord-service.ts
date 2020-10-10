import { Client, Presence } from 'discord.js';

import { LoggingService } from './logging-service';

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
      throw new Error('No Discord token set');
    }
    return this.client.login(token);
  }

  async logout(): Promise<void> {
    return this.client.destroy();
  }

  async setActivity(): Promise<Presence> {
    if (!this.client.user) {
      throw new Error('No Discord user found');
    }
    return this.client.user.setActivity({ name: defaultActivity });
  }

  private initEvents(): void {
    this.initReadyEvent();
  }

  private initReadyEvent(): void {
    this.client.on('ready', () => {
      if (!this.client.user) {
        throw new Error('No Discord user found');
      }
      this.loggingService.log(`Logged in as ${this.client.user.tag}!`);
      this.setActivity();
    });
  }
}
