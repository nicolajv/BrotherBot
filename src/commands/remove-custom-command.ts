import { AbstractCommand } from './abstracts/abstract-command';
import { CommandParameter } from './command-parameter';
import { CommandResponse } from '../models/command-response';
import { translations } from '../data/translator';

export class RemoveCustomCommand extends AbstractCommand {
  private databaseService: DatabaseService;

  constructor(databaseService: DatabaseService) {
    super(
      'removecommand',
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
        return new CommandResponse([result], { refreshCommands: true });
      },
      undefined,
      {
        adminOnly: true,
        ephemeral: true,
        parameters: new Array<CommandParameter>(
          new CommandParameter(
            translations.customCommandParam1N,
            translations.customCommandParam1D,
            true,
          ),
        ),
      },
    );
    this.databaseService = databaseService;
  }
}
