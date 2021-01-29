import BlockChain from ".";

function launch() {
  console.time('Launch');
  console.log('Starting...🏁')
  const blockchain = new BlockChain();
  console.log('Made the chain...');

  const interval = setInterval(async () => {
    await blockchain.addBlock({ 
      name: 'block',
      description: 'This is data for a block'
    })
  }, 1200);

  setTimeout(() => {
    clearInterval(interval);
    console.log('Stopping...✅')
    console.timeEnd('Launch');
  }, 5000);
}

launch()