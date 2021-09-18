/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import * as env from 'env-var';
import path from 'path';
import winston, { Logger } from 'winston';

const WEBAPP_LOG_LEVEL = env.get('WEBAPP_LOG_LEVEL').default('info').asString();
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
        level: WEBAPP_LOG_LEVEL,
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.printf(customFormatA),
        ),
      }),
      new winston.transports.Console({
        level: WEBAPP_LOG_LEVEL,
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.printf(customFormatA),
        ),
      }),
    ],
  });
}

const logger = createLogger(formatFilename(__filename));

export function formatFilename(filename: string): string {
  const TARGET = '/.next/server/';
  const startIndex = filename.indexOf(TARGET) + TARGET.length;

  let output = filename;
  if (startIndex === -1) {
    logger.info(`Target not found in "${filename}".`);
  } else {
    output = filename.substring(startIndex);
  }

  const extIndex = output.lastIndexOf('.');
  const extension = output.substring(extIndex);
  if (extension === '.js') {
    output = output.substring(0, extIndex) + '.ts';
  } else if (extension === '.jsx') {
    output = output.substring(0, extIndex) + '.tsx';
  } else {
    logger.info(`Unknown extension "${extension}".`);
  }

  return output;
}
