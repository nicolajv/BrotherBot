import { AbstractWebServiceCommand } from '../commands/abstracts/abstract-web-service-command';
import { CommandParameter } from './command-parameter';
import { translations } from '../data/translator';

export class DictionarySearchCommand extends AbstractWebServiceCommand {
  constructor(dictionaryService: DictionaryService) {
    /* istanbul ignore next */
    super(
      translations.definitionCommand,
      dictionaryService,
      translations.noDictionaryEntryFound,
      translations.dictionarySearchCommandHelp,
      new Array<CommandParameter>(
        new CommandParameter(
          translations.definitionCommandParam1N,
          translations.definitionCommandParam1D,
          true,
        ),
      ),
    );
  }
}
