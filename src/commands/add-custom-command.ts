import { AbstractCommand } from './abstracts/abstract-command';
import { CommandOption } from './abstracts/command-option';
import { CommandPrototype } from '../models/command-prototype';
import { CommandResponse } from '../models/command-response';
import { translations } from '../data/translator';

export class AddCustomCommand extends AbstractCommand {
  private databaseService: DatabaseService;

  constructor(databaseService: DatabaseService) {
    super(
      'ac',
      async (parameters?: Array<string>) => {
        let result: string;
        try {
          const params = parameters;
          if (params && params.length === 3) {
            await this.databaseService.save('commands', createCommandPrototype(params));
            result = translations.commandAdded;
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
      new Array<CommandOption>(
        new CommandOption('navn', 'navm', true),
        new CommandOption('svar', 'svar', true),
        new CommandOption('hjælp', 'hjælp', true),
      ),
    );
    this.databaseService = databaseService;
  }
}

function createCommandPrototype(params: Array<string>): Record<string, unknown> {
  return new CommandPrototype(
    params[0].trim(),
    params[1].trim(),
    params[2].trim(),
  ).asGenericObject();
}
