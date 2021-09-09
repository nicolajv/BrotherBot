import { CustomCommand } from '../../commands/custom-command';

describe('Custom command', () => {
  it('Can execute a custom command', async () => {
    const customCommand = new CustomCommand('lol', 'lel');
    const result = customCommand.execute();
    expect(result).resolves.not.toThrowError();
    const finalResult = await result;
    expect(finalResult.response).toContain('lel');
  });
});
