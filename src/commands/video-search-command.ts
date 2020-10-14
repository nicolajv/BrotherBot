import { AbstractWebServiceCommand } from './abstracts/abstract-web-service-command';
import { errors } from '../data/constants';

export class VideoSearchCommand extends AbstractWebServiceCommand {
  constructor(videoService: VideoService) {
    /* istanbul ignore next */
    super('y', videoService, errors.noVideoFound, 'Searches for videos');
  }
}
