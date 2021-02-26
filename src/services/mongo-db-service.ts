import { MongoClient } from 'mongodb';
import { errors } from '../data/constants';

export class MongoDBService implements DatabaseService {
  private dbAddress = 'mongodb://database:27017/brotherbot';
  private dbName = 'brotherbot';
  private MongoClient = MongoClient;

  public getAllFromTable(table: string): Promise<Array<Record<string, unknown>>> {
    return new Promise<Array<Record<string, unknown>>>((resolve, reject) => {
      this.MongoClient.connect(this.dbAddress, async (error: Error, client: MongoClient) => {
        if (error) {
          reject(errors.databaseError);
        }

        const db = client.db(this.dbName);

        resolve(await db.collection(table).find().toArray());
      });
    });
  }

  public incrementFieldFindByFilter(
    table: string,
    filterField: string,
    filterValue: string,
    incrementField: string,
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.MongoClient.connect(this.dbAddress, async (error: Error, client: MongoClient) => {
        if (error) {
          reject(errors.databaseError);
        }

        const db = client.db(this.dbName);

        await db
          .collection(table)
          .updateOne(
            { [filterField]: filterValue },
            { $inc: { [incrementField]: 1 } },
            { upsert: true },
          );
        resolve();
      });
    });
  }
}
