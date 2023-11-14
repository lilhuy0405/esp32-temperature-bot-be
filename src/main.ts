import mqtt = require("mqtt");
import moment = require("moment");
import {AppDataSource} from "./data-source";
import * as express from "express"
import * as cors from "cors"
import TemperatureService from "./service/TemperatureService";
import {Temperature} from "./entity/Temperature";

//service
const temperatureService = new TemperatureService();

async function main() {
  const protocol = 'mqtt'
  const host = '54.255.62.9'
  const port = '1883'
  const path = ''
  const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

  const connectUrl = `${protocol}://${host}:${port}${path}`

  console.log(`Connecting to ${connectUrl} with clientId ${clientId}`)

  const topic = 'esp32/temperature-bot'

  const client = mqtt.connect(connectUrl, {
    clientId,
    clean: true,
    connectTimeout: 4000,
    username: 'admin',
    password: 'luuduchuy@2001',
    reconnectPeriod: 1000,
  })

  await client.subscribeAsync(topic)
  console.log(`Subscribed to topic ${topic}`);


  client.on('message', async (receivedTopic, message) => {
    if (receivedTopic !== topic) {
      return;
    }
    const dataString = message.toString();
    console.log(`Received data: ${dataString}`);
    const [humidity, temperature, heatIndex] = dataString.split(',').map(Number);
    if (!temperature || !humidity || !heatIndex) {
      console.log(`Invalid data: ${dataString}`);
      return;
    }
    const createdAt = new Date().getTime();
    const temperatureEntity = new Temperature()
    temperatureEntity.temperature = temperature;
    temperatureEntity.humidity = humidity;
    temperatureEntity.heatIndex = heatIndex;
    temperatureEntity.createdAt = createdAt;
    await temperatureService.create(temperatureEntity);
    console.log(`Saved data: ${dataString}`);
  })

  //setup express
  const app = express();
  const apiPort = 3000;
  app.use(express.json());
  app.use(cors());
  app.get('/', (req, res) => {
    res.send('ESP32 Temperature Bot');
  });
  app.get('/temperature', async (req, res) => {
    const {limit = 100} = req.query;
    try {
      const temperatures = await temperatureService.getTemperature(+limit);
      return res.status(200).json({
        data: temperatures
      });
    } catch (err: any) {
      return res.status(500).json({message: err.message});
    }
  });
  app.listen(apiPort, () => {
    console.log(`Express Server running on port ${apiPort}`);
  });

}

AppDataSource.initialize().then(async () => {
  console.log("Database initialized.")
  await main();
});
