const sha256 = require("crypto-js/sha256");

class Block {
  constructor(data) {
    this.hash = "";
    this.height = 0;
    this.body = data;
    this.time = 0;
    this.previousBlockHash = "0x";
  }

  generateHash() {
    this.hash = sha256(JSON.stringify(this)).toString();
  }
}

module.exports = Block;
