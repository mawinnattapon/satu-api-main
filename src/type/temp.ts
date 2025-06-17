export interface IValidate {
  key: string;
  error_code: number[];
}

export class ValidateData implements IValidate{
  key: string;
  error_code: number[];

  constructor(data: { key: string, error_code: number[] }) {
    this.key = data.key;
    this.error_code = data.error_code;
  }
}