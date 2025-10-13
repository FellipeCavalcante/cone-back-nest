import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { CreateSectorDto } from "./dtos/create-sector.dto";
import { UserDomain } from "../user/domain/user";
import { GetUser } from "src/utils/decorators/get-user.decorator";
import { CreateSectorUseCase } from "./use-cases/create-sector";
import { GetAllSectorsUseCase } from "./use-cases/get-all-sectors";
import { EditSectorUseCase } from "./use-cases/edit-sector";
import { UpdateSectorDto } from "./dtos/update-sector.dto";

@Controller("api/v2/sector")
export class SectorController {
  constructor(
    private createSectorUseCase: CreateSectorUseCase,
    private getAllSectorsUseCase: GetAllSectorsUseCase,
    private editSectorUseCase: EditSectorUseCase,
  ) {}

  @Post("create")
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() request: CreateSectorDto, @GetUser() user: UserDomain) {
    return this.createSectorUseCase.execute({ user, ...request });
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

    return this.getAllSectorsUseCase.execute(
      user,
      currentPage,
      currentPageSize,
    );
  }

  @Patch(":sectorId")
  @HttpCode(HttpStatus.OK)
  async edit(
    @Body() request: UpdateSectorDto,
    @GetUser() user: UserDomain,
    @Param("sectorId") sectorId: string,
  ) {
    return this.editSectorUseCase.execute({ user, sectorId, ...request });
  }
}
