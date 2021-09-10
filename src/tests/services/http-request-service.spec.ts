import { HttpRequestService } from '../../services/http-request-service';

//Passing '' url will make the request succeed, anything else and it will fail
jest.mock('request', () => {
  return function (
    uri: string,
    callback: (error: string | undefined, response: string, body: string) => void,
  ): void {
    callback(uri, 'test', '{}');
  };
});

describe('Http Request Service get requests', () => {
  it('Can make successful requests', async () => {
    const requestService = new HttpRequestService();
    expect(requestService.getAsObject('')).resolves.not.toThrowError();
  });

  it('Can throw an error on a failed request', async () => {
    const requestService = new HttpRequestService();
    expect(requestService.getAsObject('test')).rejects.toThrowError();
  });
});
