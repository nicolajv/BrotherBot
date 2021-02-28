interface DatabaseService {
  getAllFromTable(table: string): Promise<Array<Record<string, unknown>>>;
  incrementFieldFindByFilter(
    table: string,
    filterField: string,
    filterValue: string,
    incrementField: string,
  ): void;
  initialSetup(): Promise<void>;
}
