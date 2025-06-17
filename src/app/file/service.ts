import { Injectable } from "@nestjs/common";
import { AppException } from "src/rest/app.error";
import { FileUtil } from "src/util/file.util";
import { UserProfile } from "src/partial/user.profile";

@Injectable()
export class FileService {
  constructor(private readonly fileUtil: FileUtil) {}

  async uploadImage(file: any, user: UserProfile): Promise<string> {
    if (!file) throw new AppException(503, "กรุณาเลือกไฟล์เพื่ออัพโหลด");
    const name = this.fileUtil.getNameFromOrgName(file.originalname);
    const mime = this.fileUtil.getMimeFromName(file.originalname);
    if (!this.fileUtil.isImage(mime)) throw new AppException(503, "รูปแบบไฟล์ไม่ถูกต้อง");
    const size = this.fileUtil.fileSize(file.size, "MB");
    if (size > 10) throw new AppException(503, "อัพโหลดไฟล์ได้สูงสุด 10Mb");
    return await this.fileUtil.uploadFile(file, name);
  }

  async uploadFile(file: any, user: UserProfile): Promise<string> {
    if (!file) throw new AppException(503, "กรุณาเลือกไฟล์เพื่ออัพโหลด");
    const name = this.fileUtil.getNameFromOrgName(file.originalname);
    const mime = this.fileUtil.getMimeFromName(file.originalname);
    if (!this.fileUtil.isSupport(mime)) throw new AppException(503, "รูปแบบไฟล์ไม่ถูกต้อง");
    const size = this.fileUtil.fileSize(file.size, "MB");
    if (size > 10) throw new AppException(503, "อัพโหลดไฟล์ได้สูงสุด 10Mb");
    return await this.fileUtil.uploadFile(file, name);
  }
}
