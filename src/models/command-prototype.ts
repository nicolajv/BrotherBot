export class CommandPrototype {
  public readonly command: string;
  public readonly output: string;
  public readonly helperText?: string;

  constructor(command: string, output: string, helperText: string) {
    this.command = command;
    this.output = output;
    this.helperText = helperText;
  }

  public asGenericObject(): Record<string, unknown> {
    return this as Record<string, unknown>;
  }
}
