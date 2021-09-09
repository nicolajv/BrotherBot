import { translations } from '../data/translator';
import { CommandResponse } from '../models/command-response';
import { AbstractCommand } from './abstracts/abstract-command';

export class RemoveCustomCommand extends AbstractCommand {
  private databaseService: DatabaseService;

  constructor(databaseService: DatabaseService) {
    super(
      'rc',
      async (parameter?: string) => {
        let result: string;
        try {
          if (parameter) {
            await this.databaseService.delete('commands', 'command', parameter);
            result = translations.commandRemoved;
          } else {
            throw new Error('No parameter found');
          }
        } catch (err) {
          result = translations.notEnoughParamters;
        }
        return new CommandResponse(result, true);
      },
      undefined,
      true,
    );
    this.databaseService = databaseService;
  }
}
