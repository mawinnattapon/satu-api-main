import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsEnum, IsNotEmpty } from "class-validator";
import { StatusType } from "src/enum/master";
import { FormListId } from "src/form/form.list.id";

export class EqmActiveListIdReq extends FormListId {
  @ApiProperty({ required: true })
  @IsDefined()
  @IsNotEmpty()
  @IsEnum(StatusType)
  active: StatusType;
}
