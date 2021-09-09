import { CommandResponse } from '../../models/command-response';
import { Command } from '../interfaces/command.interface';
import { AbstractCommand } from './abstract-command';

export abstract class AbstractWebServiceCommand extends AbstractCommand implements Command {
  constructor(
    name: string,
    webService: WebBasedService,
    errorMessage: string,
    helperText?: string,
  ) {
    super(
      name,
      async (parameter?: string) => {
        let result: string;
        try {
          if (parameter) {
            result = await webService.get(parameter);
          } else {
            throw new Error('A database error occured');
          }
        } catch (err) {
          result = errorMessage;
        }
        return new CommandResponse(result);
      },
      helperText,
    );
  }
}
