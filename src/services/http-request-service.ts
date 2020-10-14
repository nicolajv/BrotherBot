import request = require('request');

export class HttpRequestService implements RequestService {
  public getAsObject<T>(_type: T, requestUri: string): Promise<T> {
    return new Promise<T>(resolve => {
      request(requestUri, (error, _response, body) => {
        if (error) {
          throw new Error('Failed to fulfill request');
        }
        resolve(JSON.parse(body));
      });
    });
  }
}
