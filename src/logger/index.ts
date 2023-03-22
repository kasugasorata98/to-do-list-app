import winston, { format } from 'winston'
import { Utils } from '../utils'
export interface Logs {
  endpoint?: string
  method?: string
  message?: string
  functionName?: string
  request?: any
  response?: any
  traces: Array<
    | string
    | {
        [key: string]: any
      }
  >
}
class Logger {
  private static instance: Logger
  private Winston: winston.Logger
  constructor() {
    this.Winston = winston.createLogger({
      level: 'info',
      format: format.combine(
        format.prettyPrint(),
        format.timestamp(),
        format.json()
      ),
      transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
      ],
    })
    if (!Utils.isProd()) {
      this.Winston.add(
        new winston.transports.Console({
          format: format.combine(
            format.prettyPrint(),
            format.timestamp(),
            format.json()
          ),
        })
      )
    }
  }

  public createLogObject() {
    const logs: Logs = {
      traces: [],
    }
    return logs
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  public log(message: any) {
    this.Winston.log('info', message)
  }

  public error(message: any) {
    this.Winston.log('error', message)
  }
}

export default Logger.getInstance()
