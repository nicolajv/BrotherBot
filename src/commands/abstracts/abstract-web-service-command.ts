import { AbstractCommand } from './abstract-command';
import { Command } from '../interfaces/command.interface';
import { CommandOption } from './command-option';
import { CommandResponse } from '../../models/command-response';

export abstract class AbstractWebServiceCommand extends AbstractCommand implements Command {
  constructor(
    name: string,
    webService: WebBasedService,
    errorMessage: string,
    helperText?: string,
    options?: Array<CommandOption>,
  ) {
    super(
      name,
      async (parameters?: Array<string>) => {
        let result: Array<string>;
        try {
          if (parameters) {
            result = await webService.get(parameters[0]);
          } else {
            throw new Error('A database error occured');
          }
        } catch (err) {
          result = [errorMessage];
        }
        return new CommandResponse(result);
      },
      helperText,
      false,
      options,
    );
  }
}
