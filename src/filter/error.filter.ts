import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { instanceToPlain } from "class-transformer";
import { Response } from "express";
import { AppException } from "src/rest/app.error";
import { AppResponse } from "src/rest/app.response";
import {
  CannotCreateEntityIdMapError,
  EntityMetadataNotFoundError,
  EntityNotFoundError,
  QueryFailedError,
} from "typeorm";

@Catch()
export class ErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    let resCode = HttpStatus.OK;
    const req = ctx.getRequest();
    const res = ctx.getResponse<Response>();
    res.setHeader("Connection", "close");

    const data = AppResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, "");

    switch (exception.constructor) {
      case ForbiddenException:
        data.code = HttpStatus.FORBIDDEN;
        data.message = "Forbidden";
        break;
      case UnauthorizedException:
        resCode = HttpStatus.UNAUTHORIZED;
        data.code = HttpStatus.UNAUTHORIZED;
        data.message = "Unauthorized";
        break;
      case NotFoundException:
        data.code = HttpStatus.NOT_FOUND;
        data.message = "Page Not Found";
        break;
      case HttpException:
        data.message = (exception as HttpException).message;
        break;
      case BadRequestException:
        const msg = (exception as BadRequestException).getResponse()["message"];
        data.code = HttpStatus.BAD_REQUEST;
        if (typeof msg == "object") {
          data.message = msg.map((e: string) => e).join(", ");
        } else {
          data.message = msg;
        }
        break;
      case QueryFailedError:
      case CannotCreateEntityIdMapError:
        data.code = HttpStatus.UNPROCESSABLE_ENTITY;
        data.message = "ErrorQuery";
        break;
      case EntityNotFoundError:
      case EntityMetadataNotFoundError:
        data.code = HttpStatus.NOT_FOUND;
        data.message = "Data Not Found";
        break;
      case AppException:
        let ext = exception as AppException;
        data.code = ext.code;
        data.message = ext.message;
        data.data = ext.data;
        break;
      case Error:
        if ((exception as Error).message.startsWith("ENOENT")) {
          data.code = HttpStatus.NOT_FOUND;
          data.message = "Page Not Found";
        } else {
          data.message = (exception as Error).message;
        }
        break;
      default:
        if (typeof exception == "object") {
          data.message = "message" in exception ? exception["message"].toString() : exception.toString();
        } else {
          data.message = exception.toString();
        }
        break;
    }
    let json = instanceToPlain(data);
    if (!process.env.NODE_ENV) {
      console.log("------------------------------");
      console.log("path:", req.path);
      console.log("error", data);
      console.error(exception);
      console.log("------------------------------");
    }
    res.status(resCode).send(json);
  }
}
