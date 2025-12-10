import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class CreateLeadStatusDto {
    @IsString()
    @MinLength(3)
    @ApiProperty()
    name: string;
}
