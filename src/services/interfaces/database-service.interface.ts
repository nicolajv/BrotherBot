interface DatabaseService {
  delete(table: string, filterField: string, filterValue: string): Promise<void>;
  getAllFromTable(table: string): Promise<Array<Record<string, unknown>>>;
  incrementFieldFindByFilter(
    table: string,
    filterField: string,
    filterValue: string,
    incrementField: string,
    increase?: boolean,
  ): Promise<void>;
  save(table: string, object: Record<string, unknown>): Promise<void>;
}
