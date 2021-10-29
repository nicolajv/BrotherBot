import { UrbanDictionaryResults } from '../models/urban-dictionary-results';

export class UrbanDictionaryService implements DictionaryService {
  private requestService: RequestService;

  private urbanDictionaryApi: string;

  constructor(requestService: RequestService) {
    this.urbanDictionaryApi = `https://api.urbandictionary.com/v0/define?term=`;
    this.requestService = requestService;
  }

  public async get(search: string): Promise<string[]> {
    const searchResult = {} as UrbanDictionaryResults;
    Object.assign(
      searchResult,
      await this.requestService.getAsObject(`${this.urbanDictionaryApi}${search}`),
    );
    if (
      !searchResult.list ||
      !searchResult.list[0] ||
      !searchResult.list[0].word ||
      !searchResult.list[0].definition ||
      !searchResult.list[0].example
    ) {
      throw new Error('Urban Dictionary entry not found');
    }
    const result = searchResult.list[0];
    return [sanitize(`**${result.word}**\n${result.definition}\n\n*${result.example}*`)];
  }
}

function sanitize(input: string): string {
  return input.replace(/(\[|\])/g, '');
}
