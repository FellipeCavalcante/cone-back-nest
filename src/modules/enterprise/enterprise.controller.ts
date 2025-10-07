import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from "@nestjs/common";
import { EnterpriseService } from "./enterprise.service";
import { CreateEnterpriseDto } from "./dtos/create-enterprise.dto";
import { UserDomain } from "../user/domain/user";
import { GetUser } from "src/utils/decorators/get-user.decorator";

@Controller("api/v2/enterprise")
export class EnterpriseController {
  constructor(private service: EnterpriseService) {}

  @Post("create")
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() request: CreateEnterpriseDto,
    @GetUser() user: UserDomain,
  ) {
    return this.service.create({ user, ...request });
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query("page") page?: number,
    @Query("pageSize") pageSize?: number,
  ) {
    const currentPage = page && page > 0 ? Number(page) : 1;
    const currentPageSize = pageSize && pageSize > 0 ? Number(pageSize) : 20;

    return this.service.getAll(currentPage, currentPageSize);
  }
}
