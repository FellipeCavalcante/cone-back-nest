import { IsNotEmpty, IsString } from "class-validator";

export class UpdateSectorDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;
}
