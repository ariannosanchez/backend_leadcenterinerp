import { Transform, Type } from "class-transformer";
import { IsBoolean, IsInt, IsOptional, IsPositive, IsString, Min } from "class-validator";
import { PaginationDto } from "src/common/dtos/pagination.dto";

export class FilterLeadStatusDto extends PaginationDto {

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @Transform(({ value }) => {
        if (value === 'true') return true;
        if (value === 'false') return false;
        return undefined;
    })
    @IsBoolean()
    isActive?: boolean;

}