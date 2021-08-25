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
    this.addBlock(createGenesisBlock());
  }

  createGenesisBlock() {
    return new Block("Genesis Block");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    if (this.chain.length > 0) {
      newBlock.previousBlockHash = this.getLatestBlock().hash;
    }
    newBlock.height = this.chain.length;
    newBlock.time = new Date().getTime().toString().slice(0, -3); //UTC format
    newBlock.generateHash();
    this.chain.push(newBlock);
  }
}

module.exports = Blockchain;
