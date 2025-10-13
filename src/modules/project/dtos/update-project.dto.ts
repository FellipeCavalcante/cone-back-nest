import { IsOptional, IsString } from "class-validator";

export class UpdateProjectDto {
  @IsString()
  @IsOptional()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly description: string;

  @IsString()
  @IsOptional()
  readonly status: string;
}
