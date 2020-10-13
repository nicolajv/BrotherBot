import express = require('express');

import { App } from '../infrastructure/app';
import { CardImageCommand } from '../commands/card-image-command';
import { ConsoleLoggingService } from '../services/console-logging-service';
import { DiscordService } from '../services/discord-service';
import { HelpCommand } from '../commands/help-command';
import { HttpRequestService } from '../services/http-request-service';
import { ScryfallService } from '../services/scryfall-service';
import { VideoSearchCommand } from '../commands/video-search-command';
import { YoutubeVideoService } from '../services/youtube-video-service';
import { port } from '../data/constants';

export const makeApp = (discord?: DiscordService): App => {
  return new App(express(), discord ? discord : makeChatService(), port);
};

export const makeCardImageCommand = (): CardImageCommand => {
  return new CardImageCommand(makeTcgService());
};

export const makeChatService = (): DiscordService => {
  return new DiscordService(makeLoggingService());
};

export const makeHelpCommand = (commandList: Array<Command>): HelpCommand => {
  return new HelpCommand(commandList);
};

export const makeLoggingService = (): LoggingService => {
  return new ConsoleLoggingService();
};

export const makeTcgService = (): TcgService => {
  return new ScryfallService(makeRequestService());
};

export const makeRequestService = (): RequestService => {
  return new HttpRequestService();
};

export const makeVideoSearchCommand = (): VideoSearchCommand => {
  return new VideoSearchCommand(makeVideoService());
};

export const makeVideoService = (apiKey?: string): VideoService => {
  return new YoutubeVideoService(makeRequestService(), apiKey);
};
