import { Injectable } from "@nestjs/common";
import { Transform, TransformCallback } from "stream";

type TransformFunction = (data: any) => any;

@Injectable()
export class DataTransform extends Transform {
  transformFunction: TransformFunction;

  constructor(options: any, transformFunction: any) {
    super({ readableObjectMode: true, writableObjectMode: true, ...options });
    this.transformFunction = transformFunction;
  }

  _transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback) {
    try {
      const transformedData = this.transformFunction(chunk);
      this.push(transformedData);
      callback();
    } catch (error) {
      callback(error);
    }
  }

  static modifyData(transformFunction: TransformFunction) {
    return new DataTransform({}, transformFunction);
  }
}