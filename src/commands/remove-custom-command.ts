import { AbstractCommand } from './abstracts/abstract-command';
import { CommandOption } from './abstracts/command-option';
import { CommandResponse } from '../models/command-response';
import { translations } from '../data/translator';

export class RemoveCustomCommand extends AbstractCommand {
  private databaseService: DatabaseService;

  constructor(databaseService: DatabaseService) {
    super(
      'rc',
      async (parameters?: Array<string>) => {
        let result: string;
        try {
          if (parameters) {
            await this.databaseService.delete('commands', 'command', parameters[0]);
            result = translations.commandRemoved;
          } else {
            throw new Error('No parameter found');
          }
        } catch (err) {
          result = translations.notEnoughParamters;
        }
        return new CommandResponse([result], true);
      },
      undefined,
      true,
      new Array<CommandOption>(new CommandOption('navn', 'navm', true)),
    );
    this.databaseService = databaseService;
  }
}
