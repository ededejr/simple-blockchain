import * as fs from 'fs';
import * as path from 'path';
import Block from "./block";
import VerifiedBlockChain, { VerifiedBlockChainOptions } from "./verified-blockchain";

const { access, mkdir, writeFile } = fs.promises;

export interface FileBlockChainOptions extends VerifiedBlockChainOptions {
  /**
   * Where to store the files.
   */
  outFolder?: string,
}

export default class FileBlockChain extends VerifiedBlockChain {
  outFolder = './data';
  blocksFolder: string;

  constructor(options?: FileBlockChainOptions) {
    super();

    if (options?.outFolder) {
      this.outFolder = options?.outFolder;
    }

    this.blocksFolder = path.join(this.outFolder, 'blocks');
  }

  async onBlockAdd<T>(block: Block<T>) {
    await this.writeBlock<T>(block);
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
    filepath = filepath || path.join(this.outFolder, `${Date.now()}.json`);
    await this.ensureDir(filepath);
    const blocks = this.chain.map(b => b.toJSON());

    try {
      await writeFile(filepath, JSON.stringify(blocks, null, 2), 'utf-8');
    } catch (error) {
      this.logger.error('Could not write chain to file.', error);
    }

    return filepath;
  }

  private async writeBlock<T>(block: Block<T>) {
    const filepath = path.join(this.blocksFolder, `${block.hash}.json`);
    await this.ensureDir(filepath);

    try {
      await writeFile(filepath, block.toString(), 'utf-8'); 
    } catch (error) {
      this.logger.error('Could not write block', error);
    }
  }
}

