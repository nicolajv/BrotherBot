import { ScryfallCardList } from '../models/scryfall-card';
export class ScryfallService implements TcgService {
  private requestService: RequestService;
  private imageApi = 'https://api.scryfall.com/cards/search?q=';

  constructor(requestService: RequestService) {
    this.requestService = requestService;
  }

  public async get(search: string): Promise<string[]> {
    const searchResult = {} as ScryfallCardList;
    Object.assign(searchResult, await this.requestService.getAsObject(`${this.imageApi}${search}`));
    const result = new Array<string>();
    if (searchResult.data[0].card_faces) {
      searchResult.data[0].card_faces.forEach(face => {
        if (face.image_uris && face.image_uris.normal) {
          result.push(face.image_uris.normal);
        }
      });
    } else if (searchResult.data[0].image_uris && searchResult.data[0].image_uris.normal) {
      result.push(searchResult.data[0].image_uris && searchResult.data[0].image_uris.normal);
    }
    if (!result.length) {
      throw new Error('Card result not found!');
    }
    return result;
  }
}
