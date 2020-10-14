import { ScryfallCard } from '../models/scryfall-card';
export class ScryfallService implements TcgService {
  private requestService: RequestService;
  private imageApi = 'https://api.scryfall.com/cards/named?fuzzy=';

  constructor(requestService: RequestService) {
    this.requestService = requestService;
  }

  public async get(search: string): Promise<string> {
    const searchResult = await this.requestService.getAsObject(
      {} as ScryfallCard,
      `${this.imageApi}${search}`,
    );
    if (
      !searchResult.object ||
      searchResult.object !== 'card' ||
      !searchResult.image_uris ||
      !searchResult.image_uris.normal
    ) {
      throw new Error('Card not found');
    }
    return searchResult.image_uris.normal;
  }
}
