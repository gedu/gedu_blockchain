require("dotenv").config();
const Web3 = require("web3");
const EthereumTransaction = require("ethereumjs-tx").Transaction;

const web3 = new Web3(process.env.GANACHE_URL);
const eth = web3.eth;

const sendAddress = process.env.GANACHE_ADDRESS_ONE;
const receivingAddress = process.env.GANACHE_ADDRESS_TWO;

eth.getBalance(sendAddress).then(console.log);
eth.getBalance(receivingAddress).then(console.log);
eth.getGasPrice((error, gasPrice) => {
  if (!error) {
    console.log("GAS PRICE ETH: ", web3.utils.fromWei(gasPrice));
  } else {
    console.log("Gas Price error: ", error);
  }
});
/*
const rawTransaction = {
  nonce: 0x04,
  to: receivingAddress,
  gasPrice: "0x09184e72a000",
  gasLimit: "0x6691B7",
  value: web3.utils.toHex(web3.utils.toWei("2")),
};

const privateSignKeyHex = Buffer.from(
  process.env.GANACHE_ADDRESS_ONE_SECRET_KEY,
  "hex"
);
const tx = new EthereumTransaction(rawTransaction, {
  chain: "mainnet",
  hardfork: "muirGlacier",
});
tx.sign(privateSignKeyHex);

const serializedTransaction = tx.serialize();
eth.sendSignedTransaction(
  serializedTransaction.toString("hex"),
  (error, hash) => {
    if (!error) {
      console.log("Transaction hash: ", hash);
    } else {
      console.log("Transaction error: ", error);
    }
  }
);
*/
