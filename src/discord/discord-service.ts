import { Client } from 'discord.js';
import { NoDiscordTokenSetException } from '../errors/no-discord-token-set-exception';
import { NoDiscordUserFoundException } from '../errors/no-discord-user-found-exception';

export class DiscordService {
  public client: Client;

  constructor() {
    console.log('here');
    this.client = new Client();
    this.client.on('ready', () => {
      if (!this.client.user) {
        throw new NoDiscordUserFoundException();
      }
      console.log(`Logged in as ${this.client.user.tag}!`);
    });
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
}
