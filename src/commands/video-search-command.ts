import { translations } from '../data/translator';
import { AbstractWebServiceCommand } from './abstracts/abstract-web-service-command';

export class VideoSearchCommand extends AbstractWebServiceCommand {
  constructor(videoService: VideoService) {
    /* istanbul ignore next */
    super('y', videoService, translations.noVideoFound, translations.videoSearchCommandHelp);
  }
}
