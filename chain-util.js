const EC = require('elliptic').ec;
const SHA256 = require('crypto-js/sha256');
const { v1: uuidv1 } = require('uuid');
const ec = new EC('secp256k1');
                // "Standards of Efficient Cryptography" "Prime" 256bits - "koblets" - "1 = first implimentation of this curved algorythm"

class ChainUtil {
    static genKeyPair() {
        return ec.genKeyPair();  // returns a call of the ec instance, creating a key/pair object; allows us to a. use methods to get the public/private keys.
    }

    static id() {
        return uuidv1();
    }

    static hash(data) {
        return SHA256(JSON.stringify(data)).toString();
    }
}


module.exports = ChainUtil;