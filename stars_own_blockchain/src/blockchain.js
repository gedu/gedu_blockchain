/**
 *                          Blockchain Class
 *  The Blockchain class contain the basics functions to create your own private blockchain
 *  It uses libraries like `crypto-js` to create the hashes for each block and `bitcoinjs-message`
 *  to verify a message signature. The chain is stored in the array
 *  `this.chain = [];`. Of course each time you run the application the chain will be empty because and array
 *  isn't a persisten storage method.
 *
 */

const SHA256 = require("crypto-js/sha256");
const BlockClass = require("./block.js");
const bitcoinMessage = require("bitcoinjs-message");
const FIVE_MIN_WINDOW = 5 * 60000;

class Blockchain {
  /**
   * Constructor of the class, you will need to setup your chain array and the height
   * of your chain (the length of your chain array).
   * Also everytime you create a Blockchain class you will need to initialized the chain creating
   * the Genesis Block.
   * The methods in this class will always return a Promise to allow client applications or
   * other backends to call asynchronous functions.
   */
  constructor() {
    this.chain = [];
    this.height = -1;
    this.initializeChain();
  }

  /**
   * This method will check for the height of the chain and if there isn't a Genesis Block it will create it.
   * You should use the `addBlock(block)` to create the Genesis Block
   * Passing as a data `{data: 'Genesis Block'}`
   */
  async initializeChain() {
    if (this.height === -1) {
      let block = new BlockClass.Block({ data: "Genesis Block" });
      await this._addBlock(block);
    }
  }

  /**
   * Utility method that return a Promise that will resolve with the height of the chain
   */
  getChainHeight() {
    return new Promise((resolve, reject) => {
      resolve(this.height);
    });
  }

  _addBlock(block) {
    let self = this;
    return new Promise(async (resolve, reject) => {
      try {
        self.height = self.height === -1 ? 0 : ++self.height;
        if (self.height > 0) {
          block.previousBlockHash = this.chain[self.height - 1].hash;
        }
        block.height = self.height;
        block.time = new Date().getTime().toString().slice(0, -3); //UTC format
        block.hash = SHA256(JSON.stringify(block)).toString();
        self.chain.push(block);
        resolve(block);
      } catch (error) {
        reject(null);
      }
    });
  }

  /**
   * The requestMessageOwnershipVerification(address) method
   * will allow you  to request a message that you will use to
   * sign it with your Bitcoin Wallet (Electrum or Bitcoin Core)
   * This is the first step before submit your Block.
   * The method return a Promise that will resolve with the message to be signed
   * @param {*} address
   */
  requestMessageOwnershipVerification(address) {
    return new Promise((resolve) => {
      const time = new Date().getTime().toString().slice(0, -3);
      resolve(`${address}:${time}:starRegistry`);
    });
  }

  /**
   * The submitStar(address, message, signature, star) method
   * will allow users to register a new Block with the star object
   * into the chain. This method will resolve with the Block added or
   * reject with an error.
   * @param {*} address
   * @param {*} message
   * @param {*} signature
   * @param {*} star
   */
  submitStar(address, message, signature, star) {
    let self = this;
    return new Promise(async (resolve, reject) => {
      try {
        const messageTime = parseInt(message.split(":")[1]);
        const currentTime = parseInt(
          new Date().getTime().toString().slice(0, -3)
        );
        if (currentTime - messageTime < FIVE_MIN_WINDOW) {
          const isValid = bitcoinMessage.verify(message, address, signature);
          if (isValid) {
            const block = new BlockClass.Block({ star, owner: address });
            await self._addBlock(block);
            resolve(block);
          } else {
            reject("Not valid");
          }
        } else {
          reject("Five minute passed");
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * This method will return a Promise that will resolve with the Block
   *  with the hash passed as a parameter.
   * @param {*} hash
   */
  getBlockByHash(hash) {
    let self = this;
    return new Promise((resolve, reject) => {
      const blocks = self.chain.filter((block) => block.hash === hash);
      if (blocks.length > 0) {
        resolve(blocks[0]);
      } else {
        reject("Not found");
      }
    });
  }

  /**
   * This method will return a Promise that will resolve with the Block object
   * with the height equal to the parameter `height`
   * @param {*} height
   */
  getBlockByHeight(height) {
    let self = this;
    return new Promise((resolve, reject) => {
      let block = self.chain.filter((p) => p.height === height)[0];
      if (block) {
        resolve(block);
      } else {
        resolve(null);
      }
    });
  }

  /**
   * This method will return a Promise that will resolve with an array of Stars objects existing in the chain
   * and are belongs to the owner with the wallet address passed as parameter.
   * Remember the star should be returned decoded.
   * @param {*} address
   */
  getStarsByWalletAddress(address) {
    let self = this;
    let stars = [];
    return new Promise(async (resolve, reject) => {
      try {
        self.chain.forEach(async (block) => {
          const data = await block.getBData();

          if (data) {
            if (data.owner === address) {
              stars.push(data);
            }
          }
        });
        resolve(stars);
      } catch (error) {
        console.log("getStarsByWalletAddress - error: ", error);
        reject(stars);
      }
    });
  }

  /**
   * This method will return a Promise that will resolve with the list of errors when validating the chain.
   * Steps to validate:
   * 1. You should validate each block using `validateBlock`
   * 2. Each Block should check the with the previousBlockHash
   */
  validateChain() {
    let self = this;
    let errorLog = [];
    return new Promise(async (resolve, reject) => {
      try {
        const legacyBlock = self.chain[0];
        const isLegacyValid = await legacyBlock.validate();
        if (!isLegacyValid) {
          errorLog.push("Invalid legacy block");
        }

        for (let i = 1; i < self.chain.length; i++) {
          let currentBlock = self.chain[i];
          const isBlockValid = await currentBlock.validate();
          if (!isBlockValid) {
            errorLog.push(`Block ${currentBlock.height} is corrupted`);
          }
          let previousBlock = self.chain[i - 1];
          if (previousBlock.hash !== currentBlock.previousBlockHash) {
            errorLog.push(
              `Block ${currentBlock.height} previous hash is different`
            );
          }
        }
        resolve(errorLog);
      } catch (error) {
        errorLog.push("Something went wrong");
        reject(errorLog);
      }
    });
  }
}

module.exports.Blockchain = Blockchain;
