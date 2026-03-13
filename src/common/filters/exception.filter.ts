import { ArgumentsHost, ExceptionFilter, HttpException, HttpStatus, Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request, Response } from "express";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";

export class GlobalExceptionFilter implements ExceptionFilter {
    constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger, @Inject(ConfigService) private readonly configService: ConfigService) { }
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        // Ignore favicon requests - this is normal browser behavior
        if (request.url === '/favicon.ico') {
            response.status(204).end();
            return;
        }

        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal Server Error';
        let error = 'Error';
        const isDevelopment = this.configService.get<string>('NODE_ENV') === 'development';
        this.logger.error('Unhandled exception caught', {
            context: 'GlobalExceptionFilter',
            statusCode,
            path: request.url,
            method: request.method,
            exception: exception instanceof Error ? exception.message : String(exception),
            trace:
                isDevelopment && exception instanceof Error
                    ? exception.stack
                    : undefined,
        })

        // Check if exception has a status property
        if (
            typeof exception === 'object' &&
            exception !== null &&
            'status' in exception &&
            typeof exception.status === 'number'
        ) {
            statusCode = exception.status;
        }

        // Handle NestJS HttpException
        if (exception instanceof HttpException) {
            statusCode = exception.getStatus();
            const res = exception.getResponse();
            if (typeof res === 'string') message = res;
            else if (typeof res === 'object' && res['message']) {
                const resMessage = res['message'] as string | string[];
                message = Array.isArray(resMessage)
                    ? resMessage.join(', ')
                    : String(resMessage);
            }
            error = exception.name;
        }

        // Generic JS Error
        else if (exception instanceof Error) {
            // statusCode = exception.;
            message = exception.message;
            error = exception.name;
        }

        response.status(statusCode).json({
            success: false,
            statusCode,
            message,
            error,
            timestamp: new Date().toISOString(),
            path: request.url,
            stack:
                isDevelopment && exception instanceof Error
                    ? exception.stack
                    : null,
        });
    }
}