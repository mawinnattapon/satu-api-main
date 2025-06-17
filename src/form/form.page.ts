import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsOptional } from "class-validator";
import { SortType } from "src/enum/master";

export class FormPage {
  @ApiProperty({ default: "", type: String })
  @IsOptional()
  keyword = "";

  @ApiProperty({ default: 50, type: Number })
  @IsOptional()
  per_page = 50;

  @ApiProperty({ default: 1, type: Number })
  @IsOptional()
  page = 1;

  @ApiProperty({ default: "created_at", type: String })
  @IsOptional()
  @Transform(({ value }) => (value ? value : "created_at"))
  sort_by: string = "created_at";

  @ApiProperty({ default: "desc", type: String })
  @IsOptional()
  @Transform(({ value }) => (value ? value.toUpperCase() : SortType.desc))
  sort_type: SortType = SortType.desc;
}

export const Sort = (sort: { [key: string]: string }, key: string) => {
  return key && key in sort ? sort[key] : sort[Object.keys(sort).at(0)];
};
export const ApiSortDesc = (sort: { [key: string]: string }) => {
  return [`sort_by = [${Object.keys(sort)}]`, `sort_type = [${Object.values(SortType)}]`].join("<br>");
};
