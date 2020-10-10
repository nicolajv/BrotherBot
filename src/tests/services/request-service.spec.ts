import { RequestService } from '../../services/request-service';

//Passing '' url will make the request succeed, anything else and it will fail
jest.mock('request', () => {
  return function (
    uri: string,
    callback: (error: string | undefined, response: string, body: string) => void,
  ): void {
    callback(uri, 'test', 'test');
  };
});

describe('Request Service get requests', () => {
  it('Can make successful requests', async () => {
    const requestService = new RequestService();
    await expect(requestService.get('')).resolves.not.toThrowError();
  });
});

describe('Request Service get requests', () => {
  it('Can throw an error on a failed request', async () => {
    const requestService = new RequestService();
    await expect(requestService.get('test')).rejects.toThrowError();
  });
});
