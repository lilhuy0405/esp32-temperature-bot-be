import {Repository} from "typeorm";
import {Temperature} from "../entity/Temperature";
import {AppDataSource} from "../data-source";

class TemperatureService {
  private readonly _temperatureRepository: Repository<Temperature>;

  constructor() {
    this._temperatureRepository = AppDataSource.getRepository(Temperature);
  }

  async create(temperature: Temperature): Promise<Temperature> {
    const existedTemperature = await this.findByCreatedAt(temperature.createdAt);
    if (existedTemperature) {
      return existedTemperature;
    }
    return await this._temperatureRepository.save(temperature);
  }

  async findByCreatedAt(createdAt: number): Promise<Temperature | undefined> {
    return await this._temperatureRepository.findOne({
      where: {
        createdAt,
      },
    });
  }
  //get lastest temperature
  async getTemperature(limit = 100) {
    return await this._temperatureRepository.find({
      order: {
        createdAt: "DESC",
      },
      take: limit,
    });
  }
}

export default TemperatureService
