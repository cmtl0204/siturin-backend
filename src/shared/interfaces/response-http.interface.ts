export interface ResponseHttpInterface {
  data: object | boolean | number | string | null;
  message: string | string[];
  title: string;
  pagination?: any;
}

export interface ErrorResponseHttpModel {
  data?: any;
  error: string;
  message: string | string[];
  statusCode: number;
}
