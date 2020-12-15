import Logger from "@dxede/logger";
import Block from "./block";
import { CalculateBlockHash, GenesisBlockValue, Chain } from './utils';

export default class BlockChain {
  chain: Chain;
  log: Logger;

  constructor() {
    this.log = new Logger({
      name: this.constructor.name,
    });

    this.chain = new Chain(this.log);
    this.chain.push(this.createGenesisBlock());
  }

  /**
   * Allow iterating through blocks.
   */
  [Symbol.iterator]() { 
    return this.chain.values(); 
  }

  /**
   * Create a unix timestamp for blocks.
   */
  protected getUnixTimestamp () {
    return Math.floor(new Date().getTime() / 1000);
  }

  /**
   * Create an initial block when the
   * blockchain is created.
   */
  private createGenesisBlock() {
    return new Block<typeof GenesisBlockValue>(this.getUnixTimestamp(), GenesisBlockValue, '');
  }

  /**
   * Determine if a genesis block has already
   * been made for this chain.
   */
  private get hasGenesisBlock() {
    return Boolean(this.chain.find(b => b.data === GenesisBlockValue));
  }

  private getBlockHash<T>(block: Block<T>) {
    return block[CalculateBlockHash]();
  }

  /**
   * Get the most recent addition to the chain.
   */
  get latestBlock() {
    return this.chain[this.chain.length - 1];
  }

  /**
   * Get the length of the block chain.
   */
  get length() {
    return this.chain.length;
  }

  /**
   * Determine if this is a valid blockchain.
   * Validity is determined by ensuring the chain data
   * has not been tampered with or corrupted.
   */
  get isValid () {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      // Recalculate the hash of the block and see if it matches up.
      // This allows us to detect changes to a single block
      if (currentBlock.hash !== this.getBlockHash(currentBlock)) {
        return false;
      }

      // Check if this block actually points to the previous block (hash)
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
      
    // Check the genesis block
    if (this.chain[0].data !== GenesisBlockValue) {
      return false;
    }
      
    // If we managed to get here, the chain is valid!
    return true;
  }

  /**
   * Add a new block to
   * @param data 
   */
  async addBlock<T>(data: T) {
    this.chain.push(new Block<T>(this.getUnixTimestamp(), data, this.latestBlock.hash));
    return this;
  }
}