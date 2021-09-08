export class MongoDBMock {
  public connect(
    uri: string,
    callback: (error: undefined | string, result: MongoDBMock) => Record<string, unknown>,
  ): void {
    let error = undefined;
    if (uri === 'error') {
      error = uri;
    }
    callback(error, this);
  }

  public db(_collection: string): MongoCollectionsMock {
    return new MongoCollectionsMock();
  }
}

class MongoCollectionsMock {
  private table = 'default';

  public collection(table: string): MongoCollectionsMock {
    this.table = table;
    return this;
  }

  public deleteOne(_filter: { filterField: string }, _options?: { upsert: boolean }): void {
    return;
  }

  public find(): MongoDocumentMock {
    return new MongoDocumentMock(this.table);
  }

  public insertOne(): void {
    return;
  }

  public updateOne(
    _filter: { filterField: string },
    _increment: { $inc: { field: number } },
    _options: { upsert: boolean },
  ): void {
    return;
  }
}

class MongoDocumentMock {
  private collection: string;

  constructor(collection: string) {
    this.collection = collection;
  }

  public toArray(): Array<Record<string, unknown>> {
    const documentList = new Array<Record<string, unknown>>();
    documentList.push({ test: this.collection });
    return documentList;
  }
}
