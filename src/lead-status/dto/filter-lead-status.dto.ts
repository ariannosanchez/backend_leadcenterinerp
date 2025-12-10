import { Transform, Type } from "class-transformer";
import { IsBoolean, IsInt, IsOptional, IsPositive, IsString, Min } from "class-validator";

export class FilterLeadStatusDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    limit?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    offset?: number;

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