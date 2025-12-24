import { IsOptional, IsPositive, Min } from "class-validator";
import { PaginationDto } from "src/common/dtos/pagination.dto";

export class FilterUserDto extends PaginationDto {

    @IsOptional()
    firstName?: string;

    @IsOptional()
    lastName?: string;

    @IsOptional()
    email?: string;

    @IsOptional()
    isActive?: boolean;
}