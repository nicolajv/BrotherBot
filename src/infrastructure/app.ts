import { Express, Request, Response } from 'express-serve-static-core';

import { Server } from 'http';

export class App {
  private app: Express;
  private client: ChatService;
  private port: number;
  private server: Server | undefined;

  constructor(app: Express, client: ChatService, port: number) {
    this.app = app;
    this.client = client;
    this.port = port;
  }

  public start(): Promise<void> {
    return new Promise<void>(resolves => {
      this.app.use('/health', (_req: Request, res: Response) => {
        res.statusCode = 200;
        res.send({ status: res.statusCode, message: 'Healthy' });
      });
      this.server = this.app.listen(this.port, async () => {
        await this.client.login();
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
