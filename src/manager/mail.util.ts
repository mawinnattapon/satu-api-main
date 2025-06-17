import { Injectable } from "@nestjs/common";
import { compile } from "handlebars";
import { readFileSync } from "fs";
import path from "path";
import { Config } from "src/config";
import { ServiceManager } from "./service.manager";
import { AppResponse } from "src/rest/app.response";
import { MailReq } from "src/partial/mail.request";
import { MailData } from "src/type/mail";

@Injectable()
export class MailUtil {
  constructor(private readonly service: ServiceManager) {}

  send = async (form: MailData): Promise<AppResponse<any>> => {
    const { email: to, subject, param, fileName, cc }: MailData = form;
    const html = this.template(fileName, param);
    const body: MailReq = {
      by: {
        name: Config.appName,
        address: Config.mailFrom,
      },
      to,
      cc: cc || [],
      subject,
      html,
    };
    return await this.service.sendMail(body);
  };

  template = (name: string, param: any): string => {
    const uri = path.join(process.cwd(), "templates", `${name}.html`);
    const template = readFileSync(uri, "utf8");
    const html = compile(template, { noEscape: true })(param);
    return html;
  };
}
