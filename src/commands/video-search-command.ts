import { AbstractCommand } from './abstract-command';
import { VideoService } from '../services/video-service';
import { errors } from '../data/constants';

const videoService = new VideoService();

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
