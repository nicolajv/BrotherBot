import { ConsoleLoggingService } from '../../services/console-logging-service';

describe('Http Request Service get requests', () => {
  const testMessage = 'Test string';

  it('Can make successful requests', async () => {
    const consoleLoggingService = new ConsoleLoggingService();
    const consoleLoggingServiceSpy = jest.spyOn(consoleLoggingService, 'log');
    const consoleSpy = jest.spyOn(console, 'log');
    consoleLoggingService.log(testMessage);
    expect(consoleLoggingServiceSpy).toHaveBeenLastCalledWith(testMessage);
    expect(consoleLoggingServiceSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenLastCalledWith(testMessage);
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });
});
