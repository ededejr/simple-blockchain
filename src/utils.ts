import winston from "winston";
import Block from "./block";

winston.addColors({
  error: 'red',
  block: 'green',
  chain: 'yellow',
});

export const GenesisBlockValue = Symbol('genesis-block');
export const CalculateBlockHash = Symbol('calculate-block-hash');
export type LoggerOptions = winston.LoggerOptions;
export type BlockchainLogger = winston.Logger;
const toLogsDir = (filename: string) => `blockchain-logs/${filename}`;
const defaultLoggerOptions: winston.LoggerOptions = {
  levels: {
    error: 3,
    block: 4,
    chain: 5,
    info: 6,
    debug: 7,
  },
  format: winston.format.combine(
    winston.format.simple(),
    winston.format.colorize(),
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      level: 'chain',
      filename: toLogsDir('chain-activity.log'),
    }),
    new winston.transports.File({
      filename: toLogsDir('events.log'),
    }),
  ]
}

/**
 * Creates a Winston Logger.
 * 
 * @see https://github.com/winstonjs/winston
 * @param options - `winston.LoggerOptions` for the Logger.
 */
export function createLogger(options?: winston.LoggerOptions) {
  const defaultOptions = { ...defaultLoggerOptions };
  Object.assign(defaultOptions, options);
  return winston.createLogger(defaultOptions);
}

/**
 * Extends `Array` to only push Blocks
 * and log when a block is pushed.
 * 
 * @param logger - A winston logger for observability.
 */
export class Chain extends Array {
  private log: (message: string) => void;

  constructor(logger: winston.Logger) {
    super();
    this.log = (message) => logger.log({ 
      level: 'chain', 
      message
    });
  }

  push(...blocks: Block<any>[]) {
    for (const block of blocks) {
      this.log(`Added block ${block.hash}` );
    }

    return super.push(arguments);
  }
}