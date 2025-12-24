import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsInt, IsNotEmpty, IsNumber, IsPhoneNumber, IsString, IsUUID, MinLength } from "class-validator";

export class CreateLeadDto {
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

    @IsString()
    @IsEmail()
    @ApiProperty()
    email: string;

    @IsString()
    @IsPhoneNumber()
    @ApiProperty()
    phone: string;

    @IsNotEmpty()
    @IsUUID()
    @ApiProperty()
    statusId: string;

    @IsNotEmpty()
    @IsUUID()
    @ApiProperty()
    userId: string;
}
