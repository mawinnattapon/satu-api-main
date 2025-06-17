import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ConfigEntity } from "src/entities/config.entity";
import { Repository } from "typeorm";
import { ConfigRes } from "./res/config";

@Injectable()
export class ConfigService {
  constructor(
    @InjectRepository(ConfigEntity) private comfRepo: Repository<ConfigEntity>
  ) {}

  async config(): Promise<ConfigRes> {
    const ls: ConfigEntity[] = await this.comfRepo.findBy({});
    return ConfigRes.init(ls);
  }

}
