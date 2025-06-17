import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from "@nestjs/common";
import { Request } from "express";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AppResponse } from "src/rest/app.response";
import { instanceToPlain } from "class-transformer";

@Injectable()
export class RestInterceptor implements NestInterceptor {
  constructor() {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    let req: Request = context.switchToHttp().getRequest();
    let res = context.switchToHttp().getResponse();
    res.setHeader("Connection", "close");
    res.statusCode = HttpStatus.OK;
    return next.handle().pipe(map((data: any) => this.response(data, req)));
  }

  private response(data: any, req: any): Record<string, any> {
    let result: AppResponse<any>;
    if (data === null || data === undefined) {
      result = AppResponse.error(404, "Data Not Found");
    } else if (data.constructor == AppResponse) {
      result = data as AppResponse<any>;
    } else {
      result = AppResponse.success<any>(data);
    }
    let json = instanceToPlain(result);
    if (!process.env.NODE_ENV) {
      console.log("------------------------------");
      console.log("path:", req.path);
      console.log("res", json);
      console.log("------------------------------");
    }
    return json;
  }
}
