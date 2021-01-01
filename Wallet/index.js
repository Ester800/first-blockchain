
const ChainUtil = require('../chain-util');

// this is the default file for the wallet directory (includes the wallet class)
const { INITIAL_BALANCE } = require('../config');



class Wallet {  // creates public wallet objects
    constructor() {
        this.balance = INITIAL_BALANCE;  // we set the 'initial balance' (declared in the config.js file) arbitrarily set as 500.
        this.keyPair = ChainUtil.genKeyPair(); // (initially set as null prior to chain-util.js being created);  
        this.publicKey = this.keyPair.getPublic().encode('hex'); // set as null (also acts as the public address)
    }

    toString() {  // returns to us the string represention of a wallet's properties
        return `Wallet - 
            publicKey: ${this.publicKey.toString()}  
            balance  : ${this.balance}`
    }

    sign(dataHash) {
        return this.keyPair.sign(dataHash);
    }
}


module.exports = Wallet;