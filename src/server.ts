import express = require('express');

import { App } from './app';
import { DiscordService } from './services/discord-service';
import { LoggingService } from './services/logging-service';

const port = 4200;

export const app = new App(express(), new DiscordService(new LoggingService()), port);
