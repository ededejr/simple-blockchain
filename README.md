# Simple Blockchain

A simple POC for implementing a Blockchain with typescript. There's a couple of different versions in here extending the capabilities of how this might be used.

* `BlockChain`: The simplest version of the block chain which keeps all data in an in-memory `Chain`.
* `VerifiedBlockChain`: The next step, adding in block verification and mining.
* `FileBlockChain`: Now with mining and block verification, this one can output its blocks and chain to a file system!

## Usage
```
// We'll set up an interface to work with our 
// recordable data
interface Transaction {
    amount: number,
    from: string,
    to: string
}

// Next let's create the block chain
const ledger = new BlockChain();


// Yay! Now we can add some blocks
ledger.addBlock<Transaction>({ 
  amount: 10, 
  from: 'Jack', 
  to: 'Mill' 
});

ledger.addBlock<Transaction>({ 
  amount: 5, 
  from: 'Mill', 
  to: 'Jack' 
});

// Lets make sure our chain is valid
if (ledger.isValid) {
  console.log('Hooray!!');
}
```