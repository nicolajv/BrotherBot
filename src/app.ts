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
  }

  public start(): Promise<void> {
    return new Promise<void>(resolves => {
      this.server = this.app.listen(this.port, async () => {
        await this.discord.login();
        resolves();
      });
    });
  }

  public stop(): void {
    if (this.server) {
      this.server.close();
    } else {
      throw new Error();
    }
  }
}
