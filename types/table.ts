export type DataType = 'text' | 'email' | 'number' | 'date' | 'time' | 'radio' | 'checkbox' | 'textarea' | 'file_upload' | 'multi_select' | 'select' | 'boolean';

export interface TableRow {
  [key: string]: string | number | boolean | Date;
  ID: number;
}

export interface TableData extends Array<TableRow> {}

export interface TableState {
  data: TableData;
  columnNames: string[];
  dataTypes: DataType[];
}

export interface CopyState {
  [key: string]: boolean;
  url: boolean;
  embedCode: boolean;
  json: boolean;
}
