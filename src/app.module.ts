import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./modules/auth/auth.module";
import { PrismaModule } from "./config/database/prisma.module";
import { EnterpriseModule } from "./modules/enterprise/enterprise.module";
import { APP_GUARD } from "@nestjs/core";
import { UserModule } from "./modules/user/user.module";
import { SectorModule } from "./modules/sector/sector.module";
import { SubSectorModule } from "./modules/subSector/subSector.module";
import { TaskModule } from "./modules/task/task.module";
import { AuthGuard } from "./config/guard/auth.guard";
import { ProjectModule } from "./modules/project/project.module";
import { ConfigModule } from "@nestjs/config";
import { EmailModule } from "./config/email/email.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
    EnterpriseModule,
    UserModule,
    SectorModule,
    SubSectorModule,
    TaskModule,
    ProjectModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
