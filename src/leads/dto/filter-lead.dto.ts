import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsString, IsUUID } from "class-validator";
import { PaginationDto } from "src/common/dtos/pagination.dto";

export class FilterLeadDto extends PaginationDto {

    @IsOptional()
    @IsUUID()
    statusId?: string;

    @IsOptional()
    @IsUUID()
    userId?: string;

}