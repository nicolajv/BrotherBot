export class ConsoleLoggingService implements LoggingService {
  public log(message: string): void {
    console.log(message);
  }
}
