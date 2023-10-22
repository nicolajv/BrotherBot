import axios from 'axios';

export class HttpRequestService implements RequestService {
  public async getAsObject(requestUri: string): Promise<Record<string, unknown>> {
    try {
      const response = await axios.get(encodeURI(requestUri));
      return response.data;
    } catch (error) {
      throw new Error('Failed to fulfill request');
    }
  }
}
