import { CommandResponse } from '../../models/command-response';

export interface Command {
  name: string;
  execute: (parameter?: string) => Promise<CommandResponse>;
  helperText?: string;
  readonly adminOnly: boolean;
}
