import Block from "./block";
import BlockChain from "./blockchain";
import * as fs from 'fs';
import * as path from 'path';

const { access, mkdir, writeFile } = fs.promises;
const OUT_FOLDER = './data';
const BLOCK_FOLDER = path.join(OUT_FOLDER, 'blocks');

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
    await this.writeBlock<T>(block);
    this.chain.push(block);
    return this;
  }

  private async ensureDir (filepath: string) {
    const dirname = path.dirname(filepath);

    try {
      await access(filepath);
    } catch (error) {
      await mkdir(dirname, { recursive: true });
    }
  }

  async writeChain(filepath?: string) {
    filepath = filepath || path.join(OUT_FOLDER, `${Date.now()}.json`);
    await this.ensureDir(filepath);
    const blocks = this.chain.map(b => b.toJSON());

    try {
      await writeFile(filepath, JSON.stringify(blocks, null, 2));
    } catch (error) {
      this.log.error('Could not write chain to file.', error);
    }
  }

  private async writeBlock<T>(block: Block<T>) {
    const filepath = path.join(BLOCK_FOLDER, `${block.hash}.json`);
    await this.ensureDir(filepath);

    try {
      await writeFile(filepath, block.toString()); 
    } catch (error) {
      this.log.error('Could not write block', error);
    }
  }
}

