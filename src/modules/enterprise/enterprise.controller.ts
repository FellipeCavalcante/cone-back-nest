import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from "@nestjs/common";
import { CreateEnterpriseDto } from "./dtos/create-enterprise.dto";
import { UserDomain } from "../user/domain/user";
import { GetUser } from "src/utils/decorators/get-user.decorator";
import { CreateEnterpriseUseCase } from "./use-cases/create-enterprise";
import { GetAllEnterprisesUseCase } from "./use-cases/get-all-enterprises";
import { GetAllEnterprisesMembers } from "./use-cases/get-all-enterprise-members";

@Controller("api/v2/enterprise")
export class EnterpriseController {
  constructor(
    private createEnterpriseUseCase: CreateEnterpriseUseCase,
    private getAllUseCase: GetAllEnterprisesUseCase,
    private getAllMembersUseCase: GetAllEnterprisesMembers,
  ) {}

  @Post("create")
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() request: CreateEnterpriseDto,
    @GetUser() user: UserDomain,
  ) {
    return this.createEnterpriseUseCase.execute({ user, ...request });
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query("page") page?: number,
    @Query("pageSize") pageSize?: number,
  ) {
    const currentPage = page && page > 0 ? Number(page) : 1;
    const currentPageSize = pageSize && pageSize > 0 ? Number(pageSize) : 20;

    return this.getAllUseCase.execute(currentPage, currentPageSize);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllMembers(
    @Query("enterpriseId") enterpriseId: string,
    @Query("page") page?: number,
    @Query("pageSize") pageSize?: number,
  ) {
    const currentPage = page && page > 0 ? Number(page) : 1;
    const currentPageSize = pageSize && pageSize > 0 ? Number(pageSize) : 20;

    return this.getAllMembersUseCase.execute(
      enterpriseId,
      currentPage,
      currentPageSize,
    );
  }
}
