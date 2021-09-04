require("dotenv").config();
const Web3 = require("web3");

const web3 = new Web3(process.env.GANACHE_URL);

web3.eth.getAccounts().then(console.log);
