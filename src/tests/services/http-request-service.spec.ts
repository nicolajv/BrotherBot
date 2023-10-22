import { HttpRequestService } from '../../services/http-request-service';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('Http Request Service get requests', () => {
  let requestService: HttpRequestService;
  let mockAxios: InstanceType<typeof MockAdapter>;

  beforeEach(() => {
    requestService = new HttpRequestService();
    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAxios.restore();
  });

  it('Can make successful requests', async () => {
    const responseData = {};
    mockAxios.onGet('').reply(200, responseData);

    await expect(requestService.getAsObject('')).resolves.toEqual(responseData);
  });

  it('Can throw an error on a failed request', async () => {
    mockAxios.onGet('test').reply(500);

    await expect(requestService.getAsObject('test')).rejects.toThrowError();
  });
});
