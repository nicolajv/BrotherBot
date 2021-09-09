export class CommandPrototype {
  readonly command: string;
  readonly output: string;
  readonly helperText?: string;

  constructor(command: string, output: string, helperText: string) {
    this.command = command;
    this.output = output;
    this.helperText = helperText;
  }

  asGenericObject(): Record<string, unknown> {
    return this as Record<string, unknown>;
  }
}
