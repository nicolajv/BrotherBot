import { RequestService } from '../../services/request-service';

jest.mock('request', () => {
  return function (
    uri: string,
    callback: (error: string, response: string, body: string) => void,
  ): void {
    callback('test', 'test', 'test');
  };
});

describe('Request Service get requests', () => {
  it('Can throw an error on a failed request', async () => {
    const requestService = new RequestService();
    await expect(requestService.get('')).rejects.toThrowError();
  });
});
