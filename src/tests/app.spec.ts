import { App } from '../app';
import { DiscordService } from '../services/discord-service';
import { port } from '../data/constants';
import express = require('express');

jest.mock('../services/discord-service');

describe('App', () => {
  it('can start the application', async () => {
    const discordService = new DiscordService();
    const app = new App(express(), discordService, port);
    await app.start();
    expect(discordService.login).toHaveBeenCalledTimes(1);
    jest.spyOn(app, 'stop');
    app.stop();
    expect(app.stop).toHaveBeenCalledTimes(1);
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
