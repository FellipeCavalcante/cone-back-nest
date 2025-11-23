import { IsNotEmpty, IsString } from "class-validator";

export class SelectPlanDto {
  @IsNotEmpty()
  @IsString()
  readonly plan_id: string;

  @IsNotEmpty()
  @IsString()
  readonly payment_method_id: string;
}
