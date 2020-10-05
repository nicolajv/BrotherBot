import express = require('express');

import { DiscordService } from './discord/discord-service';

const app = express();
const port = 4200;
const discord = new DiscordService();

app.listen(port, () => {
  discord.login();
});
