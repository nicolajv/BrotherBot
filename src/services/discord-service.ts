import { Client } from 'discord.js';
import { buildCommands } from '../helpers/build-commands';
import { commandPrefix } from '../data/constants';

const defaultActivity = '!h for help';

export class DiscordService implements ChatService {
  private loggingService: LoggingService;
  public client: Client;
  private commands: Array<Command> = Array<Command>();

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
    return this.client.login(token);
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
        if (content.startsWith(`${commandPrefix}${command.name}`)) {
          const parameter = content.substr(content.indexOf(' ') + 1);
          await channel.send(await command.execute(parameter));
        }
      });
    });
  }
}
