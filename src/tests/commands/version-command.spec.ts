import { VersionCommand } from '../../commands/version-command';

describe('Version command', () => {
  it('Can execute the version command', async () => {
    const versionCommand = new VersionCommand();
    versionCommand['package_json'] = { version: 'test' };
    const result = versionCommand.execute();
    expect(result).resolves.not.toThrowError();
    const finalResult = await result;
    expect(finalResult.response).toContain('test');
  });
});
