import winston from "winston";

winston.addColors({
  error: 'red',
  block: 'green',
  chain: 'yellow',
});

export const GenesisBlockValue = Symbol('genesis-block');
export const CalculateBlockHash = Symbol('calculate-block-hash');
export type LoggerOptions = winston.LoggerOptions;
export type BlockchainLogger = winston.Logger;

/**
 * Creates a Winston Logger.
 * 
 * @see https://github.com/winstonjs/winston
 * @param options - `winston.LoggerOptions` for the Logger.
 */
export function createLogger(options?: winston.LoggerOptions) {
  const defaultOptions = {
    levels: {
      error: 3,
      block: 4,
      chain: 5,
      info: 6,
      debug: 7,
    },
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.prettyPrint(),
      winston.format.simple(),
    ),
    transports: [
      new winston.transports.Console(),
    ]
  };
  Object.assign(defaultOptions, options);
  return winston.createLogger(defaultOptions);
}