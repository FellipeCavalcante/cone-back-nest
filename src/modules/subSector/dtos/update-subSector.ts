import { IsString } from "class-validator";

export class UpdateSubSectorDto {
  @IsString()
  readonly name: string;
}
