const GeduToken = artifacts.require("GeduToken");

module.exports = function (deployer) {
  deployer.deploy(GeduToken);
};
const Migrations = artifacts.require("Migrations");
