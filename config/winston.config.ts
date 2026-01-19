import {utilities as nestWinstonModuleUtilities, WinstonModuleOptions} from 'nest-winston'
import * as winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'

const logFormate = winston.format.combine(
    winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
    winston.format.errors({stack: true}),
    winston.format.splat(),
    winston.format.json(),
)

const dailyRotateFileTransport: DailyRotateFile = new DailyRotateFile({
    filename: 'logs/application-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    level: "http",
    format: logFormate,
})

const dailyRotateErrorTransport: DailyRotateFile = new DailyRotateFile({
    filename: 'logs/error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    level: 'error',
    format: logFormate,
})

export const winstonConfig: WinstonModuleOptions = {
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike('NEST', {
              colors: true,
              prettyPrint: true,
              processId: true,
              appName: true,
            }),
      ),
    }),
    dailyRotateFileTransport,
    dailyRotateErrorTransport,
  ],
};