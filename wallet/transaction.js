const ChainUtil = require('../chain-util');
const { MINING_REWARD } = require('../config');

// CREATE A CLASS THAT EXECUTES TRANSACTIONS
class Transaction {
    constructor() {
        this.id = ChainUtil.id();
        this.input = null;
        this.outputs = [];
    }

// WRITE A FUNCTION THAT UPDATES AN EARLIER TRANSACTION BY COMBINING THE INPUTS AND HAVING ONLY ONE OUTPUT
    update(senderWallet, recipient, amount) {
        //first, find the original senders output object
        const senderOutput = this.outputs.find(output => output.address === senderWallet.publicKey);

        // if the new amount exceeds the original amount in the output (the balance) 
        if (amount > senderOutput.amount) {
            console.log(`Amount: ${amount} exceeds balance.`);
            return;
        }

        senderOutput.amount = senderOutput.amount - amount; // this combines the two inputs and provides a new output
        this.outputs.push({ amount, address: recipient });  // this is the new amount pushed into the output object

        // original transaction's signature is no longer valid, so we need a new signature...
        Transaction.signTransaction(this, senderWallet); // provides new input object with updated signature

        return this;
    }

// CREATE A HELPER FUNCTION THAT WILL GENERATE A TRANSACTION WITH OUTPUTS (REWARDS)
    static transactionWithOutputs(senderWallet, outputs) {
        const transaction = new this();
        transaction.outputs.push(...outputs);
        Transaction.signTransaction(transaction, senderWallet);// enabled via elliptic module
        return transaction;
    }

// CREATE A FUNCTION THAT CREATES A NEW TRANSACTION WITH THREE INPUTS: WALLET, RECIPIENT, AMOUNT
    static newTransaction(senderWallet, recipient, amount) {
        // const transaction = new this(); * quieted this line and moved it to 34 above
    
// this rejects a transaction whose transfer amount is greater than the sender's balance!
        if (amount > senderWallet.balance) {
            console.log(`Amount: ${amount} exceeds balance.`);
            return;
        }

        //  transaction.outputs.push(...[
        //    { amount: senderWallet.balance - amount, address: senderWallet.publicKey },
        //     { amount, address: recipient }
        //  ])  * quieted these lines after moving the array into the return function below
        
        return Transaction.transactionWithOutputs(senderWallet, [
            { amount: senderWallet.balance - amount, address: senderWallet.publicKey },
            { amount, address: recipient }
        ]);

        //  return transaction; * quieted this line when it was replaced with the above return
    }
// WRITE THE REWARDS FUNCTION
    static rewardTransaction(minerWallet, blockchainWallet) {
        return Transaction.transactionWithOutputs(blockchainWallet, [{
            amount: MINING_REWARD, address: minerWallet.publicKey
        }]);
    }

// WRITE A FUNCTION THAT SIGNS EACH TRANSACTION FROM THE SENDING WALLET
    static signTransaction(transaction, senderWallet) {
        transaction.input = {
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(ChainUtil.hash(transaction.outputs))
        }
    }

// WRITE A FUNCTION THAT VERIFIES THE SIGNATURE IS A VALID SIGNATURE
    static verifyTransaction(transaction) {
        return ChainUtil.verifySignature(  
            transaction.input.address, // uses the publicKey for verification (within the input object)
            transaction.input.signature,  // uses the signature (within the input object)
            ChainUtil.hash(transaction.outputs) // gets the hash form of the remaining outputs of the transaction
        );
    }
}

module.exports = Transaction;