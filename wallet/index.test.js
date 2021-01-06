const Wallet = require('./index');
const TransactionPool = require('./transaction-pool');
const Blockchain = require('../blockchain');
const { INITIAL_BALANCE } = require('../config');

describe('Wallet', () => {
    let wallet, tp, bc;

    beforeEach(() => {
        wallet = new Wallet();
        tp = new TransactionPool();
        bc = new Blockchain();
    });

    describe('creating a transaction', () => {
        let transaction, sendAmount, recipient;

        beforeEach(() => {
            sendAmount = 50;
            recipient = "r4nd0m-4ddr355";
            transaction = wallet.createTransaction(recipient, sendAmount, bc, tp);
        });

        describe('and doing the same transaction', () => {
            beforeEach(() => {
                wallet.createTransaction(recipient, sendAmount, bc, tp);
            });

// 23. 
            it('doubles the `sendAmount` subtracted from the wallet balance', () => {
                expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).toEqual(wallet.balance - sendAmount * 2);
            });

// 24. 
            it('clones the `sendAmount` output for the recipient', () => {
                expect(transaction.outputs.filter(output => output.address === recipient).map(output => output.amount)).toEqual([sendAmount, sendAmount]);
            });
        });
    });

// WRITE TESTS TO VERIFY THAT THE CALCULATE BALANCE FUNCTIONS PROPERLY
    describe('calculating a balance', () => {
        let addBalance, repeatAdd, senderWallet;
    
        beforeEach(() => {
            senderWallet = new Wallet(); // creates a new wallet with initial balance of 500
            addBalance = 100;  // establish arbitrary new balance
            repeatAdd = 3; // the number of transactions to execute
            for (let i = 0; i < repeatAdd; i++) {
                senderWallet.createTransaction(wallet.publicKey, addBalance, bc, tp);
            }
            bc.addBlock(tp.transactions); // creates a block and submits it to the blockchain
        });

// 29. WRITE A TEST TO VERIFY THAT THE RECIEVING WALLET'S SHOWS ITS NEW BALANCE
        it('calculates the balance for blockchain transactions matching the recipient', () => {
            expect(wallet.calculateBalance(bc)).toEqual(INITIAL_BALANCE + (addBalance * repeatAdd));
        });

// 30. WRITE A TEST TO VERIFY THAT THE SENDERING WALLET'S BALANCE IS MINUS THE AMOUNT SENT
        it('calculates the balance for blockchain transactions matching the sender', () => {
            expect(senderWallet.calculateBalance(bc)).toEqual(INITIAL_BALANCE - (addBalance * repeatAdd));
        });

// 31. WRITE A TEST THAT CONFIRMS THE RECIPIENT OF THE PREVIOUS TRANSACTION HAS ITS BALANCE REDUCED AFTER CONDUCTION A SUBSEQUENT TRANSACTION
        describe('and the recipient conducts a transaction', () => {
            let subtractBalance, recipientBalance;

            beforeEach(() => {
                tp.clear();
                subtractBalance = 10;
                recipientBalance = wallet.calculateBalance(bc);
                wallet.createTransaction(senderWallet.publicKey, subtractBalance, bc, tp);
                bc.addBlock(tp.transactions);
            });

            describe('and the sender sends another transaction to the recipient', () => {
                beforeEach(() => {
                    tp.clear();
                    senderWallet.createTransaction(wallet.publicKey, addBalance, bc, tp);
                    bc.addBlock(tp.transactions);
                });

            it('calculates the recipient balance only using transactions since its most recent one', () => {
                expect(wallet.calculateBalance(bc)).toEqual(recipientBalance - subtractBalance + addBalance);
                });
            });
        });
    }); 
});