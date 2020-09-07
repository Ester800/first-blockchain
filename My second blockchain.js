// 1) create a block using JavaScript

class Block {
    constructor(timestamp, lastHash, hash, data) {
        this.timestamp = timestamp;
        this.lastHash = lastHash; 
        this.hash = hash;
        this.data = data;
    }
// 2) return this block 
    toString() {
        return `Block - 
        Timestamp: ${this.timestamp}
        Last Hash: ${this.lastHash.substring(0, 10)}
        Hash:    : ${this.hash.substring(0, 10)}
        Data:    : ${this.data}`;
    }

    static genesis() {
        return new this('Genesis time', '----', 'flr57-h45h', []);
    }

    static mineBlock(lastBlock, data) {
        const timestamp = Date.now();
        const lastHash = lastBlock.hash;
        const hash = 'todo-hash';

        return new this(timestamp, lastHash, hash, data);
    }
}

    





//const Block = require('./block');

const block = new Block('foo', 'bar', 'zoo', 'baz');
console.log(block.toString());
console.log(Block.genesis().toString());

//module.exports = Block;

const fooBlock = Block.mineBlock(Block.genesis(), 'foo');
console.log(fooBlock.toString());