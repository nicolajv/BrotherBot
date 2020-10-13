import { AbstractCommand } from './abstract-command';
import { YoutubeVideoService } from '../services/youtube-video-service';
import { errors } from '../data/constants';

const videoService = new YoutubeVideoService();

export class VideoSearchCommand extends AbstractCommand {
  constructor() {
    super(
      'y',
      async (parameter?: string) => {
        let result: string;
        try {
          if (parameter) {
            result = await videoService.getVideo(parameter);
          } else {
            throw new Error(errors.noSearchString);
          }
        } catch (err) {
          result = errors.noVideoFound;
        }
        return result;
      },
      'Searches for videos',
    );
  }
}
