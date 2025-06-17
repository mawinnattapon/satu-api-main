import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsEnum, IsNotEmpty, IsNumber, IsOptional, ValidateIf, isEmpty, isNotEmpty } from "class-validator";
import { FileImportStatusName } from "src/enum/master";
import { FormPage } from "src/form/form.page";

const status = `
* \`${FileImportStatusName.failed}\`: สถานะไม่สำเร็จ
* \`${FileImportStatusName.completed}\`: สถานะสำเร็จ
* \`${FileImportStatusName.pending}\`: รอดำเนินการ
* \`${FileImportStatusName.processing}\`: กำลังประมวลผล
* \`${FileImportStatusName.validate}\`: ตรวจสอบข้อมูล
`;

export class SearchUploadReq extends FormPage {

  @ApiProperty({ required: true, type: Number, example: 1, })
  @IsDefined()
  @IsNumber()
  @IsOptional()
  id: number = null;

  @ApiProperty({
    required: false,
    type: String,
    enum: FileImportStatusName,
    default: null,
    description: `Enum: ${status}`,
    example: FileImportStatusName.completed,
  })
  @IsOptional()
  @ValidateIf((e, v) => isNotEmpty(v))
  @IsEnum(FileImportStatusName)
  status: FileImportStatusName = null;

  @ApiProperty({ required: false, example: "2023-07-04T00:00:00+07:00" })
  @ValidateIf((e: SearchUploadReq, v) => isEmpty(v) && !isEmpty(e.end_date))
  @IsDefined()
  @IsNotEmpty()
  start_date: Date = null;

  @ApiProperty({ required: false, example: "2023-07-04T00:00:00+07:00" })
  @ValidateIf((e: SearchUploadReq, v) => isEmpty(v) && !isEmpty(e.start_date))
  @IsDefined()
  @IsNotEmpty()
  end_date: Date = null;

}