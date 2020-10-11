import { AbstractCommand } from './abstract-command';
import { commandPrefix, errors } from '../data/constants';
import { TcgService } from '../services/tcg-service';

export class HelpCommand extends AbstractCommand {
  private commandList: Array<Command>;

  constructor(commandList: Array<Command>) {
    super('h', async () => {
      return new Promise<string>(resolve => {
        let result: string = '';
        this.commandList.forEach(command => {
          if (command.helperText) {
            result = result + `${commandPrefix}${command.name} - ${command.helperText}\n`;
          }
        });
        resolve(`The following commands are available:\n${result}`);
      });
    });
    this.commandList = commandList;
  }
}
