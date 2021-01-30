import Block from "./block";
import BlockChain from "./blockchain";

export interface VerifiedBlockChainOptions {
  /**
   * Set the mining difficultly required
   * to add new blocks.
   */
  miningDifficulty?: number,
}

export default class VerifiedBlockChain extends BlockChain {
  private miningDifficulty: number;

  constructor(options?: VerifiedBlockChainOptions) {
    super();
    this.miningDifficulty = options?.miningDifficulty ?? 1;
  }

  async addBlock<T>(data: T) {
    const block = new Block<T>(this.getUnixTimestamp(), data, this.latestBlock.hash);
    await block.verify(this.miningDifficulty);
    await this.onBlockAdd(block);
    this.chain.push(block);
    return this;
  }
}

