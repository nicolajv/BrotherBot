export abstract class AbstractCommand implements Command {
  public name: string;
  public execute: (parameter?: string) => Promise<string>;
  public helperText?: string;

  constructor(name: string, execute: (parameter?: string) => Promise<string>, helperText?: string) {
    this.name = name;
    this.execute = execute;
    this.helperText = helperText;
  }
}
