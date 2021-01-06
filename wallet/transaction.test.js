const Transaction = require('./transaction');  // imports our transaction
const Wallet = require('./index');  // imports our wallet
const { MINING_REWARD } = require('../config');

// WRITE TESTS THAT CONFIRM OUR TRANSACTIONS ARE EXECUTING PROPERLY
describe('Transaction', () => {
    let transaction, wallet, recipient, amount;  // declare these now for later use

    beforeEach(() => {  // establishes these parameters before each test
        wallet = new Wallet();  // new wallet instance
        amount = 50;  // arbitrary amount for testing
        recipient = 'r3c1p13nt'; // fake recipient
        transaction = Transaction.newTransaction(wallet, recipient, amount); // fake transaction for the tests
    });

// 13. TESTS WHETHER OR NOT THE WALLET'S BALANCE DECREASES APPROPRIATELY
    it('outputs the `amount` subtracted from the wallet balance', () => {
        expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).toEqual(wallet.balance - amount);
    });

// 14. TESTS WHETHER OR NOT THE WALLET'S BALANCE INCREASES APPROPRIATELY
    it('outputs the `amount` added to the recipient', () => {
        expect(transaction.outputs.find(output => output.address === recipient).amount).toEqual(amount);
    });

// 16. TESTS WHETHER OR NOT THE INPUT BALANCE MATCHES THE BALANCE OF THE WALLET
    it('inputs the balance of the wallet', () => {
        expect(transaction.input.amount).toEqual(wallet.balance);
    });

// TEST WHETHER OR NOT THE SIGNATURE VERIFICATION WORKS PROPERLY
// 17. CHECK WHETHER OR NOT THE CLASS VALIDATES A VALID TRANSACTION
    it('validates a valid transaction', () => {
        expect(Transaction.verifyTransaction(transaction)).toBe(true);
    });

// 18. CHECK WHETHER OR NOT THE CLASS INVALIDATES A CORRUPT TRANSACTION
    it('invalidates a corrupt transaction', () => {
        transaction.outputs[0].amount = 500000; // this corrupts the transaction by changing the output amount
        expect(Transaction.verifyTransaction(transaction)).toBe(false);
    });



// WRITE A TEST THAT CONFIRMS A TRANSACTION WILL FAIL IF THE WALLET'S BALANCE IS LOWER THAN THE AMOUNT SENT 
    describe('transaction with an amount that exceeds the balance', () => {
        beforeEach(() => {
            amount = 100000;  // absurb amount 
            transaction = Transaction.newTransaction(wallet, recipient, amount); // fake transaction for test
        });

// 15. CONFIRMS THAT THE TRANSACTION FAILS IF THE AMOUNT SENT IS GREATER THAN THE WALLET'S BALANCE
        it('does not create the transaction', () => {
            expect(transaction).toEqual(undefined);
        });
    });

// WRITE TESTS TO CHECK THE FUNCTIONALITY OF THE UPDATE FUNCTION
    describe('and updating a transaction', () => {
        let nextAmount, nextRecipient; // assign these now for use later!

        beforeEach(() => {
            nextAmount = 20;  // give the new transaction an arbitrary amount
            nextRecipient = 'n3xt-4ddr355'; // give the new transaction an arbitrary recipient
            transaction = transaction.update(wallet, nextRecipient, nextAmount); // the actual update
        });

// 19. VERIFY THAT THE TRANSACTION HAS SUBTRACTED BOTH AMOUNTS FROM THE SENDER'S WALLET
        it(`substracts the next amount from the sender's output`, () => {
            expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).toEqual(wallet.balance - amount - nextAmount);
        });

// 20. VERIFY THAT WE CREATE A NEW OUTPUT FOR THE NEW RECIPIENT
        it('outputs an amount for the next recipient', () => {
            expect(transaction.outputs.find(output => output.address === nextRecipient).amount).toEqual(nextAmount);
        });
    });

// WRITE TESTS THAT VERIFY THAT REWARDS ARE GENERATED AND PAID CORRECTLY
    describe('creating a reward transaction', () => {
        beforeEach(() => {
            transaction = Transaction.rewardTransaction(wallet, Wallet.blockchainWallet());
        });

// 27. VERIFY THAT A REWARD IS CREATED AND SENT TO THE CORRECT ADDRESS
        it(`reward the miner's wallet`, () => {
            expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).toEqual(MINING_REWARD);
        });
    });
});