export * from './block';
export * from './blockchain';
export * from './verified-blockchain';
export * from './file-blockchain';

import Block from './block';
import BlockChain from './blockchain';
import VerifiedBlockChain from './verified-blockchain';
import FileBlockChain from './file-blockchain';


export {
  Block,
  VerifiedBlockChain,
  FileBlockChain
}

export default BlockChain;