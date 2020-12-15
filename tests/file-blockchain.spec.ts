import { expect } from 'chai';
import { createHash } from 'crypto';
import * as fs from 'fs';
import { Block, FileBlockChain } from "../src";

const { access } = fs.promises;

async function makeFileChain (count = 10) {
  const ledger = new FileBlockChain();
  
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

describe('File BlockChain', () => {
  it('has genesis Block on creation', () => {
    const ledger = new FileBlockChain();
    expect(ledger.latestBlock).to.be.instanceOf(Block);
  });

  it('can add blocks', async () => {
    const ledger = new FileBlockChain();
    expect(ledger.length).to.equal(1);
    await ledger.addBlock<{ amount: number }>({ amount: 100 });
    expect(ledger.length).to.equal(2);
  });

  describe('Characteristics', () => {
    let ledger: FileBlockChain;

    async function getLedger () {
      if (!ledger) {
        ledger = await makeFileChain();
      }
      return ledger;
    }

    it('allows iteration', async () => {  
      const ledger = await getLedger();
      for (const block of ledger) {
        expect(block).to.be.instanceOf(Block);
      }
    });
  
    it('can validate itself', async () => {
      const ledger = await getLedger();
      expect(ledger.isValid).to.be.true;
    });
  
    it('does not allow editing blocks', async () => {
      const ledger = await getLedger();
      try {
        ledger.chain[2].data.amount = 4000;  
      } catch (error) {
        expect(true); 
      }
    });

    it('can output to files', async () => {
      const ledger = await getLedger();
      const filepath = await ledger.writeChain();

      try {
        await access(filepath);
        expect(true);
      } catch (error) {
        console.error(error);
        expect(false);
      }
    });
  });
});