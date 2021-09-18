/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import * as env from 'env-var';
import path from 'path';
import winston, { Logger } from 'winston';

const WEBAPP_LOG_PATH = env.get('WEBAPP_LOG_PATH').required().asString();

const LOG_FILE = path.resolve(WEBAPP_LOG_PATH, `webapp.log`);
const TRACE_FILE = path.resolve(WEBAPP_LOG_PATH, `trace.log`);

const customFormatA = (info: Record<string, string>) =>
  `[${info.timestamp}] ${info.filename} ${info.level.toUpperCase()}: ` +
  info.message;

export function createLogger(filename: string): Logger {
  return winston.createLogger({
    defaultMeta: { filename },
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json(),
    ),
    level: 'silly',
    transports: [
      new winston.transports.File({ filename: TRACE_FILE }),
      new winston.transports.File({
        filename: LOG_FILE,
        level: 'info',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.printf(customFormatA),
        ),
      }),
      new winston.transports.Console({
        level: 'info',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.printf(customFormatA),
        ),
      }),
    ],
  });
}
