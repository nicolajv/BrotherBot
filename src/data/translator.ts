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
  dictionarySearchCommandHelp: getTranslation('dictionarySearchCommandHelp'),
  genericError: getTranslation('genericError'),
  helpCommandText: getTranslation('helpCommandText'),
  topEmotesCommandHelp: getTranslation('topEmotesCommandHelp'),
  videoSearchCommandHelp: getTranslation('videoSearchCommandHelp'),
  // Params
  customCommandParam1N: getTranslation('customCommandParam1N'),
  customCommandParam1D: getTranslation('customCommandParam1D'),
  customCommandParam2N: getTranslation('customCommandParam2N'),
  customCommandParam2D: getTranslation('customCommandParam2D'),
  customCommandParam3N: getTranslation('customCommandParam3N'),
  customCommandParam3D: getTranslation('customCommandParam3D'),
  cardImagineCommandParam1N: getTranslation('cardImagineCommandParam1N'),
  cardImagineCommandParam1D: getTranslation('cardImagineCommandParam1D'),
  definitionCommandParam1N: getTranslation('definitionCommandParam1N'),
  definitionCommandParam1D: getTranslation('definitionCommandParam1D'),
  videoCommandParam1N: getTranslation('videoCommandParam1N'),
  videoCommandParam1D: getTranslation('videoCommandParam1D'),
  // Errors
  noCardFound: getTranslation('noCardFound'),
  noDictionaryEntryFound: getTranslation('noDictionaryEntryFound'),
  noEmotesFound: getTranslation('noEmotesFound'),
  notEnoughParamters: getTranslation('notEnoughParamters'),
  noVideoFound: getTranslation('noVideoFound'),
  // For unit tests
  testString: getTranslation('testString'),
};

function getTranslation(key: string): string {
  let dictionary = englishDictionary;
  if (process.env.LANGUAGE === 'da') {
    dictionary = danishDictionary;
  }
  return dictionary[key] ? dictionary[key] : englishDictionary[key];
}
