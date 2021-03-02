import { ScryfallCardList } from '../models/scryfall-card';
export class ScryfallService implements TcgService {
  private requestService: RequestService;
  private imageApi = 'https://api.scryfall.com/cards/search?q=';

  constructor(requestService: RequestService) {
    this.requestService = requestService;
  }

  public async get(search: string): Promise<string> {
    const searchResult = {} as ScryfallCardList;
    Object.assign(searchResult, await this.requestService.getAsObject(`${this.imageApi}${search}`));
    if (
      searchResult.total_cards === 0 ||
      !searchResult.data[0].object ||
      searchResult.data[0].object !== 'card' ||
      !searchResult.data[0].image_uris ||
      !searchResult.data[0].image_uris.normal
    ) {
      throw new Error('Card not found');
    }
    return searchResult.data[0].image_uris.normal;
  }
}
