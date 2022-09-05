import { CommandOption } from '../abstracts/command-option';
import { CommandResponse } from '../../models/command-response';

export interface Command {
  name: string;
  execute(parameters?: Array<string>): Promise<CommandResponse>;
  helperText?: string;
  readonly adminOnly: boolean;
  readonly options?: Array<CommandOption>;
}
