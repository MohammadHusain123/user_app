import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class PaginationDto {
    @IsOptional()
    @ApiProperty()
    page?: number

    @ApiProperty()
    @IsOptional()
    limit?: number

    @ApiProperty()
    rawQuery?: string
}