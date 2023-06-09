import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Matches, MaxLength, MinLength } from "class-validator";

export class ResetPasswordDto {
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(12)
    @ApiProperty({ example: 'Xyz@7862' })
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'password too weak' })
    password: string
}