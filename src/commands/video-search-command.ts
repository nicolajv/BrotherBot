import { AbstractCommand } from './abstract-command';
import { errors } from '../data/constants';

export class VideoSearchCommand extends AbstractCommand {
  private videoService: VideoService;

  constructor(videoService: VideoService) {
    super(
      'y',
      async (parameter?: string) => {
        let result: string;
        try {
          if (parameter) {
            result = await this.videoService.getVideo(parameter);
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
    this.videoService = videoService;
  }
}
