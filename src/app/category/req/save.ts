import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty, IsOptional, MaxLength } from "class-validator";

export class SaveCategoryReq {
  @ApiProperty({ required: false })
  @IsDefined()
  @IsOptional()
  id: number;

  @ApiProperty({ required: true })
  @IsDefined()
  @IsNotEmpty()
  @MaxLength(250)
  name: string;

  @ApiProperty({ required: true })
  @IsDefined()
  @MaxLength(250)
  @IsOptional()
  detail: string;
}
