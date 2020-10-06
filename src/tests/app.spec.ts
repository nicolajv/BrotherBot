import { App } from '../app';
import { DiscordService } from '../services/discord-service';
import { port } from '../data/constants';
jest.mock('../services/discord-service');
import express = require('express');

const oneTime = 1;

describe('App', () => {
  it('can start application', () => {
    const app = new App(express(), new DiscordService(), port);
    jest.spyOn(app, 'close');
    app.close();
    expect(app.close).toHaveBeenCalledTimes(oneTime);
  });
});

afterAll(async done => {
  done();
});
