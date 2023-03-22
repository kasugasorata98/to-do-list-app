import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import MongooseClient from './src/database/MongooseClient'
import { config } from './src/configs'
dotenv.config()

async function main() {
  const app = express()

  app.use(cors())
  app.use(express.json())
  app.use(
    express.urlencoded({
      extended: true,
    })
  )

  MongooseClient.connect(config.mongoDBString)
    .then(async res => {
      console.log('MongoDB connected to ' + res.connections[0].name)
      app.listen(config.port, () => {
        console.log('User listening at port: ' + config.port)
      })
    })
    .catch(err => {
      console.log(err)
    })
}
main()
