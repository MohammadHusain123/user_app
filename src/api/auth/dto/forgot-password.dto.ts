import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ForgotPasswordDto {
    @ApiProperty({ example: "xyz@gmail.com" })
    @IsNotEmpty()
    email: string
}