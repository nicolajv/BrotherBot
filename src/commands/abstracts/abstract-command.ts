import { CommandResponse } from '../../models/command-response';
import { Command } from '../interfaces/command.interface';

export abstract class AbstractCommand implements Command {
  public name: string;
  public execute: (parameter?: string) => Promise<CommandResponse>;
  public helperText?: string;
  public readonly adminOnly: boolean;

  constructor(
    name: string,
    execute: (parameter?: string) => Promise<CommandResponse>,
    helperText?: string,
    adminOnly = false,
  ) {
    this.name = name;
    this.execute = execute;
    this.helperText = helperText;
    this.adminOnly = adminOnly;
  }
}
