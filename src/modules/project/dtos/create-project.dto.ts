import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsString()
  readonly status?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly subSectors?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly members?: string[];
}
