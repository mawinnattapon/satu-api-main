import QRCode from "qrcode";
import fs from "fs";
import BwipJs from "bwip-js";
import { join } from "path";
import { access, unlink } from "fs/promises";
import { Config } from "src/config";
import { Safe } from "src/util/enc";

export enum QrType {
  qrcode = "q",
  barcode = "b",
}
export enum QrNo {
  eqm = "e",
  alt = "a",
}

export class QrUtil {
  //

  static exportUri: string = "export";
  static ext: string = "png";

  static qrOpt = {
    margin: 1,
    width: 500,
    type: "image/png",
  };
  static barOpt = {
    bcid: "code39",
    padding: 4,
    scale: 3,
    backgroundcolor: "#FFFFFF",
    includetext: false,
  };

  static async createQrcode(comp_id: number, no: QrNo, text: string): Promise<string[]> {
    text = text.replace(/ /g, "_");
    let url: string[] = [];
    try {
      const filePath = this.uri(this.fileName(comp_id, no, text, QrType.qrcode));
      await QRCode.toFile(filePath, text, this.qrOpt);
      url.push(this.url(this.fileName(comp_id, no, text, QrType.qrcode)));
    } catch (error) {}
    try {
      const filePath = this.uri(this.fileName(comp_id, no, text, QrType.barcode));
      let bb = await BwipJs.toBuffer({ ...this.barOpt, text });
      await new Promise((success, error) => {
        fs.writeFile(filePath, bb, "binary", (err) => {
          if (err) {
            error(err);
          } else {
            success(true);
          }
        });
      });
      url.push(this.url(this.fileName(comp_id, no, text, QrType.qrcode)));
    } catch (error) {}
    return [];
  }

  static async deleteFile(comp_id: number, no: QrNo, text: string): Promise<void> {
    try {
      const filePath = this.uri(this.fileName(comp_id, no, text, QrType.qrcode));
      await access(filePath);
      await unlink(filePath);
    } catch (error) {}
    try {
      const filePath = this.uri(this.fileName(comp_id, no, text, QrType.barcode));
      await access(filePath);
      await unlink(filePath);
    } catch (error) {}
  }

  static getQrUrl(comp_id: number, no: QrNo, text: string) {
    text = text.replace(/ /g, "_");
    return this.url(this.fileName(comp_id, no, text, QrType.qrcode));
  }

  static getBarUrl(comp_id: number, no: QrNo, text: string) {
    text = text.replace(/ /g, "_");
    return this.url(this.fileName(comp_id, no, text, QrType.barcode));
  }

  private static uri(name: string) {
    return join(Config.publicUri, this.exportUri, name);
  }

  private static url(name: string) {
    return Config.appUrl + "/" + join(this.exportUri, name);
  }

  private static fileName(comp_id: number, no: QrNo, text: string, type: QrType) {
    return `${Safe.toHex(String(comp_id))}.${text}.${no}${type}.${this.ext}`;
  }
}
