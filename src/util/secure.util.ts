import crypto from "crypto";
import { genSalt, hash } from "bcrypt";
import { Injectable } from "@nestjs/common";
import { Config } from "src/config";

@Injectable()
export class SecureUtil {
  startToken = "key:";
  iv = Buffer.from([0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0]);

  constructor() {}

  hash = async (txt: string) => {
    const salt = await genSalt(10);
    return await hash(txt, salt);
  };

  getKey = () => {
    return crypto.createHash("sha1").update(Config.appKey).digest("base64").substring(0, 16);
  };

  encrypt = (data: any) => {
    const plainText = typeof data == "object" ? JSON.stringify(data) : String(data);
    const cipher = crypto.createCipheriv(Config.algorithm, this.getKey(), this.iv);
    return Buffer.concat([cipher.update(plainText), cipher.final()]).toString("base64");
  };

  decrypt = (plainText: string) => {
    const cipher = crypto.createDecipheriv(Config.algorithm, this.getKey(), this.iv);
    return Buffer.concat([cipher.update(Buffer.from(plainText, "base64")), cipher.final()]).toString("utf8");
  };

  genToken = (slug = "") => {
    const txt = crypto.randomBytes(9).toString("hex");
    return this.encrypt(this.startToken + slug + ":" + txt);
  };

  verifyToken = (token = "") => {
    const dc = this.decrypt(token);
    if (this.startToken != dc.substring(0, this.startToken.length)) return false;
    return true;
  };
}
