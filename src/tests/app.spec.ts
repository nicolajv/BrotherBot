import { App } from '../app';
import { DiscordService } from '../services/discord-service';
import { LoggingService } from '../services/logging-service';
jest.mock('../services/discord-service');
import express = require('express');

const port = 4200;
const oneTime = 1;

describe('App', () => {
  it('can start application', () => {
    const app = new App(express(), new DiscordService(new LoggingService()), port);
    jest.spyOn(app, 'close');
    app.close();
    expect(app.close).toHaveBeenCalledTimes(oneTime);
  });
});

afterAll(async done => {
  done();
});
