import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { RouterModule } from "@nestjs/core";
import { APP_INTERCEPTOR, APP_FILTER } from "@nestjs/core";
import { ScheduleModule } from "@nestjs/schedule";
import { ServeStaticModule } from "@nestjs/serve-static";
import { SecureUtil } from "src/util/secure.util";
import { RestInterceptor } from "src/interceptor/rest.interceptor";
import { ErrorFilter } from "src/filter/error.filter";
import { routes } from "./routes";
import { Config } from "./config";
import { connection } from "./database/connection";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TaskModule } from "./module/task.module";
import { AuthManagerModule } from "./module/authen.module";
import { AppController } from "./app/controller";

@Module({
  imports: [
    AuthManagerModule,
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    RouterModule.register(routes),
    ServeStaticModule.forRoot({ rootPath: Config.publicUri }),
    TypeOrmModule.forRoot(connection),
    ...routes.filter((e) => e.module != null).map((e) => e.module),
    TaskModule,
  ],
  controllers: [AppController],
  providers: [
    SecureUtil,
    { provide: APP_FILTER, useClass: ErrorFilter },
    { provide: APP_INTERCEPTOR, useClass: RestInterceptor },
  ],
})
export class AppModule implements NestModule {
  configure(_: MiddlewareConsumer) {}
}
