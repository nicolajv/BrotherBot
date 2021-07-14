import { translations } from '../data/translator';
import { CommandPrototype } from '../models/command-prototype';
import { CommandResponse } from '../models/command-response';
import { AbstractCommand } from './abstracts/abstract-command';

export class AddCustomCommand extends AbstractCommand {
  private databaseService: DatabaseService;

  constructor(databaseService: DatabaseService) {
    super(
      'ac',
      async (parameter?: string) => {
        let result: string;
        try {
          if (parameter) {
            const params = parameter.split(',');
            if (params.length === 3) {
              await this.databaseService.save(
                'commands',
                new CommandPrototype(
                  params[0].trim(),
                  params[1].trim(),
                  params[2].trim(),
                ).asGenericObject(),
              );
              result = translations.commandAdded;
            } else {
              throw new Error('No parameter found');
            }
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
