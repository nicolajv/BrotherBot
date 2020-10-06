import { DiscordService } from './services/discord-service';
import { Express } from 'express-serve-static-core';
import { Server } from 'http';

export class App {
  private app: Express;
  private discord: DiscordService;
  private port: number;
  private server: Server | undefined;

  constructor(app: Express, discord: DiscordService, port: number) {
    this.app = app;
    this.discord = discord;
    this.port = port;
    this.start();
  }

  private start(): void {
    this.server = this.app.listen(this.port, () => {
      this.discord.login();
    });
  }

  public close(): void {
    if (this.server) {
      this.server.close();
    }
  }
}
