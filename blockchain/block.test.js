const Block = require('./block');  // imports our Block class for use in testing
//const { DIFFICULTY } = require('../config');

// WRITE TESTS THAT CONFIRM THE BLOCK IS FUNCTIONING PROPERLY
describe('Block', () => {
    let data, lastBlock, block;  // set these variables global so they are available within EACH test! (otherwise we'll have to declare them within each test)

    beforeEach(() => {  
        data = 'bar';
        lastBlock = Block.genesis();
        block = Block.mineBlock(lastBlock, data);
    });
// 1: TESTS WHETHER OR NOT THE BLOCK HAS THE APPROPRIATE DATA
    it('sets the `data` to match the input', () => {  // the "it" function is jest specific!
        expect(block.data).toEqual(data); // "expect" and ".toEqual" are just specific tests
    });
// 2. TESTS WHETHER OR NOT THE CURRENT HASH MATCHES THE HASH OF THE LASTBLOCK
    it('sets the `lastHash` to match the hash of the last block', () => {
        expect(block.lastHash).toEqual(lastBlock.hash);
    });

// 10. TESTS WHETHER OR NOT OUR HASH MATCHES THE DIFFICULTY WITH THE CORRECT NUMBER OF LEADING ZEROS
    it('generates a hash that matches the difficulty', () => {
        expect(block.hash.substring(0, block.difficulty)).toEqual('0'.repeat(block.difficulty));
        //console.log(block.toString());
    });

// 11. TEST WHETHER OR NOT THE DIFFICULTY IS LOWERED AFTER A LENGHTY MINED BLOCK
    it('lowers the difficulty for slowly mined blocks', () => {
        expect(Block.adjustDifficulty(block, block.timestamp + 360000)).toEqual(block.difficulty - 1);
    });

// 12. TEST WHETHER OR NOT THE DIFFICULTY IS INCREASED AFTER A QUICKLY MINED BLOCK
    it('raises the difficulty for quickly mined blocks', () => {
        expect(Block.adjustDifficulty(block, block.timestamp + 1)).toEqual(block.difficulty + 1);
    });
});