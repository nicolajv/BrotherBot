import { AbstractCommand } from './abstracts/abstract-command';
import { Command } from './interfaces/command.interface';
import { CommandResponse } from '../models/command-response';
import { commandPrefix } from '../data/constants';
import { translations } from '../data/translator';

export class HelpCommand extends AbstractCommand {
  private commandList: Array<Command>;

  constructor(commandList: Array<Command>) {
    super('h', async () => {
      return new Promise<CommandResponse>(resolve => {
        let result = '';
        this.commandList
          .sort((a, b) => a.name.localeCompare(b.name))
          .forEach(command => {
            if (command.helperText) {
              result = result + `${commandPrefix}${command.name} - ${command.helperText}\n`;
            }
          });
        resolve(new CommandResponse([`${translations.helpCommandText}\n${result}`]));
      });
    });
    this.commandList = commandList;
  }
}
