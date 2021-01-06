const Wallet = require('../wallet');
const Transaction = require('../wallet/transaction');

class Miner {
    constructor(blockchain, transactionPool, wallet, p2pServer) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.p2pServer = p2pServer;
    } 

//  CREATE A FUNCTION THAT ALLOWS USERS TO MINE BLOCKS AND EARN REWARDS - TIES TOGETHER EVERYTHING WE'VE BUILT UP TILL NOW
//  ...first it will grab transactions from the pool
//  ...next it create a block from those transactions
//  ...third it tells the p2pServer to synchronize the chains and include the new block
//  ...finally it will clear the transaction pool of transactions
    mine() {
        const validTransactions = this.transactionPool.validTransactions();

        // 1. include a reward for the miner
        validTransactions.push(Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet())
        );
        // 2. create a block consisting of the valid transactions
        const block = this.blockchain.addBlock(validTransactions);
        
        // 3. synchronize the chains in the peer-to-peer server
        this.p2pServer.syncChains();

        // 4. clear the transaction pool
        this.transactionPool.clear();

        // 5. broadcast to every miner to clear their transaction pool
        this.p2pServer.broadcastClearTransactions();

        return block;
    }
}


module.exports = Miner;