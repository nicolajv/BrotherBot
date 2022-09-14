import { CommandParameter } from '../command-parameter';
import { CommandResponse } from '../../models/command-response';

export interface Command {
  name: string;
  execute(parameters?: Array<string>): Promise<CommandResponse>;
  helperText?: string;
  readonly adminOnly: boolean;
  readonly ephemeral: boolean;
  readonly useConfirmation: boolean;
  readonly parameters?: Array<CommandParameter>;
}
