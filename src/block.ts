import * as crypto from 'crypto';
import { CalculateBlockHash } from './utils';

export default class Block<T> {
  readonly previousHash: string;
  readonly timestamp: number;
  readonly data: T;
  private $hash: string;

  constructor(timestamp: number, data: T, previousHash: string) {
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.data = Object.freeze(data);

    this.$hash = this.calculateHash();
  }

  private calculateHash() {
    const hashString = (this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    return crypto.createHash('sha256').update(hashString).digest('hex');
  }

  [CalculateBlockHash]() {
    return this.calculateHash();
  }

  get hash() {
    return this.$hash;
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