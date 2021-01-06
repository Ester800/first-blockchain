const EC = require('elliptic').ec;  // imports functionality to assign cryptic keys, both public and private
const SHA256 = require('crypto-js/sha256');  // imports functionality for creating our hashes * npm install crypto-js --save *
const { v1: uuidv1 } = require('uuid');  // imports functionality for creating a unique id for individual transactions
const ec = new EC('secp256k1');
//  Standards of Efficient Cryptography -- Prime -- 256bits(32 bytes) -- koblets -- 1 (first implementation of current algorythm)

// CREATE A CLASS TO HANDLE THE UTILITIES OF OUR BLOCKCHAIN
class ChainUtil {
    static genKeyPair() {
        return ec.genKeyPair();
    }

// WRITE A FUNCTION THAT CREATES A UNIQUE ID FOR EACH TRANSACTION
    static id() {
        return uuidv1();
    }

// WRITE A FUNCTION THAT CREATES A HASH FOR EACH TRANSACTION...transforms incoming data into a string!
    static hash(data) {
        return SHA256(JSON.stringify(data)).toString();
    }

// WRITE A FUNCTION TO VERIFY INCOMING SIGNATURES
    static verifySignature(publicKey, signature, dataHash) { // this functionality comes to us via elliptic
        return ec.keyFromPublic(publicKey, 'hex').verify(dataHash, signature);
    }
}


module.exports = ChainUtil;