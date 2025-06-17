import { NestApplicationOptions, ValidationPipe } from "@nestjs/common";
import { json, urlencoded } from "express";
import { WinstonModule } from "nest-winston";
import { join } from "path";
import { transports, format, config } from "winston";
import "winston-daily-rotate-file";

const env = process.env.NODE_ENV || "";

export const maxUpload = json({ limit: "20mb" });

export const urlEncoded = urlencoded({ limit: "20mb", extended: true });

export const validation = new ValidationPipe({ whitelist: true, stopAtFirstError: true });

export const appOpt: NestApplicationOptions = {
  cors: true,
  logger: env
    ? WinstonModule.createLogger({
        levels: config.npm.levels,
        transports: [
          new transports.DailyRotateFile({
            filename: join(process.cwd(), "logs", `%DATE%.log`),
            level: "debug",
            datePattern: "YYYY-MM-DD",
            zippedArchive: false,
          }),
          new transports.Console({
            level: "debug",
            format: format.printf(
              (error) => `${[error.timestamp]} [${error.context}] : ${error.level} : ${error.message}`
            ),
          }),
        ],
        exitOnError: false,
        format: format.combine(
          format.errors({ stack: true }),
          format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
          format.printf((error) => `${[error.timestamp]} [${error.context}] : ${error.level} : ${error.message}`)
        ),
      })
    : ["debug", "log", "verbose"],
};
