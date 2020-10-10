import { Client, Presence } from 'discord.js';

import { Command } from '../commands/abstract-command';
import { LoggingService } from './logging-service';
import buildCommands from '../helpers/commands-builder';

const defaultActivity = '!k for kommandoer';

export class DiscordService {
  private loggingService: LoggingService;
  public client: Client;
  private commands: Array<Command> = Array<Command>();

  constructor() {
    this.client = new Client();
    this.loggingService = new LoggingService();
    this.initCommands();
    this.initEvents();
    this.handleCommands();
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

  private initCommands(): void {
    this.commands = buildCommands();
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

  private handleCommands(): void {
    this.client.on('message', message => {
      const channel = message.channel;
      const content = message.toString();
      this.commands.forEach(async command => {
        if (content.startsWith(`!${command.name}`)) {
          const parameter = content.substr(content.indexOf(' ') + 1);
          await channel.send(await command.execute(parameter));
        }
      });
    });
  }
}
