import { AbstractWebServiceCommand } from './abstracts/abstract-web-service-command';
import { CommandParameter } from './command-parameter';
import { translations } from '../data/translator';

export class VideoSearchCommand extends AbstractWebServiceCommand {
  constructor(videoService: VideoService) {
    /* istanbul ignore next */
    super(
      translations.videoCommand,
      videoService,
      translations.noVideoFound,
      translations.videoSearchCommandHelp,
      {
        useConfirmation: true,
        parameters: new Array<CommandParameter>(
          new CommandParameter(
            translations.videoCommandParam1N,
            translations.videoCommandParam1D,
            true,
          ),
        ),
      },
    );
  }
}
