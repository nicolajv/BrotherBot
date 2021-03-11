import { emotesTable } from '../data/constants';
import { translations } from '../data/translator';
import { Emote } from '../models/emote';
import { AbstractCommand } from './abstracts/abstract-command';

export class TopEmotesCommand extends AbstractCommand {
  constructor(databaseService: DatabaseService) {
    super(
      'top10',
      async () => {
        let topEmotes = ((await databaseService.getAllFromTable(emotesTable)) as unknown) as Array<
          Emote
        >;
        console.log(topEmotes);
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
          return 'Migrated ' + finalString;
        }
        return translations.noEmotesFound;
      },
      translations.topEmotesCommandHelp,
    );
  }
}
