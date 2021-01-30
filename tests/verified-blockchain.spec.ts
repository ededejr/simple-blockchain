import { expect } from 'chai';
import { Block, VerifiedBlockChain } from "../src";
import { createHash } from 'crypto';

async function makeVerifiedChain (count = 10) {
  const ledger = new VerifiedBlockChain();

  while (count) {
    const amount = count * Math.floor(Math.random() * 200);
    await ledger.addBlock({ 
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
    await ledger.addBlock({ amount: 100 });
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
});