const Websocket = require('ws'); // imports websocket

const P2P_PORT = process.env.P2P_PORT || 5001;  // sets default port, or allows user to establish their own port
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];  // if a peers environment variable exits (a list of websockets, if it doesn't...we create one)
const MESSAGE_TYPES = {  // these message types help the recieving socket know what type of data we have incoming...
    chain: 'CHAIN',  //  ...if it is an incoming chain, we'll want the socket to replace its existing chain...
    transaction: 'TRANSACTION', // ... however, if it is only a transaction, it will be added to the transaction pool
    clear_transactions: 'CLEAR_TRANSACTIONS'  // ...new type added available for broadcasting
};

// CREATE A PEER-TO-PEER SERVER CLASS
class P2pServer {
    constructor(blockchain, transactionPool) {  
        this.blockchain = blockchain; // this gives each user their own copy of the blockchain
        this.transactionPool = transactionPool; // provides a pool for the transactions
        this.sockets = []; // contains a list of connected websocket servers
    }

// CREATE A FUNCTION TO START THE SERVER AND CREATE THE FIRST INSTANCE
    listen() {  
        const server = new Websocket.Server({ port: P2P_PORT }); // creates our server
        server.on('connection', socket => this.connectSocket(socket)); // this event listener listens for incoming types of messages sent to websocket server 
        
        this.connectToPeers(); // ensures that later instances of the application connect to the original immediately

        console.log(`Listening for peer-to-peer connections on: ${P2P_PORT}`);
    }

// CREATE THE CONNECTTOPEERS FUNCTION USED ABOVE (LINE 18)
    connectToPeers() {
        peers.forEach(peer => {  //  cycles through the peersArray and assigns a socket object to each peer
            // ws://localhost:5001
            const socket = new Websocket(peer);

            socket.on('open', () => this.connectSocket(socket));  
        });
    }

// CREATE THE CONNECTSOCKET FUNCTION THAT PUSHES OUR SOCKET INTO THE ARRAY
    connectSocket(socket) {
        this.sockets.push(socket);  // pushes the socket into the array
        console.log('socket connected');
        
        this.messageHandler(socket); // all sockets run through this function, therefore we can attach our message handler here
    
        // socket.send(JSON.stringify(this.blockchain.chain));  // this actually sends the message (quieted this line after moving it into the sendChain function below)
        this.sendChain(socket);  // once we eliminated the line above, we now call the said helper function!
    }

// CREATE A FUNCTION THAT HOLDS AN EVENT LISTENER THAT HAS A SOCKET OBJECT
    messageHandler(socket) {
        socket.on('message', message => {
            const data = JSON.parse(message); // transforms stringified json into a javascript object within the data variable
            //console.log('data', data);  // confirms we are getting the data

// CREATE A SWITCH CASE TO HANDLE THE DIFFERENT TYPES OF INCOMING MESSAGES
            switch(data.type) {
                case MESSAGE_TYPES.chain:
                    this.blockchain.replaceChain(data.chain); // replaces the existing chain with the newest version
                    break;
                case MESSAGE_TYPES.transaction:
                    this.transactionPool.updateOrAddTransaction(data.transaction); // adds or updates a transaction to the pool
                    break;
                case MESSAGE_TYPES.clear_transactions:
                    this.transactionPool.clear();
                    break;
            }
      
            // this.blockchain.replaceChain(data); // this replaces a socket's chain with the updated version - quieted when we addded the switch case
        });
    }

// WRITE A HELPER FUNCTION THAT REDUCES DUPLICATED CODE 
    sendChain(socket) { // this function eliminates line 40 above, as well as gives us functionality in syncChains function below
        socket.send(JSON.stringify( { 
            type: MESSAGE_TYPES.chain, 
            chain: this.blockchain.chain
        }));  // this actually sends the message.  We've attached the type to distiguish between a chain and a transaction
    }

// WRITE A HELPER FUNCTION THAT SENDS THE TRANSACTION (MUCH LIKE ABOVE)
    sendTransaction(socket, transaction) {
        socket.send(JSON.stringify({
            type: MESSAGE_TYPES.transaction,
            transaction
        })); // this actually send the transaction.  We've attached the type to distiguish between a chain and a transaction
    }

// WRITE A FUNCTION THAT SYNCS EVERY CHAIN WITH THE UPDATED VERSION
    syncChains() {
        this.sockets.forEach(socket => this.sendChain(socket)); // filters through our socket array and tells each socket to update!
    }

// WRITE A FUNCTION THAT BROADCASTS THE TRANSACTION TO ALL CONNECTED SOCKETS
    broadcastTransaction(transaction) {
        this.sockets.forEach(socket => this.sendTransaction(socket, transaction));
    }

    broadcastClearTransactions() {
        // cycle through each socket and send to it the message to clear it's transactions from the pool array
        this.sockets.forEach(socket => socket.send(JSON.stringify({
            type: MESSAGE_TYPES.clear_transactions
        })));
    }
}

module.exports = P2pServer;