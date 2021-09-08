import { danishDictionary } from '../translations/da';
import { englishDictionary } from '../translations/en';

export const translations = {
  callEnded: getTranslation('callEnded'),
  callEndedDuration: getTranslation('callEndedDuration'),
  callStarted: getTranslation('callStarted'),
  cardImageCommandHelp: getTranslation('cardImageCommandHelp'),
  commandAdded: getTranslation('commandAdded'),
  commandRemoved: getTranslation('commandRemoved'),
  defaultActivity: getTranslation('defaultActivity'),
  genericError: getTranslation('genericError'),
  helpCommandText: getTranslation('helpCommandText'),
  topEmotesCommandHelp: getTranslation('topEmotesCommandHelp'),
  videoSearchCommandHelp: getTranslation('videoSearchCommandHelp'),
  //Errors
  noCardFound: getTranslation('noCardFound'),
  noEmotesFound: getTranslation('noEmotesFound'),
  notEnoughParamters: getTranslation('notEnoughParamters'),
  noVideoFound: getTranslation('noVideoFound'),
  //For unit tests
  testString: getTranslation('testString'),
};

function getTranslation(key: string): string {
  let dictionary = englishDictionary;
  if (process.env.LANGUAGE === 'da') {
    dictionary = danishDictionary;
  }
  return dictionary[key] ? dictionary[key] : englishDictionary[key];
}
