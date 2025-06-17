import { Injectable } from "@nestjs/common";
import fs from "fs";
import { access as fsAccess, unlink as fsUnlink } from "fs/promises";
import moment from "moment";
import { join, join as pathJoin } from "path";
import { v4 as uuidv4 } from "uuid";
import { Config } from "src/config";
import { AppException } from "src/rest/app.error";
import shell from "shelljs";

@Injectable()
export class FileUtil {
  uploadUrl: string = Config.uploadUrl;
  uploadUri: string = Config.uploadUri;

  imageMime: string[] = ["png", "jpg", "jpeg"];
  docsMime: string[] = ["xls", "xlsx", "csv", "pdf", "doc", "docx", "ppt", "pptx"];
  zipMime: string[] = ["zip", "rar"];

  constructor() { }

  getUuid = () => uuidv4().split("-").at(0);

  isFile = (data: string) => {
    return data.startsWith("data:");
  };

  isImage = (mime: string) => {
    return this.imageMime.indexOf(mime) >= 0;
  };

  isDocs = (mime: string) => {
    return this.docsMime.indexOf(mime) >= 0;
  };

  isZip = (mime: string) => {
    return this.zipMime.indexOf(mime) >= 0;
  };

  isSupport = (mime: string) => {
    if (this.isImage(mime)) return true;
    if (this.isDocs(mime)) return true;
    if (this.isZip(mime)) return true;
    return false;
  };

  isValidDirectoryName = (dirName: string) => {
    const forbiddenChars = /[^a-zA-Z0-9._-]/g; // Only allow letters, numbers, hyphens and underscores
    const forbiddenNames = ["", ".", ".."]; // These names are reserved
    return !(forbiddenChars.test(dirName) || forbiddenNames.includes(dirName));
  };

  fileType = (mime: string) => {
    if (this.isImage(mime)) return "image";
    if (this.isDocs(mime)) return "file";
    throw new AppException(503, "รูปแบบไฟล์ไม่ถูกต้อง");
  };

  fileSize(byte: number, unit: string) {
    const units = ["KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    let i = 0,
      u = units.indexOf(unit),
      n = byte;
    while (i <= u) {
      ++i;
      n = n / 1024;
    }
    return parseFloat(n.toFixed(2));
  }

  getMime = (base: string) => {
    let [data, base64] = base.replace("data:", "").replace(";base64", "").split(",");
    let [_, mime] = data.split("/");
    return mime;
  };

  getNameFromOrgName = (filename: string) => {
    const fnArr = filename.split(".");
    if (fnArr.length < 2) throw new AppException(503, "รูปแบบไฟล์ไม่ถูกต้อง");
    let name = filename.substring(0, filename.lastIndexOf("."));
    return Buffer.from(name, "latin1")
      .toString("utf8")
      .replace(/[^ก-๙a-zA-Z0-9/-]+/g, "_");
  };

  getMimeFromName = (filename: string) => {
    const fnArr = filename.split(".");
    if (fnArr.length < 2) throw new AppException(503, "รูปแบบไฟล์ไม่ถูกต้อง");
    const mime = fnArr[fnArr.length - 1];
    return mime.toLowerCase();
  };

  getDetail = async (base: string, by: string = ""): Promise<object> => {
    let [data, base64] = base.replace("data:", "").replace(";base64", "").split(",");
    let [_, mime] = data.split("/");
    const base64Data = Buffer.from(base64, "base64");
    const name: string = `${by ? by + "_" : ""}${moment().format("YYMMDD")}${moment().unix().toString()}${Math.round(
      Math.random() * 99
    )}`;
    const fileUri: string = pathJoin(Config.publicUri, this.uploadUri, `${name}.${mime}`);
    const fileUrl: string = `${this.uploadUrl}/${name}.${mime}`;
    return {
      name,
      mime,
      fileUri,
      fileUrl,
      base64: base64Data,
    };
  };

  uploadBase64 = async (base: string): Promise<string> => {
    let [data, base64] = base.replace("data:", "").replace(";base64", "").split(",");
    let [_, mime] = data.split("/");
    const base64Data = Buffer.from(base64, "base64");
    const name: string = `${moment().format("YYMMDD")}${this.getUuid()}`;
    const fileUri: string = pathJoin(Config.publicUri, this.uploadUri, `${name}.${mime}`);
    const fileUrl: string = `${this.uploadUrl}/${name}.${mime}`;
    return new Promise((success, error) => {
      fs.writeFile(fileUri, base64Data, "binary", (err) => {
        if (err) {
          error(err);
        } else {
          success(fileUrl);
        }
      });
    });
  };

  uploadFile = async (file: any, fname: string, dirName: string = null): Promise<string> => {
    if (dirName?.trim()) {
      if (this.isValidDirectoryName(dirName.trim())) {
        const dir = pathJoin(Config.publicUri, this.uploadUri, dirName.trim());
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
      } else {
        throw new AppException(503, "Upload failed");
      }
    }
    const mime = this.getMimeFromName(file.originalname);
    const name: string = `${this.getUuid()}`;
    const fileUri: string = pathJoin(Config.publicUri, this.uploadUri, dirName?.trim() ?? "", `${name}.${mime}`);
    const fileUrl: string = `${this.uploadUrl}${dirName?.trim() ? "/" + dirName.trim() : ""}/${name}.${mime}`;
    return new Promise((success, error) => {
      fs.writeFile(fileUri, file.buffer, "binary", (err) => {
        if (err) {
          error(err);
        } else {
          success(fileUrl);
        }
      });
    });
  };

  uploadImport = async (file: any, fname: string): Promise<string> => {
    const mime = this.getMimeFromName(file.originalname);
    const fileUri: string = pathJoin(Config.importUri, `${fname}.${mime}`);
    return new Promise((success, error) => {
      fs.writeFile(fileUri, file.buffer, "binary", (err) => {
        if (err) {
          error(err);
        } else {
          success(fileUri);
        }
      });
    });
  };

  deleteFile = async (filename: string, dirName: string = null): Promise<boolean> => {
    try {
      const filePath = pathJoin(Config.publicUri, this.uploadUri, dirName?.trim() ?? "", filename);
      try {
        await fsAccess(filePath);
      } catch (error) {
        return false;
      }
      await fsUnlink(filePath);
      return true;
    } catch (error) {
      return false;
    }
  };

  exportBase64 = async (base: string, mime: string): Promise<string> => {
    if (!fs.existsSync(join(Config.publicUri, "export"))) fs.mkdirSync(join(Config.publicUri, "export"));

    const base64Data = Buffer.from(base, "base64");
    const name: string = `${moment().format("YYMMDD")}.${moment().unix().toString()}${Math.round(Math.random() * 999)}`;
    const fileUri: string = join(Config.publicUri, "export", `${name}.${mime}`);
    const fileUrl: string = `${Config.apiUrl}/export/${name}.${mime}`;
    return new Promise((success, error) => {
      fs.writeFile(fileUri, base64Data, { encoding: "base64" }, (err) => {
        if (err) {
          error(err);
        } else {
          success(fileUrl);
        }
      });
    });
  };

  copyFile = async (url: string): Promise<string> => {
    const filename = url.split("/").pop();
    const mime = this.getMimeFromName(filename);
    const name: string = `${this.getUuid()}`;
    const fromUri: string = join(Config.publicUri, Config.uploadUri, filename);
    if (!fs.existsSync(fromUri)) return null;
    const toName = `${name}.${mime}`;
    const toUri: string = join(Config.publicUri, Config.uploadUri, toName);
    shell.cp("-R", fromUri, toUri);
    return `${Config.uploadUrl}/${toName}`;
  };
}
