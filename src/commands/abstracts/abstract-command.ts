import { Command } from '../interfaces/command.interface';
import { CommandParameter } from '../command-parameter';
import { CommandResponse } from '../../models/command-response';

export abstract class AbstractCommand implements Command {
  public name: string;
  public execute: (parameters?: Array<string>) => Promise<CommandResponse>;
  public helperText?: string;
  public readonly parameters?: Array<CommandParameter>;
  public readonly adminOnly: boolean;
  public readonly ephemeral: boolean;

  constructor(
    name: string,
    execute: (parameters?: Array<string>) => Promise<CommandResponse>,
    helperText?: string,
    options?: {
      adminOnly?: boolean;
      ephemeral?: boolean;
      parameters?: Array<CommandParameter>;
    },
  ) {
    this.name = name;
    this.execute = execute;
    this.helperText = helperText;
    this.adminOnly = options?.adminOnly ? options?.adminOnly : false;
    this.ephemeral = options?.ephemeral ? options?.ephemeral : false;
    this.parameters = options?.parameters ? options?.parameters : undefined;
  }
}
