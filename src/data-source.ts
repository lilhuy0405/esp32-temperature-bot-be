import "reflect-metadata"
import { DataSource } from "typeorm"
import { Temperature } from "./entity/Temperature"

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    synchronize: true,
    logging: false,
    entities: [Temperature],
    migrations: [],
    subscribers: [],
})
