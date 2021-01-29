import BlockChain from ".";

interface Person {
  name: string
}

function launch() {
  console.time('Launch');
  console.log('Starting...🏁')
  const blockchain = new BlockChain<Person>();
  console.log('Made the chain...');

  const interval = setInterval(async () => {
    await blockchain.addBlock({ name: 'block' })
    console.log('Added block');
  }, 1200);

  setTimeout(() => {
    clearInterval(interval);
    console.log('Stopping...✅')
    console.timeEnd('Launch');
  }, 5000);
}

class Chained<T> extends Array<T> {
  push (...items: T[]) {
    console.log(this);
    console.log(items);
    console.log('Pushing');
    return super.push(...items);
  }
}

launch()