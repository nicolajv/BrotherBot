import { danishDictionary } from '../../translations/da';

describe('Danish translation', () => {
  it('Uses danish language', async () => {
    process.env = Object.assign(process.env, { LANGUAGE: 'da' });
    const translations = (await import('../../data/translator')).translations;
    expect(translations.callStarted).toEqual(danishDictionary.callStarted);
  });
});
