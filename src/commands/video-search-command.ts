import { AbstractWebServiceCommand } from './abstracts/abstract-web-service-command';
import { CommandOption } from './command-option';
import { translations } from '../data/translator';

export class VideoSearchCommand extends AbstractWebServiceCommand {
  constructor(videoService: VideoService) {
    /* istanbul ignore next */
    super(
      'y',
      videoService,
      translations.noVideoFound,
      translations.videoSearchCommandHelp,
      new Array<CommandOption>(new CommandOption('video', 'Videoen du gerne vil søge efter', true)),
    );
  }
}
