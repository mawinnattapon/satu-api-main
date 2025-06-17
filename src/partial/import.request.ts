import { ApiProperty } from "@nestjs/swagger";

export class ImportEqmReq{
  @ApiProperty({ required: true, type: String, example: '77c5a7d5a8c74faca55ac6228ff797c2', })
  session: string

  @ApiProperty({ required: true, type: Number, example: 1, })
  comp_id: number

  @ApiProperty({ required: true, type: Number, example: 1, })
  create_by: number

  @ApiProperty({ required: true, type: String, example: '77c5a7d5a8c74faca55ac6228ff797c2.csv', })
  file_path: string
}