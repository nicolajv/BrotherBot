import { App } from '../app';
import { DiscordService } from '../services/discord-service';
import { port } from '../data/constants';
import express = require('express');

jest.mock('../services/discord-service');

const oneTime = 1;

describe('App', () => {
  it('can start the application', async () => {
    const discordService = new DiscordService();
    const app = new App(express(), discordService, port);
    await app.start();
    expect(discordService.login).toHaveBeenCalledTimes(oneTime);
    jest.spyOn(app, 'stop');
    app.stop();
    expect(app.stop).toHaveBeenCalledTimes(oneTime);
  });

  it('can not close the application before starting', async () => {
    const app = new App(express(), new DiscordService(), port);
    jest.spyOn(app, 'stop');
    try {
      app.stop();
    } catch (error) {
      expect(app.stop).toThrowError();
    }
  });
});

afterAll(async done => {
  done();
});
