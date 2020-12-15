import Logger from "@dxede/logger";
import Block from "./block";

export const GenesisBlockValue = Symbol('genesis-block');
export const CalculateBlockHash = Symbol('calculate-block-hash');

export class Chain extends Array {
  log: Logger;

  constructor(log: Logger) {
    super();
    this.log = log;
  }

  push(...blocks: Block<any>[]) {
    for (const block of blocks) {
      this.log.info(`Added block ${block.hash}`);
    }

    return super.push(arguments);
  }
}