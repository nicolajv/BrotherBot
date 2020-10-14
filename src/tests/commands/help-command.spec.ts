import { AbstractCommand } from '../../commands/abstracts/abstract-command';
import { HelpCommand } from '../../commands/help-command';

class mockCommand extends AbstractCommand {
  constructor(name?: string, includeHelperText = true) {
    super(
      name ? name : 'test',
      () => {
        return new Promise<string>(resolve => {
          resolve('description');
        });
      },
      includeHelperText ? 'helpertext' : undefined,
    );
  }
}

describe('Help command', () => {
  it('Can return help on commands', async () => {
    const commands = Array<Command>();
    const sampleCommand: Command = new mockCommand();
    commands.push(sampleCommand);
    const helpCommand = new HelpCommand(commands);
    const promise = helpCommand.execute();
    expect(promise).resolves.not.toThrowError();
    expect(promise).resolves.toContain(sampleCommand.helperText);
  });

  it('Does not return commands without helper text', async () => {
    const commands = Array<Command>();
    const sampleCommand: Command = new mockCommand();
    commands.push(sampleCommand);
    const noHelpCommand: Command = new mockCommand('thisnameshouldnotbeseen', false);
    commands.push(noHelpCommand);
    const helpCommand = new HelpCommand(commands);
    const promise = helpCommand.execute();
    expect(promise).resolves.not.toThrowError();
    expect(promise).resolves.not.toContain(noHelpCommand.name);
  });
});
