import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { lastValueFrom } from "rxjs";
import { Config } from "src/config";
import { AppException } from "src/rest/app.error";
import { AppResponse } from "src/rest/app.response";
import { MailReq } from "src/partial/mail.request";
import { ImportEqmReq } from "src/partial/import.request";

@Injectable()
export class ServiceManager {
  private readonly logger = new Logger(ServiceManager.name);

  constructor(private readonly http: HttpService) {}

  sendMail = async (body: MailReq): Promise<AppResponse<any>> => {
    try {
      return await this.post("/mail/send", body);
    } catch (error) {
      this.logger.error(`[TransmitEmail] - Error: ${error}`);
      return AppResponse.error(500, "Send Mail Failed.");
    }
  };

  importEqm = async (body: ImportEqmReq):Promise<AppResponse<any>> =>{
    try {
      return await this.post("/import/equipment", body);
    } catch (error) {
      this.logger.error(`[import users][session ${body.session}] - Error: ${error}`);
      return AppResponse.error(500, "An error occurred during data import.");
    }
  }

  post = async (path: string, body: any = {}): Promise<AppResponse<any>> => {
    const config = {
      baseURL: Config.serviceUrl,
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      if (Config.serviceUrl) {
        let req = this.http.post(path, body, config);
        let res = await lastValueFrom(req);
        if (res.status != 200) throw new AppException(res.status, "request fail");
        return plainToInstance(AppResponse, res.data);
      } else {
        return AppResponse.success(true);
      }
    } catch (error) {
      throw new AppException(500, error);
    }
  };
}
