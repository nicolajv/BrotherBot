import { AbstractCommand } from './abstracts/abstract-command';
import { CommandParameter } from './command-parameter';
import { CommandPrototype } from '../models/command-prototype';
import { CommandResponse } from '../models/command-response';
import { translations } from '../data/translator';

export class AddCustomCommand extends AbstractCommand {
  private databaseService: DatabaseService;

  constructor(databaseService: DatabaseService) {
    super(
      'addcommand',
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
          new CommandParameter(
            translations.customCommandParam2N,
            translations.customCommandParam2D,
            true,
          ),
          new CommandParameter(
            translations.customCommandParam3N,
            translations.customCommandParam3D,
            true,
          ),
        ),
      },
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
