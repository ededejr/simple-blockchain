import { expect } from 'chai';
import BlockChain, { Block } from '../src';
import { createHash } from 'crypto';

function makeStandardChain (count = 10) {
  const ledger = new BlockChain();
  
  interface Transaction {
    amount: number,
    from: string,
    to: string
  }

  while (count) {
    const amount = count * Math.floor(Math.random() * 200);
    ledger.addBlock<Transaction>({ 
      amount,
      from: createHash('sha256').update(`${amount}`).digest('hex'),
      to: createHash('sha256').update(`${Math.floor(Math.random() * amount)}-${amount}-next`).digest('hex'),
    });
    count--;
  }

  return ledger;
}

describe('BlockChain', () => {
  it('has genesis Block on creation', () => {
    const ledger = new BlockChain();
    expect(ledger.latestBlock).to.be.instanceOf(Block);
  });

  it('can add blocks', () => {
    const ledger = new BlockChain();
    expect(ledger.length).to.equal(1);
    ledger.addBlock<{ amount: number }>({ amount: 100 });
    expect(ledger.length).to.equal(2);
  });

  it('allows iteration', () => {
    const ledger = makeStandardChain();

    for (const block of ledger) {
      expect(block).to.be.instanceOf(Block);
    }
  });

  it('can validate', () => {
    const ledger = makeStandardChain();
    expect(ledger.isValid).to.be.true;
  });

  it('does not allow editing blocks', () => {
    const ledger = makeStandardChain();
    try {
      ledger.chain[2].data.amount = 4000;  
    } catch (error) {
      expect(true); 
    }
  });
});