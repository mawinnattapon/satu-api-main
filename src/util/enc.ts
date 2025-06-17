import crypto from "crypto";
import { Config } from "src/config";
import { v4 as uuidv4 } from "uuid";

export class Safe {
  static keySize = 16;
  static a = 5;
  static b = 9;
  static char = "0123456789";

  static genKeyId(): string {
    const keyId = [];
    for (let i = 0; i < this.keySize; i++) {
      const val = Math.floor(Math.random() * 10);
      keyId.push(this.char[Math.floor(val)]);
    }
    return keyId.join("");
  }

  static genCreateKey(keyId: string): string {
    const crKey: Array<number> = [];
    for (let i = 0; i < this.keySize; i++) {
      crKey.push(Math.pow(this.a, parseInt(keyId[i])) % this.b);
    }
    return crKey.join("");
  }

  static genDynamicKey(keyId: string, btext: string): string {
    if (!btext || !keyId) return "";
    const key = [];
    for (let i = 0; i < this.keySize; i++) {
      key.push(Math.pow(parseInt(btext[i]), parseInt(keyId[i])) % this.b);
    }
    return key.join("");
  }

  static toHex(txt: string): string {
    if (txt.length === 0) return "";
    return Buffer.from(encodeURI(txt)).toString("hex");
  }

  static toBase64Length16(txt: string): string {
    if (txt.length === 0) return "";
    const b64 = Buffer.from(encodeURI(txt)).toString("base64");
    return b64.substring(0, 16);
  }

  static verifyKey(bAuthKey: string, fAuthKey: string): boolean {
    if (!bAuthKey || !fAuthKey) return false;
    return bAuthKey === fAuthKey;
  }

  static getDynamicKey(authKey: string): string {
    if (!authKey) return "";
    const arr = authKey.split("|");
    if (arr.length != 2) return "";
    const atext: string = arr.at(0);
    const keyId: string = arr.at(1);
    const key: string = Safe.genDynamicKey(keyId, atext);
    return key;
  }

  static genUdid(): string {
    return uuidv4().split("-").at(0);
  }
}

export class Crypt {
  algorithm = "AES-128-CBC";
  keyText: string;
  keyEnc: string;
  ivText: string;
  iv: Buffer;
  key: Buffer;

  constructor(_key: string = null, _iv: string = null) {
    this.keyText = _key && _key.length === 16 ? _key : Config.apiKey;
    this.keyEnc = _key && _key.length === 16 ? Safe.toBase64Length16(this.keyText) : this.keyText;
    this.key = Buffer.from(this.keyEnc, "utf8");
    this.ivText = _iv && _iv.length === 16 ? _iv : Config.apiIv;
    this.iv = this.ivText ? Buffer.from(this.ivText, "utf8") : Buffer.alloc(16);
  }

  encrypt(data: any): string {
    if (!data) return "";
    const plainText: string = typeof data === "object" ? JSON.stringify(data) : String(data);
    const cipher = crypto.createCipheriv(this.algorithm, this.keyEnc, this.iv);
    return Buffer.concat([cipher.update(plainText), cipher.final()]).toString("base64");
  }

  decrypt(txt: string, isJson = true): any {
    if (!txt) return null;
    if (txt.length === 0) return null;
    const cipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
    const data = Buffer.concat([cipher.update(Buffer.from(txt, "base64")), cipher.final()]).toString("utf8");
    return isJson ? JSON.parse(data) : data;
  }
}
