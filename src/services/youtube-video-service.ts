import { RequestService } from './request-service';
import { YoutubeVideo } from '../models/youtube-video';

export class YoutubeVideoService implements VideoService {
  private requestService: RequestService;

  private apiKey: string;
  private youtubeApi: string;
  private youtubeVideoUrl = 'https://www.youtube.com/watch?v=';

  constructor(apiKey = process.env.YOUTUBE_TOKEN) {
    if (!apiKey || apiKey === 'undefined') {
      throw new Error('No Youtube api key set');
    }
    this.apiKey = apiKey;
    this.youtubeApi = `https://www.googleapis.com/youtube/v3/search?key=${this.apiKey}&type=video&part=snippet&maxResults=1&q=`;
    this.requestService = new RequestService();
  }

  public async getVideo(search: string): Promise<string> {
    const searchResult = JSON.parse(
      await this.requestService.get(`${this.youtubeApi}${search}`),
    ) as YoutubeVideo;
    if (
      !searchResult.items ||
      !searchResult.items[0] ||
      !searchResult.items[0].id ||
      !searchResult.items[0].id.videoId
    ) {
      throw new Error('Video not found');
    }
    return `${this.youtubeVideoUrl}${searchResult.items[0].id.videoId}`;
  }
}
