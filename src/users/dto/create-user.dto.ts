import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @ApiProperty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @ApiProperty()
    lastName: string;

    @IsEmail()
    @ApiProperty()
    email: string;

    @IsString()
    @MinLength(6)
    @MaxLength(12)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).+$/)
    @ApiProperty()
    password: string;
}
