const Block = require('./block');

// CREATE A CLASS THAT WILL PROVIDE US A BLOCKCHAIN
class Blockchain {
    constructor() {
        this.chain = [Block.genesis()];
    }

// CREATE A METHOD THAT ADDS A NEW BLOCK TO THE CHAIN
    addBlock(data) {        // passes in the data we want stored

        //const lastBlock = this.chain[this.chain.length - 1]; // gets the length of the chain, subtracts one and selects this as the last block
        //const block = Block.mineBlock(lastBlock, data); // generates a new block and passes in our data
        //this.chain.push(block); // pushes this new block onto the array of blocks
        // refactoring the above 3 lines of code gives us the following:
        const block = Block.mineBlock(this.chain[this.chain.length - 1], data);
        this.chain.push(block);

        return block; 
    }

// WRITE A FUNCTION THAT CHECKS WHETHER INCOMING CHAINS ARE VAILD OR NOT, IF NOT...REJECT
    isValidChain(chain) {
        // 1. check that incoming chain begins with proper genesis block.
        // to compare the two blocks...stringify them both and see if they match, if not...set to false.
        if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false;
        
        // 2. run a validation on each subsequent block of the incoming chain
        for (let i = 1; i < chain.length; i++) {
            const block = chain[i]; // get each block of the incoming chain...
            const lastBlock = chain[i - 1]; // get the block before the current block
            
            if (block.lastHash !== lastBlock.hash ||  // verify the two hashes match, if not invalidate the chain
                block.hash !== Block.blockHash(block)) {  // verify that the hash of current block matches its' unique "generated" hash
                return false;
            }
        }

        return true;
    } 

// WRITE A FUNCTION THAT REPLACES THE CURRENT CHAIN WITH THE INCOMING VALIDATED CHAIN
    replaceChain(newChain) {
        // first, make sure the length of the new chain is longer than the current chain
        if (newChain.length <= this.chain.length) {
            console.log('Received chain is not longer than the current chain.');
            return;  // if it is not longer, reject because the chain is invalid

        // second, make sure the incoming chain is a valid chain
        } else if (!this.isValidChain(newChain)) { 
            console.log('The received chain is not valid');
            return;  // if newChain is not a valid chain, then reject
        }

        console.log('Replacing blockchain with the new chain');
        this.chain = newChain;  // replaces the current chain with the incoming chain
    }
}

module.exports = Blockchain;