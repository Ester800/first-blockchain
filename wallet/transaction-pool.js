const Transaction = require("./transaction");


// THE TRANSACTION POOL IS A TEMPORARY HOLDING AREA FOR TRANSACTION BEFORE THEY ARE CONFIRMED VALID AND INCLUDED IN A BLOCK BY A MINER
class TransactionPool {
    constructor() {
    this.transactions = [];
    }

// WE DON'T WANT DUPLICATE TRANSACTIONS IN THE POOL, SO WRITE A FUNCTION THAT CHECKS IF IT EXISTS, IF SO REPLACE IT, IF NOT, ADD IT TO THE POOL
    updateOrAddTransaction(transaction) {
        // check to make sure the incoming transaction is NOT already present in the pool, if it is...we need to replace it with the updated transaction!
        let transactionWithId = this.transactions.find(t => t.id === transaction.id);
        
        if(transactionWithId) {
            this.transactions[this.transactions.indexOf(transactionWithId)] = transaction;
        } else {
            this.transactions.push(transaction);
        }    
    }


    existingTransaction(address) {
        return this.transactions.find(t => t.input.address === address);
    }

// WRITE A VALIDTRANSACTIONS FUNCTION WE WANT TO RETURN ANY TRANSACTION IN THE POOL ARRAY THAT MEETS THE FOLLOWING CONDITIONS:
//   1. its total output amount matches the original balance in the input amount - inhibits sending more or less than allowed by transaction's parameters
//   2. verify signature of each transaction to make sure the data has not been corrupted
    validTransactions() {
        return this.transactions.filter(transaction => {
            const outputTotal = transaction.outputs.reduce((total, output) => { // looks at each transaction
                return total + output.amount;  // computes a growing total
            }, 0);  // initial value is set to zero

// check if the total amount matches the original amount intended
            if (transaction.input.amount !== outputTotal) {
                console.log(`Invalid transaction from ${transaction.input.address}.`);
                return; // rejects the transaction and quits the function
            }

// verify that the signatures are valid, if not reject it
            if (!Transaction.verifyTransaction(transaction)) {
                console.log(`Invalid signature from ${transaction.input.address}.`);
                return; // rejects the transaction and quits the function
            }

            return transaction; // if a transaction has passed the above parameters, it is considered valid
        });
    }

// CREATE A FUNCTION THAT CLEARS THE POOL OF ALL TRANSACTIONS
    clear() {
        this.transactions = [];
    }
}

module.exports = TransactionPool;