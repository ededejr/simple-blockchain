import * as crypto from 'crypto';
import { CalculateBlockHash } from './utils';

export default class Block<T> {
  readonly previousHash: string;
  readonly timestamp: number;
  readonly data: T;
  private $hash: string;
  private nonce = 0;
  private $isVerified = false;

  constructor(timestamp: number, data: T, previousHash: string) {
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.data = Object.freeze(data);
    this.$hash = this.calculateHash();
  }

  private calculateHash() {
    const hashString = (this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    return crypto.createHash('sha256').update(hashString).digest('hex');
  }

  [CalculateBlockHash]() {
    return this.calculateHash();
  }

  get hash() {
    return this.$hash;
  }

  get isVerified() {
    return this.$isVerified;
  }

  async verify(difficulty: number) {
    return await new Promise((resolve) => {
      while(this.$hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
        this.nonce++;
        this.$hash = this.calculateHash();
      }

      this.$isVerified = true;
      resolve(true);
    });
  }

  toJSON() {
    return {
      previousHash: this.previousHash,
      time: this.timestamp,
      hash: this.hash,
      data: this.data,
    }
  }

  toString() {
    return JSON.stringify(this.toJSON());
  }
}