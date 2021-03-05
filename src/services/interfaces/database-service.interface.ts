interface DatabaseService {
  getAllFromTable(table: string): Promise<Array<Record<string, unknown>>>;
  incrementFieldFindByFilter(
    table: string,
    filterField: string,
    filterValue: string,
    incrementField: string,
  ): void;
  decreaseFieldFindByFilter(
    table: string,
    filterField: string,
    filterValue: string,
    decreaseField: string,
  ): void;
}
