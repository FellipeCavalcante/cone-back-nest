import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from "@nestjs/common";
import { SectorService } from "./sector.service";
import { CreateSectorDto } from "./dtos/create-sector.dto";
import { UserDomain } from "../user/domain/user";
import { GetUser } from "src/utils/decorators/get-user.decorator";

@Controller("api/v2/sector")
export class SectorController {
  constructor(private service: SectorService) {}

  @Post("create")
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() request: CreateSectorDto, @GetUser() user: UserDomain) {
    return this.service.create({ user, ...request });
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAll(
    @GetUser() user: UserDomain,
    @Query("page") page?: number,
    @Query("pageSize") pageSize?: number,
  ) {
    const currentPage = page && page > 0 ? Number(page) : 1;
    const currentPageSize = pageSize && pageSize > 0 ? Number(pageSize) : 20;

    return this.service.getAll(user, currentPage, currentPageSize);
  }
}
