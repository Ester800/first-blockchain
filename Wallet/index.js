
const ChainUtil = require('../chain-util');

const Transaction = require('./transaction');
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

    createTransaction(recipient, amount, blockchain, transactionPool) {
        this.balance = this.calculateBalance(blockchain);

        if (amount > this.balance) {
            console.log(`Amount: ${amount} exceeds the current balance: ${this.balance}`);
            return;
        }

        let transaction = transactionPool.existingTransaction(this.publicKey);

        if (transaction) {
            transaction.update(this, recipient, amount);
        } else {
            transaction = Transaction.newTransaction(this, recipient, amount);
            transactionPool.updateOrAddTransaction(transaction);
        }

        return transaction;
    }

    calculateBalance(blockchain) {
        let balance = this.balance;
        let transactions = [];

        blockchain.chain.forEach(block => block.data.forEach(transaction => {
            transaction.push(transaction);
        }));

        const walletInputTs = transactions.filter(transaction => transactions.input.address === this.publicKey);

        let startTime = 0;
        
        if (walletInputTs.length > 0) {
            const recentInputT = walletInputTs.reduce((prev, current) => prev.input.timestamp > current.input.timestamp ? prev : current);

            balance = recentInputT.outputs.find(output => output.address === this.publicKey).amount;
            startTime = recentInputT.input.timestamp;
        }

        transactions.forEach(transaction => {
            if (transaction.input.timestamp > startTime) {
                transaction.outputs.find(output => {
                    if (output.address === this.publicKey) {
                        balance += output.amount;
                    }
                });
            }
        });

        return balance;
    }

    static blockchainWallet() {
        const blockchainWallet = new this();
        blockchainWallet.address = 'blockchain-wallet';
        return blockchainWallet;
    }
}


module.exports = Wallet;