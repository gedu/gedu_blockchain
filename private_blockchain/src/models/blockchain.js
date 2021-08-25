/* ===== Blockchain ===================================
|  Class with a constructor for blockchain data model  |
|  with functions to support:                          |
|     - createGenesisBlock()                           |
|     - getLatestBlock()                               |
|     - addBlock()                                     |
|     - getBlock()                                     |
|     - validateBlock()                                |
|     - validateChain()                                |
|  ====================================================*/
const Block = require("./block");

class Blockchain {
  constructor() {
    this.chain = [];
    this.addBlock(new Block("Genesis Block"));
  }

  addBlock(newBlock) {
    if (this.chain.length > 0) {
      newBlock.previousBlockHash = this.chain[this.chain.length - 1].hash;
    }
    newBlock.generateHash();
    this.chain.push(newBlock);
  }
}

module.exports = Blockchain;
