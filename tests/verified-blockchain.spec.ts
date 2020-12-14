import { expect } from 'chai';
import { Block, VerifiedBlockChain } from "../src";
import { createHash } from 'crypto';

async function makeVerifiedChain (count = 10) {
  const ledger = new VerifiedBlockChain();
  
  interface Transaction {
    amount: number,
    from: string,
    to: string
  }

  while (count) {
    const amount = count * Math.floor(Math.random() * 200);
    await ledger.addBlock<Transaction>({ 
      amount,
      from: createHash('sha256').update(`${amount}`).digest('hex'),
      to: createHash('sha256').update(`${Math.floor(Math.random() * amount)}-${amount}-next`).digest('hex'),
    });
    count--;
  }

  return ledger;
}

describe('Verified BlockChain', () => {
  it('has genesis Block on creation', () => {
    const ledger = new VerifiedBlockChain();
    expect(ledger.latestBlock).to.be.instanceOf(Block);
  });

  it('can add blocks', async () => {
    const ledger = new VerifiedBlockChain();
    expect(ledger.length).to.equal(1);
    await ledger.addBlock<{ amount: number }>({ amount: 100 });
    expect(ledger.length).to.equal(2);
  });

  it('allows iteration', async () => {
    const ledger = await makeVerifiedChain();

    for (const block of ledger) {
      expect(block).to.be.instanceOf(Block);
    }
  });

  it('can validate', async () => {
    const ledger = await makeVerifiedChain();
    expect(ledger.isValid).to.be.true;
  });

  it('does not allow editing blocks', async () => {
    const ledger = await makeVerifiedChain();
    await ledger.writeChain();
    try {
      ledger.chain[2].data.amount = 4000;  
    } catch (error) {
      expect(true); 
    }
  });
});