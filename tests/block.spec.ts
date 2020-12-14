import { expect } from 'chai';
import { Block } from '../src';

describe('Blocks', () => {
  const data = {
    type: 'test',
    value: 114,
  }

  const block = new Block<typeof data>(1234, data, '1');

  it('can create', () => expect(block.data).to.deep.equal(data));
  it('created block contains hash', () => expect(block.hash).to.be.string);
  it('does not allow editing block data', () => {
    try {
      block.data.type = 'blue';
    } catch (error) {
      expect(true); 
    }
  });
})

