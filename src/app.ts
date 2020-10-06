import express = require('express');

import { DiscordService } from './discord/discord-service';

const app = express();
const discord = new DiscordService();
const port = 4200;

export const server = new Promise<void>(resolve => {
  app.listen(port, () => {
    discord.login().then(() => {
      resolve();
    });
  });
});
