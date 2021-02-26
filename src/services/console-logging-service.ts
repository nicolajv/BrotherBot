export class ConsoleLoggingService implements LoggingService {
  public log(message: string): void {
    // eslint-disable-next-line no-console
    console.log(message);
  }
}
