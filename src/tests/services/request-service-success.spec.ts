import { RequestService } from '../../services/request-service';

jest.mock('request', () => {
  return function (
    uri: string,
    callback: (error: undefined, response: string, body: string) => void,
  ): void {
    callback(undefined, 'test', 'test');
  };
});

describe('Request Service get requests', () => {
  it('Can make successful requests', async () => {
    const requestService = new RequestService();
    await expect(requestService.get('')).resolves.not.toThrowError();
  });
});
