const ChainUtil = require('../chain-util');
const { DIFFICULTY, MINE_RATE } = require('../config');

// CREATE A CLASS THAT CAN PRODUCE UNLIMITED BLOCKS
class Block {
    constructor(timestamp, lastHash, hash, data, nonce, difficulty) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty || DIFFICULTY;
    }

    toString() {  // this toString method gives us the block with it's 4 requirements included :)
        return `Block - 
        Timestamp : ${this.timestamp}
        Last Hash : ${this.lastHash.substring(0, 10)}
        Hash      : ${this.hash.substring(0, 10)}
        Nonce     : ${this.nonce}
        Difficulty: ${this.difficulty} 
        Data      : ${this.data}`;
    }

// CREATE THE GENESIS BLOCK NECESSARY FOR ALL OTHERS TO BUILT UPON
    static genesis() {  // the static method allows us to call this function throughout the app as long as the class has been imported
        return new this('Genesis Time', '-----', 'f1r57-h45h', [], 0, DIFFICULTY);  // gives us our initial block!
    }  

// CREATE A METHOD TO MINE BLOCKS
    static mineBlock(lastBlock, data) {
        let hash, timestamp;  // declare now for later use
        const lastHash = lastBlock.hash;
        let { difficulty } = lastBlock;
        let nonce = 0;

// CREATE A DO-WHILE LOOP THAT GENERATES A NEW HASH UNTIL IT SATIFIES THE AMOUNT OF LEADING ZEROS NEEDED ACCORDING TO DIFFICULTY
        do {
            nonce++;
            timestamp = Date.now();  // the Date.now() method is native to JS (returns milliseconds passed since jan 1 1970)    
            difficulty = Block.adjustDifficulty(lastBlock, timestamp);
            hash = Block.hash(timestamp, lastHash, data, nonce, difficulty);
        } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));
        
        return new this(timestamp, lastHash, hash, data, nonce, difficulty); // gives us a new block with the data we passed in via parameters
    }

// CREATE A METHOD THAT CREATES THE HASH
    static hash(timestamp, lastHash, data, nonce, difficulty) {
        return ChainUtil.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString(); // returns a hash which was created using our inputs in string format.
    } 

// WRITE A FUNCTION THAT GENERATES A HASH FOR A GIVEN BLOCK
    static blockHash(block) { 
        const { timestamp, lastHash, data, nonce, difficulty } = block; // uses ES6 to assign variables within the block object
        return Block.hash(timestamp, lastHash, data, nonce, difficulty); // wraps around the hash function and provides the block as regular input
    }

// WRITE A FUNCTION THAT ADJUSTS THE DIFFICULTY OF THE NEW BLOCK BASED ON THE DIFFICULTY OF THE LAST BLOCK, PLUS OR MINUS
    static adjustDifficulty(lastBlock, currentTime) {
        let { difficulty } = lastBlock; // retrieves the difficulty of the last block for comparison
        // ternary expression to either increase or decrease the difficulty
        difficulty = lastBlock.timestamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1;
        return difficulty;
    }
}

module.exports = Block;