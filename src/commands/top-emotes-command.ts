import { AbstractCommand } from './abstracts/abstract-command';
import { CommandResponse } from '../models/command-response';
import { Emote } from '../models/emote';
import { emotesTable } from '../data/constants';
import { translations } from '../data/translator';

export class TopEmotesCommand extends AbstractCommand {
  constructor(databaseService: DatabaseService) {
    super(
      'top10',
      async () => {
        let topEmotes = (await databaseService.getAllFromTable(
          emotesTable,
        )) as unknown as Array<Emote>;
        if (topEmotes.length > 0) {
          topEmotes = topEmotes
            .sort((a: Emote, b: Emote) => {
              return b['amount'] - a['amount'];
            })
            .slice(0, 10);
          let i: number;
          let finalString = '';
          for (i = 0; i < topEmotes.length; i++) {
            finalString = `${finalString}${i + 1}. ${topEmotes[i]['name']}\n`;
          }
          return new CommandResponse([finalString]);
        }
        return new CommandResponse([translations.noEmotesFound]);
      },
      translations.topEmotesCommandHelp,
    );
  }
}
