//const Block = require('./blockchain/block');  // imports the block class from block.js

// <- the following 3 lines were designed to test the block functionality * npm run dev-test *
//  const block = new Block('foo', 'bar', 'zoo', 'baz');
//  console.log(block.toString());
//  console.log(Block.genesis().toString());
//  -- once that was accomplished they were no longer needed! -->


//const fooBlock = Block.mineBlock(Block.genesis(), 'foo');
//console.log(fooBlock.toString());

// ** quieted everything above during step 33 of tutorial...start with a clean slate! **


// <-- the following 4 lines of code test the functionality of the adjustDifficulty function * npm run dev-test *
// const Blockchain = require('./blockchain');

// const bc = new Blockchain();

// for (let i = 0; i < 10; i++) {
//     console.log(bc.addBlock(`foo ${i}`).toString());
// }
//  ----> 


// <-- teh following 3 lines of code test the functionality of the publicKey function * npm run dev-test *
const Wallet = require('./wallet');

const wallet = new Wallet();
console.log(wallet.toString());
//  ---->
