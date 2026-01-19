import { Inject, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { write } from "fs";
import morgan from 'morgan';
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger, stream } from "winston";

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
    constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) { }

    use(req: Request, res: Response, next: NextFunction) {
        morgan.token('body', (req: Request) => JSON.stringify(req.body));

        const morganMiddleware = morgan(
            ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms - :body',
            {
                stream: {
                    write: (message: string) => {
                        this.logger.info(message.trim(), { context: 'HTTP' });
                    },
                },
            },
        );
        morganMiddleware(req, res, next);
    }

}