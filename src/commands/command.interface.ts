interface Command {
  name: string;
  execute: (parameter?: string) => Promise<string>;
}
