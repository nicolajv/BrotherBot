import { AnyError, MongoClient } from 'mongodb';

export class MongoDBService implements DatabaseService {
  private dbAddress = process.env.DATABASE_ENDPOINT!;
  private dbName = 'brotherbot';
  private MongoClient = MongoClient;

  public delete(table: string, filterField: string, filterValue: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.MongoClient.connect(
        this.dbAddress,
        async (error: AnyError | undefined, client: MongoClient | undefined) => {
          if (error || !client) {
            reject('A database error occured');
          } else {
            const db = client.db(this.dbName);

            await db.collection(table).deleteOne({ [filterField]: filterValue });
            resolve();
          }
        },
      );
    });
  }

  public getAllFromTable(table: string): Promise<Array<Record<string, unknown>>> {
    return new Promise<Array<Record<string, unknown>>>((resolve, reject) => {
      this.MongoClient.connect(
        this.dbAddress,
        async (error: AnyError | undefined, client: MongoClient | undefined) => {
          if (error || !client) {
            reject('A database error occured');
          } else {
            const db = client.db(this.dbName);

            resolve(await db.collection(table).find().toArray());
          }
        },
      );
    });
  }

  public incrementFieldFindByFilter(
    table: string,
    filterField: string,
    filterValue: string,
    incrementField: string,
    increase = true,
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.MongoClient.connect(
        this.dbAddress,
        async (error: AnyError | undefined, client: MongoClient | undefined) => {
          if (error || !client) {
            reject('A database error occured');
          } else {
            const db = client.db(this.dbName);

            await db
              .collection(table)
              .updateOne(
                { [filterField]: filterValue },
                { $inc: { [incrementField]: increase ? 1 : -1 } },
                { upsert: true },
              );
            resolve();
          }
        },
      );
    });
  }

  public save(table: string, object: Record<string, unknown>): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.MongoClient.connect(
        this.dbAddress,
        async (error: AnyError | undefined, client: MongoClient | undefined) => {
          if (error || !client) {
            reject('A database error occured');
          } else {
            const db = client.db(this.dbName);

            await db.collection(table).insertOne(object);
            resolve();
          }
        },
      );
    });
  }
}
