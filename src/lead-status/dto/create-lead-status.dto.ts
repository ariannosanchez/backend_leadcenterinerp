import { IsString, MinLength } from "class-validator";

export class CreateLeadStatusDto {
    @IsString()
    @MinLength(3)
    name: string;
}
