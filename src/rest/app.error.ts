export class AppException extends Error {
  code: number;
  message: string;
  data: any;

  constructor(code: number, message: string, data: any = null) {
    super();
    this.code = code;
    this.message = message;
    this.data = data;
  }
}
