export interface UrbanDictionaryResults {
  list: [
    {
      definition: string;
      permalink: string;
      thumbs_up: number;
      sound_urls: Array<string>;
      author: string;
      word: string;
      defid: number;
      current_vote: string;
      written_on: string;
      example: string;
      thumbs_down: number;
    },
  ];
}
