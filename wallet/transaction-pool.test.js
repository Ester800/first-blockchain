const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('./index');
const Blockchain = require('../blockchain');

describe('TransactionPool', () => {
    let tp, wallet, transaction, bc;

    beforeEach(() => {
        tp = new TransactionPool();
        wallet = new Wallet();
        bc = new Blockchain();
        // transaction = Transaction.newTransaction(wallet, 'r4nd-4ddr355', 30);
        // tp.updateOrAddTransaction(transaction); * quieted these 2 lines after adding the line below
        transaction = wallet.createTransaction('r4nd-4ddr355', 30, bc, tp);
    });


// 21.  CONFIRMS THAT THE TRANSACTION HAS BEEN ADDED TO THE POOL
    it(`adds a transaction to the pool`, () => {
        expect(tp.transactions.find(t => t.id === transaction.id)).toEqual(transaction);
    });

// 22. CONFIRMS THAT IF THE TRANSACTION ALREADY EXISTS, IT IS UPDATED
    it(`updates a transaction in the pool`, () => {
        const oldTransaction = JSON.stringify(transaction);
        const newTransaction = transaction.update(wallet, 'foo-4ddr355', 40);
        tp.updateOrAddTransaction(newTransaction);

        expect(JSON.stringify(tp.transactions.find(t => t.id === newTransaction.id))).not.toEqual(oldTransaction);
    });

// WRITE A TEST THAT CONFIRMS THAT THE TRANSACTION POOL HAS BEEN CLEARED
// 28.
    it('clears transactions', () => {
        tp.clear();
        expect(tp.transactions).toEqual([]);
    })

// WRITE TESTS THAT CONFIRM AND PASS VALID TRANSACTIONS WHILE DENYING INVALID TRANSACTIONS
    describe('mixing valid and invalid transactions', () => {
        let validTransactions;

        beforeEach(() => {
            validTransactions = [...tp.transactions];
            for (let i = 0; i < 6; i++) { // run for 6 cycles
                wallet = new Wallet();
                transaction = wallet.createTransaction('r4nd-4ddr355', 30, bc, tp);
                if(i % 2 == 0) { // every other instance, we set the amount to an unrealistic figure, therefore it gets rejected
                    transaction.input.amount = 99999;
                } else {
                    validTransactions.push(transaction);
                }
            }
        });

// 25. WRITE A TEST THAT SHOWS US REJECTED INVALID TRANSACTIONS
        it('shows a difference between valid and corrupt transaction', () => {
            expect(JSON.stringify(tp.transactions)).not.toEqual(JSON.stringify(validTransactions));
        });

// 26. WRITE A TEST THE VERIFIES VALID TRANSACTIONS 
        it('grabs valid transactions', () => {
            expect(tp.validTransactions()).toEqual(validTransactions);
        });
    });
});