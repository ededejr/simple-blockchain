import Block from "./block";
import { 
  CalculateBlockHash, 
  GenesisBlockValue,
  createLogger, 
  LoggerOptions, 
  BlockchainLogger 
} from './utils';

export interface BlockchainOptions {
  /**
   * Determines if the blockchain should log its actions.
   */
  verbose?: boolean,
  /**
   * Options for the Blockchain's Logger.
   * Uses a Winston Logger underneath.
   */
  loggerOptions?: LoggerOptions
}

export default class BlockChain {
  protected chain: Block<any>[] = [];
  protected isVerbose: boolean;
  logger: BlockchainLogger;

  constructor(options?: BlockchainOptions) {
    this.logger = createLogger(options?.loggerOptions);
    this.isVerbose = options?.verbose ?? false;
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
  protected get hasGenesisBlock() {
    return Boolean(this.chain.find(b => b.data === GenesisBlockValue));
  }

  private getBlockHash(block: Block<any>) {
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
    const block = new Block<T>(this.getUnixTimestamp(), data, this.latestBlock.hash);
    this.chain.push(block);
    this.logChainEvent(`Added Block ${block.hash}`);
    await this.onBlockAdd(block);
    return this;
  }

  /**
   * Log chain events
   * @param message 
   */
  protected logChainEvent(message: string) {
    if (this.isVerbose) {
      this.logger.log({
        level: 'chain',
        message
      });
    }
  }

  async onBlockAdd<T>(block: Block<T>) {}
}