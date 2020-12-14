import Block from "./block";
import BlockChain from "./blockchain";

export interface VerifiedBlockChainOptions {
  miningDifficulty?: number,
  verifyBlocks?: boolean
}

export default class VerifiedBlockChain extends BlockChain {
  private miningDifficulty: number;

  constructor(options?: VerifiedBlockChainOptions) {
    super();
    this.miningDifficulty = options?.miningDifficulty ?? 1;
  }

  /**
   * Add a new block to
   * @param data 
   */
  async addBlock<T>(data: T) {
    const block = new Block<T>(this.getUnixTimestamp(), data, this.latestBlock.hash);
    await block.verify(this.miningDifficulty);
    this.chain.push(block);

    return this;
  }
}