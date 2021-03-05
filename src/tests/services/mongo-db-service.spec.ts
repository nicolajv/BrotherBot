import { MongoDBService } from '../../services/mongo-db-service';
import { JestHelper } from '../mocks/jest-helper';
import { MongoDBMock } from '../mocks/mongo-db-mock';

const jestHelper = new JestHelper();

const testString = 'test';
const tableContents = [{ test: testString }];

describe('Mongo DB Service', () => {
  it('Can get data from a table', async () => {
    const mongoDBService = new MongoDBService();
    mongoDBService['MongoClient'] = jestHelper.setPropertyToAnything(new MongoDBMock());
    const tableData = mongoDBService.getAllFromTable(testString);
    await expect(tableData).resolves.not.toThrowError();
    expect(await tableData).toEqual(tableContents);
  });

  it('Can throw error if connection is broken (get data)', async () => {
    const mongoDBService = new MongoDBService();
    mongoDBService['MongoClient'] = jestHelper.setPropertyToAnything(new MongoDBMock());
    mongoDBService['dbAddress'] = 'error';
    await expect(mongoDBService.getAllFromTable(testString)).rejects.toEqual(
      'A database error occured',
    );
  });

  it('Can increment data in a table', async () => {
    const mongoDBService = new MongoDBService();
    mongoDBService['MongoClient'] = jestHelper.setPropertyToAnything(new MongoDBMock());
    const incrementSpy = jest.spyOn(mongoDBService, 'incrementFieldFindByFilter');
    mongoDBService.incrementFieldFindByFilter(testString, testString, testString, testString);
    expect(incrementSpy).toHaveBeenCalledTimes(1);
  });

  it('Can decrease data in a table', async () => {
    const mongoDBService = new MongoDBService();
    mongoDBService['MongoClient'] = jestHelper.setPropertyToAnything(new MongoDBMock());
    const incrementSpy = jest.spyOn(mongoDBService, 'incrementFieldFindByFilter');
    mongoDBService.incrementFieldFindByFilter(
      testString,
      testString,
      testString,
      testString,
      false,
    );
    expect(incrementSpy).toHaveBeenCalledTimes(1);
  });

  it('Can throw error if connection is broken (increment)', async () => {
    const mongoDBService = new MongoDBService();
    mongoDBService['MongoClient'] = jestHelper.setPropertyToAnything(new MongoDBMock());
    mongoDBService['dbAddress'] = 'error';
    await expect(
      mongoDBService.incrementFieldFindByFilter(testString, testString, testString, testString),
    ).rejects.toEqual('A database error occured');
  });
});
