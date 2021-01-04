const EC = require('elliptic').ec;
const { v1: uuidv1 } = require('uuid');
const ec = new EC('secp256k1');
//  Standards of Efficient Cryptography -- Prime -- 256bits(32 bytes) -- koblets -- 1 (first implementation of current algorythm)

// CREATE A CLASS TO HANDLE THE UTILITIES OF OUR BLOCKCHAIN
class ChainUtil {
    static genKeyPair() {
        return ec.genKeyPair();
    }

    static id() {
        return uuidv1();
    }
}


module.exports = ChainUtil;