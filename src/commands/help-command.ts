import { AbstractCommand } from './abstracts/abstract-command';
import { commandPrefix } from '../data/constants';
import { translations } from '../data/translator';

export class HelpCommand extends AbstractCommand {
  private commandList: Array<Command>;

  constructor(commandList: Array<Command>) {
    super('h', async () => {
      return new Promise<string>(resolve => {
        let result = '';
        this.commandList.forEach(command => {
          if (command.helperText) {
            result = result + `${commandPrefix}${command.name} - ${command.helperText}\n`;
          }
        });
        resolve(`${translations.helpCommandText}\n${result}`);
      });
    });
    this.commandList = commandList;
  }
}
