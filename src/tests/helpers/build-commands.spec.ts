import { Command } from '../../commands/interfaces/command.interface';
import { buildCommands } from '../../helpers/build-commands';
import { CustomCommandHandler } from '../../helpers/custom-command-handler';
import { JestHelper } from '../mocks/jest-helper';
import { MockCommand } from '../mocks/mock-command';

const jestHelper = new JestHelper();

describe('Build commands', () => {
  it('Can build list of commands', async () => {
    jestHelper.mockPrivateFunction(CustomCommandHandler.prototype, 'getCustomCommands', () => {
      const commands = new Array<Command>();
      commands.push(new MockCommand());
      return commands;
    });
    const commands = await buildCommands();
    expect(typeof commands).toBe(typeof Array<Command>());
    expect(commands.length).toBeGreaterThan(0);
  });
});
