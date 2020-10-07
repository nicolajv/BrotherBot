import express = require('express');

import { App } from './app';
import { DiscordService } from './services/discord-service';
import { port } from './data/constants';

export const app = new App(express(), new DiscordService(), port);
app.start();
