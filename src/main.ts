import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { appOpt, maxUpload, urlEncoded, validation } from "./app.option";
import http from "http";

const pkg = require("../package.json");

const ev = process.env || {};
const env = ev.NODE_ENV || "";
const port = ev.NODE_PORT || 3002;
const appName = ev.APP_NAME || "";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, appOpt);

  app.useGlobalPipes(validation);
  app.use(maxUpload);
  app.use(urlEncoded);
  app.getHttpAdapter().getInstance().disable("x-powered-by");

  const server = http.createServer(app.getHttpAdapter().getInstance());
  server.keepAliveTimeout = 2000;
  server.headersTimeout = 2500;

  //Swagger init config
  if (env != "production") {
    const config = new DocumentBuilder().setTitle(appName).setVersion(pkg.version).addBearerAuth().build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("docs", app, document, { swaggerOptions: { defaultModelsExpandDepth: -1 } });
  }

  await app.listen(port, () => {
    console.log("======================================");
    console.log("started", ":", appName);
    console.log("env", ":", `${env}`);
    console.log("host", ":", `http://localhost:${port}`);
    console.log("======================================");
  });
}

bootstrap();
