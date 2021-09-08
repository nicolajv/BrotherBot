import request = require('request');

export class HttpRequestService implements RequestService {
  public getAsObject(requestUri: string): Promise<Record<string, unknown>> {
    return new Promise(resolve => {
      request(encodeURI(requestUri), (error, _response, body) => {
        if (error) {
          throw new Error('Failed to fulfill request');
        }
        resolve(JSON.parse(body));
      });
    });
  }
}
