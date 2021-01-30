import BlockChain from ".";

function launch() {
  console.time('Launch');
  console.log('Starting...🏁')
  const blockchain = new BlockChain({ verbose: true });
  console.log('Made the chain...');

  blockchain.onBlockAdd = async (block) => {
    console.log(block);
  }

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