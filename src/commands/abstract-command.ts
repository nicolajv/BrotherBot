export abstract class Command {
  public name: string;
  public execute: (parameter?: string) => Promise<string>;

  constructor(name: string, execute: (parameter?: string) => Promise<string>) {
    this.name = name;
    this.execute = execute;
  }
}
