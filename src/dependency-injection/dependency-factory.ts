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
import { MongoDBService } from '../services/mongo-db-service';
import { TopEmotesCommand } from '../commands/top-emotes-command';
import { CustomCommandHandler } from '../helpers/custom-command-handler';
import { AddCustomCommand } from '../commands/add-custom-command';
import { RemoveCustomCommand } from '../commands/remove-custom-command';
import { Command } from '../commands/interfaces/command.interface';
import { VersionCommand } from '../commands/version-command';

export const makeAddCustomCommand = (): AddCustomCommand => {
  return new AddCustomCommand(makeDatabaseService());
};

export const makeApp = (discord?: DiscordService): App => {
  return new App(express(), discord ? discord : makeChatService(), port);
};

export const makeCardImageCommand = (): CardImageCommand => {
  return new CardImageCommand(makeTcgService());
};

export const makeCustomCommandHandler = (): CustomCommandHandler => {
  return new CustomCommandHandler(makeDatabaseService());
};

export const makeChatService = (): DiscordService => {
  return new DiscordService(makeLoggingService(), makeDatabaseService());
};

export const makeDatabaseService = (): DatabaseService => {
  return new MongoDBService();
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

export const makeRemoveCustomCommand = (): RemoveCustomCommand => {
  return new RemoveCustomCommand(makeDatabaseService());
};

export const makeRequestService = (): RequestService => {
  return new HttpRequestService();
};

export const makeTopEmotesCommand = (): TopEmotesCommand => {
  return new TopEmotesCommand(makeDatabaseService());
};

export const makeVersionCommand = (): VersionCommand => {
  return new VersionCommand();
};

export const makeVideoSearchCommand = (): VideoSearchCommand => {
  return new VideoSearchCommand(makeVideoService());
};

export const makeVideoService = (apiKey?: string): VideoService => {
  return new YoutubeVideoService(makeRequestService(), apiKey);
};
