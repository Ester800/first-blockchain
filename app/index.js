const express = require('express'); // imports express suit
const bodyParser = require('body-parser'); // imports body-parser
const Blockchain = require('../blockchain') // imports blockchain folder
const P2pServer = require('./p2p-server');
const Wallet = require('../wallet');
const TransactionPool = require('../wallet/transaction-pool');
const Miner = require('./miner');

const HTTP_PORT = process.env.HTTP_PORT || 3001; // allows us to run on port 3001 by default; other ports if we choose

const app = express();  // gives us access to the express module
const bc = new Blockchain();  // creates a new instance of the Blockchain class
const wallet = new Wallet();  // creates a new instance of the Wallet class
const tp = new TransactionPool();  // creates a new instance of the TransactionPool class
const p2pServer = new P2pServer(bc, tp); // creates a new instance of the P2pServer class
const miner = new Miner(bc, tp, wallet, p2pServer);  // creates a new instance of the Miner class

app.use(bodyParser.json());  // this allows us to use json in our post request!

// WRITE A GET REQUEST TO HANDLE INQUIRIES INTO THE CHAIN - CREATE AN ENDPOINT TO VIEW BLOCKS
app.get('/blocks', (req, res) => {
    res.json(bc.chain);  // sends current chain as the response
});

// WRITE A POST REQUEST FOR SENDING BLOCKS TO THE CHAIN
app.post('/mine', (req, res) => {
    const block = bc.addBlock(req.body.data);
    console.log(`New block added: ${block.toString()}`);

    p2pServer.syncChains(); // this added feature syncs every socket with the updated chain

    res.redirect('/blocks'); // allows the user to see the block
});

// CREATE AN ENDPOINT THAT ENABLES THE USER TO VIEW ALL TRANSACTIONS IN A GIVEN POOL
app.get('/transactions', (req, res) => {
    res.json(tp.transactions);  // sends the transaction pool as the response 
});

// CREATE A POST REQUEST FOR SENDING A TRANSACTION TO THE TRANSACTION POOL
app.post('/transact', (req, res) => {  
    const { recipient, amount } = req.body;  // assumes the request contains a recipient and an amount in its data being sent
    const transaction = wallet.createTransaction(recipient, amount, bc, tp); // create a transaction with the user's wallet
    p2pServer.broadcastTransaction(transaction);

    res.redirect('/transactions');  // allows the user to see the transaction
});

// CREATE A GET REQUEST FOR MINING TRANSACTIONS
app.get('/mine-transactions', (req, res) => {
    const block = miner.mine();
    console.log(`New block has been added: ${block.toString()}`);
    res.redirect('/blocks');
});

// CREATE A GET REQUEST THAT ENABLES THE USER TO RETRIEVE AND VIEW THEIR WALLET'S PUBLIC ADDRESS (AKA PUBLIC KEY)
app.get('/public-key', (req, res) => {
    res.json({ publicKey: wallet.publicKey });
});

// WRITE A FUNCTION TO LISTEN ON THE DEDICATED PORT FOR REQUESTS
app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`));
p2pServer.listen(); // calls the peer-to-peer websocket server and starts the blockchain instance

