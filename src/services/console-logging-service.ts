export class ConsoleLoggingService implements LoggingService {
  public log(message: unknown): void {
    // eslint-disable-next-line no-console
    console.log(message);
  }
}
