const Blockchain = require('./index');
const Block = require('./block');

// WRITE TESTS THAT CONFIRM THE BLOCKCHAIN IS FUNCTIONING PROPERLY
describe('Blockchain', () => {
    let bc, bc2;  // declared variables stand for blockchain1 and blockchain2

    beforeEach(() => {
        bc = new Blockchain(); // refreshes this blochchain to a new one, so they don't pollute each other (begin with a clean slate)
        bc2 = new Blockchain();
    });

// 3. CONFIRMS THAT WE START WITH THE GENESIS BLOCK
    it('start with genesis block', () => {
        expect(bc.chain[0]).toEqual(Block.genesis());
    });
    
// 4. CONFIRMS THAT WE ADD A NEW BLOCK
    it('adds a new block', () => {
        const data = 'foo';  // this is the data we are passing in 
        bc.addBlock(data);

        expect(bc.chain[bc.chain.length - 1].data).toEqual(data);
    });

// 5. CONFIRMS THAT WE HAVE A VALID CHAIN
    it('validates a valid chain', () => {
        bc2.addBlock('foo');

        expect(bc.isValidChain(bc2.chain)).toBe(true); // toBe is jest specific
    });
    
// 6. CONFIRMS THAT IF WE CORRUPT THE GENESIS BLOCK OF BLOCKCHAIN2, THE TWO DON'T MATCH AND INVALIDATES THE CHANGE
    it('invalidates a chain with a corrupt genesis block', () => {
        bc2.chain[0].data = 'Bad data'; // changes the data within the genesis block of the second chain, thereby invalidating the chain.

        expect(bc.isValidChain(bc2.chain)).toBe(false);
    });

// 7. INVALIDATES A CORRUPT CHAIN THAT HAS A BAD BLOCK THAT IS NOT THE GENESIS BLOCK
    it('invalidates a corrupt chain', () => {
        bc2.addBlock('foo');
        bc2.chain[1].data = "not foo";

        expect(bc.isValidChain(bc2.chain)).toBe(false);
    });

// 8. CONFIRMS THAT WE HAVE REPLACED THE CURRENT CHAIN WITH THE NEW VALID CHAIN
    it('replaces the chain with a valid chain', () => {
        bc2.addBlock('goo'); // 1. add a new block
        bc.replaceChain(bc2.chain); // 2. replace the chain 

        expect(bc.chain).toEqual(bc2.chain); // 3. verifies that the newly created chain and oldChain are now identical
    });

// 9. CONFIRMS THAT THE CHANGE DOES NOT OCCUR IF THE NEWCHAIN IS NOT LONGER THAN THE CURRENT CHAIN
    it('it does not replace the chain with one of less than or equal to length', () => {
        bc.addBlock('foo'); // 1. add a new block to the original block
        bc.replaceChain(bc2.chain); // 2. replace the current chain with the new chain

        expect(bc.chain).not.toEqual(bc2.chain); // 3. chain2 is shorter than the original, therefore they are not equal
    });
});