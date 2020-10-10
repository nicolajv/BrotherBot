import request = require('request');

export class RequestService {
  public async get(requestUri: string): Promise<string> {
    return new Promise<string>(resolve => {
      request(requestUri, (error, response, body) => {
        if (error) {
          throw new Error('Failed to fulfill request');
        }
        resolve(body);
      });
    });
  }
}
