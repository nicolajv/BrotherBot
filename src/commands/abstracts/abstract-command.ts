import { Command } from '../interfaces/command.interface';
import { CommandOption } from './command-option';
import { CommandResponse } from '../../models/command-response';

export abstract class AbstractCommand implements Command {
  public name: string;
  public execute: (parameters?: Array<string>) => Promise<CommandResponse>;
  public helperText?: string;
  public readonly adminOnly: boolean;
  public readonly options?: Array<CommandOption>;

  constructor(
    name: string,
    execute: (parameters?: Array<string>) => Promise<CommandResponse>,
    helperText?: string,
    adminOnly = false,
    option?: Array<CommandOption>,
  ) {
    this.name = name;
    this.execute = execute;
    this.helperText = helperText;
    this.adminOnly = adminOnly;
    this.options = option;
  }
}
