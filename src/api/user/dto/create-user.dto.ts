import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsEmail, MinLength, MaxLength, Matches } from "class-validator"

export class CreateUserDto {

    @IsNotEmpty()
    @ApiProperty({ example: 'xyz' })
    first_name: string

    @IsNotEmpty()
    @ApiProperty({ example: 'z' })
    last_name: string

    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({ example: 'xyz@gmail.com' })
    email: string

    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(12)
    @ApiProperty({ example: 'Xyz@7862' })
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'password too weak' })
    password: string


}
