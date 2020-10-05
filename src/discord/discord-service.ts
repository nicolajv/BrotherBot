import { Client } from 'discord.js';

const discord = require('discord.js');

export class DiscordService {
  private client: Client = new discord.Client();

  constructor() {
    this.client.on('ready', () => {
      console.log(`Logged in as ${this.client.user!.tag}!`);
    });
  }

  login = (token = process.env.DISCORD_TOKEN) => {
    if (!token) {
      throw new Error('No Discord token set');
    }
    this.client.login(token);
  };
}
