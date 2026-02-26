import { WinstonModuleOptions } from "nest-winston";
import * as winston from 'winston'
console.log('PORT: ', process.env.PORT)

const transports: winston.transport[] = [
    new winston.transports.Console({
        format: winston.format.combine(
            winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
            winston.format.errors({ stack: true}),
            winston.format.splat(),
            winston.format.colorize(),
            winston.format.printf(({timestamp, level, message, context, trace})=>{
                return `${timestamp} [${context || 'Application'}] ${level}: ${message}${trace ? `\n${trace}` : ''}`
            })
        )
    })
] 

export const winstonConfig: WinstonModuleOptions = {
    transports,
    level: process.env.LOG_LEVEL || 'info',
    exitOnError: false
}